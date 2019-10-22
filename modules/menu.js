import BoardConfig from '@@/data/board.json'
import { colors } from '@@/modules/colors'

let instance = null
export default class Menu {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup ({ Grid, Options = () => {}, Actions }) {
    this.PIXI = await import('pixi.js')
    this.Filters = await import('pixi-filters')
    this.grid = new Grid()
    this.options = Options()
    this.actions = Actions

    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = 0
    this.wrapper.y = 0

    this.subWrapper = new this.PIXI.Container()

    this.menuX = 0
    this.menuY = 0

    this.groupsCount = []
    this.optH = 25
    this.bgW = 170
    // this.bgH = 0

    this.setHeight(this.options)

    return this
  }

  setHeight (options = { a: 1 }) {
    const groups = Object.values(options)
    let optsLength = 0
    for (const g in groups) {
      optsLength += Object.values(groups[g]).length
    }
    this.bgH = (optsLength * this.optH) + (groups.length * 10)

    return groups
  }

  get data () {
    return this.wrapper
  }

  drawGroup (options, index) {
    const group = new this.PIXI.Container()
    const prevGroups = this.groupsCount.reduce((a, b) => a + b, 0)

    if (index > 0) {
      const bg = new this.PIXI.Graphics()
      bg.lineStyle(2, colors.darkGray, 0.2)
      bg.lineTo(this.bgW, 0)
      bg.y = -5
      group.addChild(bg)
    }

    group.y = ((prevGroups * this.optH) + 10 * index) + 5

    return group
  }

  drawOption ({ label, callback, sub = false, condition = () => true }, index) {
    const isEnable = condition()
    const option = new this.PIXI.Container()
    const bg = new this.PIXI.Graphics()
    const textColor = isEnable ? colors.black : colors.darkGray

    // label
    const handle = new this.PIXI.Text(label, { font: 'Tahoma', fontSize: 14, fill: textColor, align: 'left' })
    const subSymbol = new this.PIXI.Text('▶', { font: 'Tahoma', fontSize: 11, fill: textColor, align: 'right' })

    subSymbol.y = 6
    subSymbol.x = this.bgW - 24

    option.y = (this.optH * index)

    handle.y = 4
    handle.x = 15

    option.addChild(bg, handle)
    option.hitArea = new this.PIXI.Rectangle(0, 0, this.bgW, this.optH)

    if (sub.length) {
      option.addChild(subSymbol)
    }

    if (isEnable) {
      option
        .on('pointerover', () => {
          bg.beginFill(colors.blue, 1)
          bg.drawRect(0, 0, this.bgW, this.optH)
          bg.endFill()
          handle.style.fill = textColor
          subSymbol.style.fill = textColor

          if (!sub) {
            this.closeSubMenu()
          }

          if (sub.length) {
            const totalY = option.parent.y + option.y
            this.openSubMenu(sub, totalY)
          }
        })
        .on('pointerout', () => {
          bg.clear()
          handle.style.fill = textColor
          subSymbol.style.fill = textColor
        })
        .on('click', function () {
          if (!sub.length) {
            callback()
          }
        })
        .interactive = true
    }

    return option
  }

  dropShadow () {
    const shadow = new this.Filters.DropShadowFilter()
    shadow.alpha = 0.3
    shadow.distance = 1

    return shadow
  }

  drawMenuBg ({ x, y, width, height }) {
    const menuWrapper = new this.PIXI.Container()
    menuWrapper.x = x
    menuWrapper.y = y

    const menu = new this.PIXI.Graphics()
    menu.filters = [this.dropShadow()]

    menu.lineStyle(1, colors.menuBorder, 1)
    menu.clear()
    menu.beginFill(colors.menu, 1)
    menu.drawRoundedRect(0, 0, width, height, 5)
    menu.endFill()

    menuWrapper.addChild(menu)

    return menuWrapper
  }

  drawMenu ({ x, y, options = this.options }) {
    this.menuX = x > (BoardConfig.width - this.bgW) ? x - this.bgW : x
    this.menuY = y > (BoardConfig.height - this.bgH) ? y - this.bgH : y

    const groups = this.setHeight(options)
    const menuWrapper = this.drawMenuBg({
      x: Math.round(this.menuX),
      y: Math.round(this.menuY),
      width: this.bgW,
      height: this.bgH
    })

    this.groupsCount = []
    for (const g in groups) {
      const opts = Object.values(groups[g])
      const group = this.drawGroup(opts.length, parseInt(g))
      this.groupsCount.push(opts.length)
      for (const o in opts) {
        const opt = this.drawOption(opts[o], o)
        group.addChild(opt)
      }
      menuWrapper.addChild(group)
    }

    return menuWrapper
  }

  drawSubMenu (optionsArr, pY = 0) {
    const x = this.menuX + this.bgW
    const y = this.menuY + pY
    // const y = pY
    const height = (optionsArr.length * this.optH) + 10
    const menuWrapper = this.drawMenuBg({
      x: x > (BoardConfig.width - this.bgW) ? Math.round(x - (this.bgW * 2)) : Math.round(x),
      y: y > (BoardConfig.height - height) ? Math.round(BoardConfig.height - height) - this.optH : Math.round(y),
      width: this.bgW,
      height: height
    })
    const group = new this.PIXI.Container()
    group.y = 5

    for (const o in optionsArr) {
      const opt = this.drawOption({
        ...optionsArr[o],
        sub: true
      }, o)
      group.addChild(opt)
    }

    menuWrapper.addChild(group)

    return menuWrapper
  }

  drawArea () {
    const area = new this.PIXI.Graphics()
    // const self = this
    area.clear()
    area.beginFill(colors.white, 0.1)
    area.drawRect(0, 0, BoardConfig.width, BoardConfig.height)
    area.endFill()

    area
      .on('click', () => {
        // window.Store.commit('board/set_selected', [])
        window.Store.commit('board/set_components', {
          type: 'selectedTiles',
          arr: []
        })
        this.grid.drawGrid()
        this.closeMenu()
      })
      .interactive = true

    return area
  }

  openMenu ({ x, y }) {
    if (this.wrapper) {
      this.wrapper.addChild(this.drawArea(), this.drawMenu({ x, y }), this.subWrapper)
    }
  }

  closeMenu () {
    if (this.wrapper) {
      this.closeSubMenu()
      this.wrapper.removeChildren()
    }
  }

  openSubMenu (sub, y) {
    if (this.subWrapper) {
      this.closeSubMenu()
      this.subWrapper.addChild(this.drawSubMenu(sub, y))
    }
  }

  openActionsMenu ({ x, y, target }) {
    this.wrapper.addChild(this.drawArea(), this.drawMenu({ x, y, options: this.actions(target) }), this.subWrapper)
  }

  closeSubMenu () {
    if (this.subWrapper) {
      this.subWrapper.removeChildren()
    }
  }
}
