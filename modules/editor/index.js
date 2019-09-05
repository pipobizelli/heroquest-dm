import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Actors from '@@/modules/editor/actors'

export async function canvasInit () {
  const PIXI = await import('pixi.js')
  const canvasApp = new PIXI.Application({ width: BoardConfig.width, height: BoardConfig.height, transparent: true })
  // document.body.appendChild(canvasApp.view)
  document.getElementById('editor').appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  PIXI.Loader.shared
    .add(`${Config.paths.base_url}/api/spritesheet.json`)
    .load(async () => {
      const grid = new Grid()
      const menu = new Menu()
      const actors = new Actors()

      await grid.setup()
      await menu.setup()
      await actors.setup()
      grid.drawGrid()
      canvasApp.stage.addChild(grid.data, actors.data, menu.data)
      grid.drawBorders()
    })
}
