import BoardConfig from '@@/data/board.json'
// import Config from '@@/config/env'
import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Tile from '@@/helpers/tile'
import { colors } from '@@/modules/colors'

let instance = null
export default class Components {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup (sheet) {
    this.PIXI = await import('pixi.js')
    this.grid = new Grid()
    this.menu = new Menu()
    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = BoardConfig.margin
    this.wrapper.y = BoardConfig.margin
    this.sheet = this.PIXI.Loader.shared.resources[sheet].spritesheet
    this.TileHelper = Tile(window.Store.state.board.map)
    this.slots = 0
    this.pX = 16
    this.pY = 16
    return this
  }

  get data () {
    return this.wrapper
  }

  addSlot (tile) {
    const tileObj = this.TileHelper.getTilebyHandle(tile[0])
    this.slots++
    const slot = new this.PIXI.Sprite(this.sheet.textures[`${this.slots}.png`])
    slot.x = Math.round(tileObj.c * 33) + (this.pX - slot.width / 2)
    slot.y = Math.round(tileObj.l * 33) + (this.pY - slot.height / 2)
    slot.tiles = [tile]
    slot.label = this.slots
    slot.type = 'slots'
    slot.zIndex = 10

    this.wrapper.addChild(slot)
    this.closeMenu()

    return slot
  }

  closeMenu () {
    this.menu.closeMenu()
    window.Store.commit('board/set_components', {
      type: 'selectedTiles',
      arr: []
    })
    this.grid.drawGrid()
  }

  addBlock (tiles, events = true) {
    const config = {
      label: 'block',
      type: 'blocks',
      events
    }

    for (const t in tiles) {
      const n = parseInt(t) + 1
      const p = parseInt(t) - 1
      const next = this.TileHelper.getTileHandle(this.TileHelper.getNextTile(tiles[t]))
      const prev = this.TileHelper.getTileHandle(this.TileHelper.getPrevTile(tiles[t]))
      let double = false
      config.tiles = [tiles[t]]

      if (tiles[n] && tiles[n] === next) {
        config.label = 'doubleblock'
        double = true
      }

      if (tiles[p] && tiles[p] === next) {
        config.label = 'doubleblock'
        double = true
      }

      if (prev && tiles[p] === prev) {
        config.tiles = [prev]
      }

      if (!double) {
        this.addComponent({
          ...config,
          events: events
        })

        // reset
        config.label = 'block'
      }
    }
  }

  addDoor (tiles) {
    if (tiles.length !== 2) {
      return false
    }

    const t1 = tiles[0]
    const t2 = tiles[1]
    const first = this.TileHelper.getFirstTile(t1, t2)
    let tilesArr = [t1, t2]

    if (t2 === this.TileHelper.getTileHandle(first)) {
      tilesArr = [t2, t1]
    }

    const door = this.addComponent({
      label: 'door',
      type: 'doors',
      tiles: tilesArr,
      rotation: this.TileHelper.isTileInColumn(t1, t2) ? 90 : 0,
      anchorX: this.TileHelper.isTileInColumn(t1, t2) ? 0 : 0,
      anchorY: this.TileHelper.isTileInColumn(t1, t2) ? 1 : 0,
      events: false
    })

    this.closeMenu()
    return door
  }

  addDisabledTile (tile) {
    const tileSprite = new this.PIXI.Sprite(this.sheet.textures['tile.png'])
    const tileObj = this.TileHelper.getTilebyHandle(tile)
    tileSprite.label = 'disabled'
    tileSprite.x = parseInt(tileObj.c) * 33
    tileSprite.y = parseInt(tileObj.l) * 33
    tileSprite.tint = colors.darkGray
    tileSprite.alpha = 0.6
    this.wrapper.addChild(tileSprite)
  }

  addComponent ({ label, type = 'components', rotation = 0, y = 0, x = 0, width = 0, height = 0, tiles = [], events = true, close = true }) {
    if (tiles.length <= 0) {
      return false
    }

    const tileObj = this.TileHelper.getTilebyHandle(tiles[0])
    const component = new this.PIXI.Sprite(this.sheet.textures[`${label}.png`])

    component.label = label
    component.type = type
    component.tiles = tiles
    component.height = height > 0 ? height : component.height
    component.width = width > 0 ? width : component.width
    component.pivot = new this.PIXI.Point(this.pX - x, this.pY - y)
    component.x = Math.round(tileObj.c * 33) + this.pX
    component.y = Math.round(tileObj.l * 33) + this.pY
    component.angle = rotation
    component.buttonMode = events

    if (events) {
      this.componentEvents(component)
    }

    this.wrapper.addChild(component)

    if (close) {
      this.closeMenu()
    }

    return component
  }

  componentEvents (component) {
    component
      .on('mousedown', (event) => this.onStartDrag(event, component))
      .on('mousemove', () => this.onMoveDrag(component))
      .on('mouseupoutside', (event) => this.onStopDrag(event, { component, x: this.pX, y: this.pY }))
      .on('mouseup', (event) => this.onStopDrag(event, { component, x: this.pX, y: this.pY }))
      .on('rightdown', (event) => {
        const x = component.x
        const y = component.y
        this.menu.openActionsMenu({ x, y, target: component })
      }).interactive = true

    return component
  }

  onStartDrag (event, component) {
    this.closeMenu()
    component.alpha = 0.8
    component.dragging = true
    component.data = event.data
  }

  onMoveDrag (component) {
    if (component.dragging) {
      const newPosition = component.data.getLocalPosition(component.parent)
      component.x = newPosition.x
      component.y = newPosition.y
    }
  }

  onStopDrag (event, { component, y = 0, x = 0 }) {
    const gridX = parseInt(event.data.global.x) - BoardConfig.margin
    const gridY = parseInt(event.data.global.y) - BoardConfig.margin
    const diffX = gridX % 33
    const diffY = gridY % 33
    component.x = (gridX - diffX) + x
    component.y = (gridY - diffY) + y
    component.alpha = 1
    component.dragging = false

    const tile = `${Math.round(component.y / 33)}:${Math.round(component.x / 33)}`
    window.Store.commit('board/move_component', {
      component: {
        moveTo: [tile],
        tiles: component.tiles,
        type: component.type,
        rotation: component.angle || 0
      }
    })
    component.tiles = [tile]
  }
}
