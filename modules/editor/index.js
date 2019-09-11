import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Actors from '@@/modules/editor/actors'

export async function initBoard () {
  const PIXI = await import('pixi.js')
  const canvasApp = new PIXI.Application({ width: BoardConfig.width, height: BoardConfig.height, transparent: true })
  // document.body.appendChild(canvasApp.view)
  document.getElementById('editor').appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  PIXI.Loader.shared
    .add(`${Config.paths.base_url}/api/editor.json`)
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

      updateBoard()
    })
}

export async function updateBoard () {
  const actors = new Actors()
  const board = window.Store.state.board

  // SLOTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const slots = board.slots
  for (const s in slots) {
    actors.addSlot(slots[s])
  }

  // BLOCKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  const blocks = board.blocks
  actors.addBlock(blocks)

  // DOORS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const doors = board.doors
  actors.addDoors(doors)

  // SECRETDOORS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const secretdoors = board.secretdoors
  for (const s in secretdoors) {
    const sd = secretdoors[s]
    actors.addComponent({
      label: 'secretdoor',
      type: 'secretdoors',
      rotation: sd.rotation,
      y: 0,
      x: 7
    }, secretdoors[s].tiles)
  }

  // FURNITURE =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const furnitures = board.furnitures
  for (const f in furnitures) {
    const furn = furnitures[f]
    actors.addComponent({
      label: furn.label,
      type: 'furnitures',
      rotation: furn.rotation,
      y: furn.py,
      x: furn.px
    }, furn.tiles)
  }

  // TRAPS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const traps = board.traps
  for (const t in traps) {
    const trap = traps[t]
    actors.addComponent({
      label: trap.label,
      type: 'traps',
      y: trap.py,
      x: trap.px
    }, trap.tiles)
  }

  // MONSTERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  const monsters = board.monster
  for (const m in monsters) {
    const monster = monsters[m]
    actors.addComponent({
      label: monster.label,
      type: 'monsters'
    }, monster.tiles)
  }
}
