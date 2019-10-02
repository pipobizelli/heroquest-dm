import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
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

  if (!PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/editor.json`]) {
    PIXI.Loader.shared.add(`${Config.paths.base_url}/api/editor.json`)
  }

  PIXI.Loader.shared
    .load(async () => {
      // const grid = new Grid()
      const menu = new Menu()
      const actors = new Actors()
      // await grid.setup()
      await menu.setup()
      await actors.setup()
      // grid.drawGrid()
      // canvasApp.stage.addChild(grid.data, actors.data, menu.data)
      // grid.drawBorders()
      updateBoard()
    })
}

export async function updateBoard () {
  const actors = new Actors()
  const board = window.Store.state.session.quest

  // console.log(board)

  // SLOTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // const slots = board.slots
  // for (const s in slots) {
  //   actors.addSlot(slots[s].tiles)
  // }

  // BLOCKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  const blocks = board.blocks
  for (const b in blocks) {
    actors.addBlock(blocks[b].tiles)
  }

  // DOORS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const doors = board.doors
  for (const d in doors) {
    // console.log(doors[d])
    actors.addDoor(doors[d].tiles)
  }

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

  // STAIRWAYS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const stairways = board.stairways
  for (const s in stairways) {
    const sw = stairways[s]
    actors.addComponent({
      label: 'stairway',
      type: 'stairways',
      rotation: sw.rotation
    }, stairways[s].tiles)
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
  const monsters = board.monsters
  for (const m in monsters) {
    const monster = monsters[m]
    actors.addComponent({
      label: monster.label,
      type: 'monsters',
      y: monster.py,
      x: monster.px,
      height: monster.height,
      width: monster.width
    }, monster.tiles)
  }
}
