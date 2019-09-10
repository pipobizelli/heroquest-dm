import BoardConfig from '@@/data/board.json'
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
    this.wrapper.x = BoardConfig.margin
    this.wrapper.y = BoardConfig.margin
    this.sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/editor.json`].spritesheet
    this.TileHelper = Tile(window.Store.state.board.map)
    this.slots = 0
    this.pX = 16
    this.pY = 16
    return this
  }

  get data () {
    return this.wrapper
  }

  addSlot ({ x, y }) {
    this.slots++
    const slot = new this.PIXI.Sprite(this.sheet.textures[`${this.slots}.png`])
    slot.x = x + (16 - slot.width / 2)
    slot.y = y + (16 - slot.height / 2)
    slot.label = this.slots
    slot.type = 'slots'

    this.wrapper.addChild(slot)
    this.closeMenu()

    return slot
  }

  closeMenu () {
    // window.Store.commit('board/set_selected', [])
    window.Store.commit('board/set_components', {
      type: 'selectedTiles',
      arr: []
    })
    this.grid.drawGrid()
    this.menu.closeMenu()
  }

  addBlock (tiles) {
    // const tiles = window.Store.state.board.selectedTiles
    const config = {
      label: 'block',
      type: 'blocks',
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

      config.tiles = [tiles[t]]

      let double = false
      if (tiles[n] && (tiles[n] === next || tiles[n] === prev)) {
        config.label = 'doubleblock'
        config.width = 66
        config.tiles = [tiles[t], tiles[n]]
        double = true
      }

      if (tiles[p] && (tiles[p] === next || tiles[p] === prev)) {
        const prevTileObj = this.TileHelper.getFirstTile(tiles[t], tiles[p])
        cords.x = prevTileObj.c * 33
        cords.y = prevTileObj.l * 33
        config.tiles = [tiles[p], tiles[t]]
      }

      if (!double) {
        this.addActor({
          ...config,
          ...cords
        })

        // reset
        config.label = 'block'
        config.width = 33
      }
    }
  }

  addDoors (tiles) {
    if (tiles.length % 2 > 0) {
      return false
    }

    for (const t in tiles) {
      if (t % 2 < 1) {
        const t1 = tiles[t]
        const t2 = tiles[parseInt(t) + 1]
        const tileObj = this.TileHelper.getFirstTile(t1, t2)
        this.addActor({
          label: 'door',
          type: 'doors',
          tiles: [t1, t2],
          rotation: this.TileHelper.isTileInColumn(t1, t2) ? 90 : 0,
          anchorX: this.TileHelper.isTileInColumn(t1, t2) ? 0 : 0,
          anchorY: this.TileHelper.isTileInColumn(t1, t2) ? 1 : 0,
          x: tileObj.c * 33,
          y: tileObj.l * 33,
          height: 33,
          width: 66,
          events: false
        })
      }
    }

    this.closeMenu()
    // return door
  }

  addComponent ({ label, type = 'components', rotation = 0, y = 0, x = 0 }, tiles) {
    // const tiles = window.Store.state.board.selectedTiles
    const tileObj = this.TileHelper.getTilebyHandle(tiles[0])
    const component = new this.PIXI.Sprite(this.sheet.textures[`${label}.png`])

    component.label = label
    component.type = type
    component.tiles = tiles
    component.pivot = new this.PIXI.Point(this.pX - x, this.pY - y)
    component.x = Math.round(tileObj.c * 33) + this.pX
    component.y = Math.round(tileObj.l * 33) + this.pY
    component.angle = rotation

    component
      .on('mousedown', (event) => this.onStartDrag(event, component))
      .on('mousemove', () => this.onMoveDrag(component))
      .on('mouseupoutside', (event) => this.onStopDrag(event, { actor: component, x: this.pX, y: this.pY }))
      .on('mouseup', (event) => this.onStopDrag(event, { actor: component, x: this.pX, y: this.pY }))
      .on('rightdown', (event) => {
        const x = component.x
        const y = component.y
        this.menu.openActionsMenu({ x, y, target: component })
      })
      .interactive = true

    this.wrapper.addChild(component)
    this.closeMenu()

    return component
  }

  addActor ({ label, x, y, type = 'actors', tiles = [], anchorX = 0, anchorY = 0, rotation = 0, width = 33, height = 33, events = true, close = true }) {
    const actor = new this.PIXI.Sprite(this.sheet.textures[`${label}.png`])
    actor.type = type
    actor.label = label
    actor.tiles = tiles
    actor.width = width
    actor.height = height
    actor.anchor.set(anchorX, anchorY)
    actor.angle = rotation
    actor.x = x
    actor.y = y
    actor.buttonMode = events

    if (events) {
      this.actorEvents(actor)
    }

    this.wrapper.addChild(actor)

    if (close) {
      this.closeMenu()
    }

    return actor
  }

  actorEvents (actor) {
    actor
      .on('pointerdown', (event) => this.onStartDrag(event, actor))
      .on('pointermove', () => this.onMoveDrag(actor))
      .on('pointerupoutside', (event) => this.onStopDrag(event, { actor, x: 0, y: 0 }))
      .on('pointerup', (event) => this.onStopDrag(event, { actor, x: 0, y: 0 }))
      .on('rightdown', (e) => {
        const x = e.data.global.x
        const y = e.data.global.y
        this.menu.openActionsMenu({ x, y, target: actor })
      })
      .interactive = true

    return actor
  }

  onStartDrag (event, actor) {
    // reset grid
    this.closeMenu()

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

  onStopDrag (event, { actor, y = 0, x = 0 }) {
    const gridX = parseInt(event.data.global.x) - BoardConfig.margin
    const gridY = parseInt(event.data.global.y) - BoardConfig.margin
    const diffX = gridX % 33
    const diffY = gridY % 33
    actor.x = (gridX - diffX) + x
    actor.y = (gridY - diffY) + y
    actor.alpha = 1
    actor.dragging = false
    // set the interaction data to null
    actor.data = null
  }
}
