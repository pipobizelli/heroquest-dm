import BoardConfig from '@@/data/board.json'
import Grid from '@@/modules/editor/grid'
import { colors } from '@@/modules/editor/colors'

export default async () => {
  const PIXI = await import('pixi.js')
  const Filters = await import('pixi-filters')
  const bgH = 50
  const bgW = 200
  const menus = new PIXI.Container()
  const menuOptions = [{
    label: 'Desabilitar Tiles',
    conditional: window.Store.state.board.selectedTiles.length > 0,
    callback: async () => {
      const tiles = window.Store.state.board.selectedTiles
      window.Store.commit('board/set_disabled', tiles)
      await Grid().drawGrid()
    }
  }]

  var setupMenus = () => {
    menus.x = 0
    menus.y = 0
    return menus
  }

  var drawOption = ({ label, index, callback }) => {
    const option = new PIXI.Container()
    const bg = new PIXI.Graphics()
    const handle = new PIXI.Text(label, { font: 'Tahoma', fontSize: 14, fill: colors.black, align: 'left' })
    const optH = 25

    handle.y = 10
    handle.x = 15

    option.addChild(bg, handle)
    option.hitArea = new PIXI.Rectangle(0, 5, bgW, optH)

    option
      .on('pointerover', function () {
        bg.beginFill(colors.blue, 1)
        bg.drawRect(0, 5, bgW, optH)
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

  var drawMenu = ({ x, y }) => {
    const menuWrapper = new PIXI.Container()
    menuWrapper.x = x > (BoardConfig.width - bgW) ? x - bgW : x
    menuWrapper.y = y > (BoardConfig.height - bgH) ? y - bgH : y
    menuWrapper.removeChildren()

    const shadow = new Filters.DropShadowFilter()
    shadow.alpha = 0.3
    shadow.distance = 1

    const menu = new PIXI.Graphics()
    menu.filters = [shadow]

    menu.lineStyle(1, colors.menuBorder, 1)
    menu.clear()
    menu.beginFill(colors.menu, 1)
    menu.drawRoundedRect(0, 0, bgW, bgH, 3)
    menu.endFill()

    menuWrapper.addChild(menu)

    const disables = drawOption({
      label: 'Desabilitar Tiles',
      callback: async () => {
        const tiles = window.Store.state.board.selectedTiles
        window.Store.commit('board/set_disabled', tiles)
        await Grid().drawGrid()
        closeMenu()
      }
    })

    menuWrapper.addChild(disables)

    return menuWrapper
  }

  var drawArea = () => {
    const area = new PIXI.Graphics()
    area.clear()
    area.beginFill(colors.white, 0.1)
    area.drawRect(0, 0, BoardConfig.width, BoardConfig.height)
    area.endFill()

    area
      .on('click', function () {
        closeMenu()
      })
      .interactive = true

    return area
  }

  var openMenu = ({ x, y }) => {
    menus.addChild(drawArea(), drawMenu({ x, y }))
  }

  var closeMenu = () => {
    menus.removeChildren()
  }

  return {
    menuOptions,
    setupMenus,
    openMenu,
    closeMenu
  }
}
