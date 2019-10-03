import Config from '@@/config/env'
import Components from './components'

let instance = null
export default class Grid {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup () {
    this.PIXI = await import('pixi.js')
    this.components = new Components()
    this.grid = new this.PIXI.Container()
    this.grid.x = 0
    this.grid.y = 0
    this.grid.label = 'grid'
    this.sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/session.json`].spritesheet
    this.drawBackground()
    return this
  }

  get data () {
    return this.grid
  }

  drawBackground () {
    const background = new this.PIXI.Sprite(this.sheet.textures['background.png'])
    this.grid.addChild(background)
  }
}
