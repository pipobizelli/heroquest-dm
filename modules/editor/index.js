import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'

export async function canvasInit () {
  const PIXI = await import('pixi.js')
  const canvasApp = new PIXI.Application({ width: BoardConfig.width, height: BoardConfig.height, transparent: true })
  document.body.appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  PIXI.Loader.shared
    .add(`${Config.paths.base_url}/api/spritesheet.json`)
    .load(async () => {
      const grid = await Grid()
      const menu = await Menu()
      canvasApp.stage.addChild(grid.setupGrid(), menu.setupMenus())
      grid.drawBorders()
    })
}
