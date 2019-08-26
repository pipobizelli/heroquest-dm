import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import { setupGrid, drawGrid, drawBorders } from '@@/modules/editor/grid'
import { setupMenus } from '@@/modules/editor/menu'

export async function canvasInit () {
  const PIXI = await import('pixi.js')
  let canvasApp = new PIXI.Application({ width: BoardConfig.width, height: BoardConfig.height, transparent: true })
  document.body.appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  PIXI.Loader.shared
    .add(`${Config.paths.base_url}/api/spritesheet.json`)
    .load(() => {
      const grid = setupGrid(PIXI)
      const menus = setupMenus(PIXI)
      const borders = drawBorders(PIXI, canvasApp)

      // canvasApp.stage.addChild(bg)
      canvasApp.stage.addChild(grid)
      canvasApp.stage.addChild(menus)

      drawGrid({ PIXI, grid, menus })
    })
}
