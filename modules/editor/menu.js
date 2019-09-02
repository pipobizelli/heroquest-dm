import BoardConfig from '@@/data/board.json'
import Grid from './grid'
import Options from './options'
import { colors } from './colors'

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
    this.options = Options()
    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = 0
    this.wrapper.y = 0
    this.optH = 25
    this.bgW = 200
    const groups = Object.values(this.options)
    let options = 0
    for (const g in groups) {
      options += Object.values(groups[g]).length
    }
    this.bgH = (options * this.optH) + (groups.length * 10)
    this.menuH = 0

    return this
  }

  get data () {
    return this.wrapper
  }

  drawGroup (options, index) {
    const group = new this.PIXI.Container()

    if (index > 0) {
      const bg = new this.PIXI.Graphics()
      bg.lineStyle(2, colors.darkGray, 0.2)
      bg.lineTo(this.bgW, 0)
      bg.y = -5
      group.addChild(bg)
    }

    group.y = this.menuH + 5
    this.menuH += (this.optH * options) + 10

    return group
  }

  drawOption ({ label, callback }, index) {
    const option = new this.PIXI.Container()
    const bg = new this.PIXI.Graphics()
    const handle = new this.PIXI.Text(label, { font: 'Tahoma', fontSize: 14, fill: colors.black, align: 'left' })

    option.y = (this.optH * index)

    handle.y = 4
    handle.x = 15

    option.addChild(bg, handle)
    option.hitArea = new this.PIXI.Rectangle(0, 0, this.bgW, this.optH)

    option
      .on('pointerover', () => {
        bg.beginFill(colors.blue, 1)
        bg.drawRect(0, 0, this.bgW, this.optH)
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

    const groups = Object.values(this.options)
    for (const g in groups) {
      const opts = Object.values(groups[g])
      const group = this.drawGroup(opts.length, parseInt(g))
      for (const o in opts) {
        const opt = this.drawOption(opts[o], o)
        group.addChild(opt)
      }
      menuWrapper.addChild(group)
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
