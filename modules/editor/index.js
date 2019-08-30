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
      const grid = new Grid()
      const menu = new Menu()
      await grid.setup()
      await menu.setup()
      grid.drawGrid()
      canvasApp.stage.addChild(grid.data, menu.data)
      grid.drawBorders()
      // grid.drawGrid()
    })
}
