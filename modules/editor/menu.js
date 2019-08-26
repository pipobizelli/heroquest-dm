import BoardConfig from '@@/data/board.json'
import { drawGrid } from '@@/modules/editor/grid'
import { colors } from '@@/modules/editor/colors'

export function setupMenus (PIXI) {
  const menus = new PIXI.Container()
  menus.x = 0
  menus.y = 0

  return menus
}

export function openMenu ({ PIXI, grid, menus, x, y }) {
  console.log(menus)

  let area = new PIXI.Graphics()
  area.clear()
  area.beginFill(colors.iddle, 0.1)
  area.drawRect(0, 0, BoardConfig.width, BoardConfig.height)
  area.endFill()

  let menu = new PIXI.Graphics()
  menu.clear()
  menu.beginFill(colors.menu, 1)
  menu.drawRoundedRect(x, y, 100, 200, 5)
  menu.endFill()

  areaEvents({ PIXI, grid, menus, area, menu })

  menus.addChild(area)
  menus.addChild(menu)
}

export function closeMenu (menus) {
  menus.removeChildren()
}

export function areaEvents ({ PIXI, grid, menus, area, menu }) {
  area
    .on('click', function () {
      closeMenu(menus)
      drawGrid({ PIXI, grid, menus })
    })
    .interactive = true

  return area
}
