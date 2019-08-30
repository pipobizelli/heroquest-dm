import BoardConfig from '@@/data/board.json'
import Grid from './grid'
import { colors } from './colors'
import options from './options'

let instance = null
export default class Menu {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup () {
    this.PIXI = await import('pixi.js')
    this.Filters = await import('pixi-filters')
    this.grid = new Grid()
    this.options = options()
    this.bgH = (Object.values(this.options).length * 25) + 10
    this.bgW = 200
    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = 0
    this.wrapper.y = 0
    return this
  }

  get data () {
    return this.wrapper
  }

  drawOption ({ label, callback }, index) {
    const option = new this.PIXI.Container()
    const bg = new this.PIXI.Graphics()
    const handle = new this.PIXI.Text(label, { font: 'Tahoma', fontSize: 14, fill: colors.black, align: 'left' })
    const optH = 25
    const self = this

    option.y = (optH * index) + 5

    handle.y = 4
    handle.x = 15

    option.addChild(bg, handle)
    option.hitArea = new this.PIXI.Rectangle(0, 0, this.bgW, optH)

    option
      .on('pointerover', function () {
        bg.beginFill(colors.blue, 1)
        bg.drawRect(0, 0, self.bgW, optH)
        bg.endFill()
        handle.style.fill = colors.white
      })
      .on('pointerout', function () {
        bg.clear()
        handle.style.fill = colors.black
      })
      .on('click', function () {
        callback()
      })
      .interactive = true

    return option
  }

  drawMenu ({ x, y }) {
    const menuWrapper = new this.PIXI.Container()
    menuWrapper.x = x > (BoardConfig.width - this.bgW) ? x - this.bgW : x
    menuWrapper.y = y > (BoardConfig.height - this.bgH) ? y - this.bgH : y
    menuWrapper.removeChildren()

    const shadow = new this.Filters.DropShadowFilter()
    shadow.alpha = 0.3
    shadow.distance = 1

    const menu = new this.PIXI.Graphics()
    menu.filters = [shadow]

    menu.lineStyle(1, colors.menuBorder, 1)
    menu.clear()
    menu.beginFill(colors.menu, 1)
    menu.drawRoundedRect(0, 0, this.bgW, this.bgH, 5)
    menu.endFill()

    menuWrapper.addChild(menu)

    const opts = Object.values(this.options)
    for (const o in opts) {
      const opt = this.drawOption(opts[o], parseInt(o))
      menuWrapper.addChild(opt)
    }

    return menuWrapper
  }

  drawArea () {
    const area = new this.PIXI.Graphics()
    const self = this
    area.clear()
    area.beginFill(colors.white, 0.1)
    area.drawRect(0, 0, BoardConfig.width, BoardConfig.height)
    area.endFill()

    area
      .on('click', function () {
        self.closeMenu()
      })
      .interactive = true

    return area
  }

  openMenu ({ x, y }) {
    this.wrapper.addChild(this.drawArea(), this.drawMenu({ x, y }))
  }

  closeMenu () {
    this.wrapper.removeChildren()
  }
}
