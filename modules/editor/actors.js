import Config from '@@/config/env'
import Grid from './grid'
import Menu from './menu'

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
    this.slots = 0
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
    slot.buttonMode = true

    this.actorEvents(slot)

    this.wrapper.addChild(slot)
  }

  addMonster (type, tilePositon) {
    this.addActor({
      ...tilePositon,
      type: type,
      width: 33,
      height: 33
    })
    window.Store.commit('board/set_selected', [])
    this.grid.drawGrid()
    this.menu.closeMenu()
  }

  addActor ({ type, width, height, x, y }) {
    const actor = new this.PIXI.Sprite(this.sheet.textures[`${type}.png`])
    actor.label = type
    actor.width = width
    actor.height = height
    actor.x = x
    actor.y = y
    actor.buttonMode = true

    this.actorEvents(actor)

    this.wrapper.addChild(actor)
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
