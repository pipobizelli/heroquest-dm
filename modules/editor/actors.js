import Config from '@@/config/env'
import Grid from './grid'
import Menu from './menu'
import Tile from '@@/helpers/tile'

let instance = null
export default class Actors {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup () {
    this.PIXI = await import('pixi.js')
    this.grid = new Grid()
    this.menu = new Menu()
    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = 6
    this.wrapper.y = 6
    this.sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
    this.TileHelper = Tile(window.Store.state.board.map)
    this.slots = 0
    return this
  }

  get data () {
    return this.wrapper
  }

  addSlot ({ x, y }) {
    this.slots++
    const slot = new this.PIXI.Sprite(this.sheet.textures[`${this.slots}.png`])
    this.addActor({
      x: x + (16 - slot.width / 2),
      y: y + (16 - slot.height / 2),
      type: this.slots,
      width: slot.width,
      height: slot.height
    })
  }

  closeMenu () {
    window.Store.commit('board/set_selected', [])
    this.grid.drawGrid()
    this.menu.closeMenu()
  }

  addBlock () {
    const tiles = window.Store.state.board.selectedTiles
    const config = {
      type: 'block',
      width: 33,
      height: 33
    }

    for (const t in tiles) {
      const tileObj = this.TileHelper.getTilebyHandle(tiles[t])
      const n = parseInt(t) + 1
      const p = parseInt(t) - 1
      const next = this.TileHelper.getTileHandle(this.TileHelper.getNextTile(tiles[t]))
      const prev = this.TileHelper.getTileHandle(this.TileHelper.getPrevTile(tiles[t]))
      const cords = {
        x: tileObj.c * 33,
        y: tileObj.l * 33
      }

      let double = false
      if (tiles[n] && (tiles[n] === next || tiles[n] === prev)) {
        config.type = 'doubleblock'
        config.width = 66
        double = true
      }

      if (tiles[p] && (tiles[p] === next || tiles[p] === prev)) {
        const prevTileObj = this.TileHelper.getFirstTile(tiles[t], tiles[p])
        cords.x = prevTileObj.c * 33
        cords.y = prevTileObj.l * 33
      }

      if (!double) {
        this.addActor({
          ...config,
          ...cords
        })

        // reset
        config.type = 'block'
        config.width = 33
      }
    }
  }

  addDoor () {
    const t1 = window.Store.state.board.selectedTiles[0]
    const t2 = window.Store.state.board.selectedTiles[1]
    const tileObj = this.TileHelper.getFirstTile(t1, t2)
    this.addActor({
      type: 'door',
      rotation: this.TileHelper.isTileInColumn(t1, t2) ? 90 : 0,
      anchorX: this.TileHelper.isTileInColumn(t1, t2) ? 0 : 0,
      anchorY: this.TileHelper.isTileInColumn(t1, t2) ? 1 : 0,
      x: tileObj.c * 33,
      y: tileObj.l * 33,
      height: 33,
      width: 66
    })
  }

  addActor ({ type, x, y, anchorX = 0, anchorY = 0, rotation = 0, width = 33, height = 33, close = true }) {
    const actor = new this.PIXI.Sprite(this.sheet.textures[`${type}.png`])
    actor.label = type
    actor.width = width
    actor.height = height
    actor.anchor.set(anchorX, anchorY)
    actor.angle = rotation
    actor.x = x
    actor.y = y
    actor.buttonMode = true

    this.actorEvents(actor)

    this.wrapper.addChild(actor)

    if (close) {
      this.closeMenu()
    }
  }

  onStartDrag (event, actor) {
    // reset grid
    window.Store.commit('board/set_selected', [])
    this.grid.drawGrid()

    actor.alpha = 0.8
    actor.dragging = true
    actor.data = event.data
  }

  onMoveDrag (actor) {
    if (actor.dragging) {
      const newPosition = actor.data.getLocalPosition(actor.parent)
      actor.x = newPosition.x
      actor.y = newPosition.y
    }
  }

  onStopDrag (event, actor) {
    const gridX = parseInt(event.data.global.x) - 6
    const gridY = parseInt(event.data.global.y) - 6
    const diffX = gridX % 33
    const diffY = gridY % 33
    actor.x = gridX - diffX
    actor.y = gridY - diffY
    actor.alpha = 1
    actor.dragging = false
    // set the interaction data to null
    actor.data = null
  }

  actorEvents (actor) {
    actor
      .on('pointerdown', (event) => this.onStartDrag(event, actor))
      .on('pointermove', () => this.onMoveDrag(actor))
      .on('pointerupoutside', (event) => this.onStopDrag(event, actor))
      .on('pointerup', (event) => this.onStopDrag(event, actor))
      .interactive = true
  }
}
