import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Grid from './grid'
import Menu from '@@/modules/menu'
import Actions from './actions'
import Components from '@@/modules/components'

export async function initSession () {
  const PIXI = await import('pixi.js')
  const canvasApp = new PIXI.Application({ width: BoardConfig.width, height: BoardConfig.height, transparent: true })
  document.getElementById('session').appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  if (!PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/session.json`]) {
    PIXI.Loader.shared.add(`${Config.paths.base_url}/api/session.json`)
  }

  PIXI.Loader.shared
    .load(async () => {
      const grid = new Grid()
      const menu = new Menu()
      const components = new Components()

      await grid.setup()
      await menu.setup({
        Grid,
        Actions
      })
      await components.setup(`${Config.paths.base_url}/api/session.json`)
      canvasApp.stage.addChild(grid.data, components.data, menu.data)
      loadQuest()
    })
}

export function loadQuest () {
  const components = new Components()
  const quest = window.Store.state.session.quest
  // const slots = window.Store.state.session.heroes
  const actors = window.Store.state.session.actors
  const monsters = actors.filter(a => a.type === 'monsters')
  const heroes = actors.filter(a => a.type === 'hero')
  const map = quest.map

  // DISABLEDS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  for (const d in map.disabledTiles) {
    components.addDisabledTile(map.disabledTiles[d])
  }

  // BLOCKS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  for (const b in map.blocks) {
    components.addBlock(map.blocks[b].tiles, false)
  }

  // DOORS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  for (const d in map.doors) {
    components.addDoor(map.doors[d].tiles)
  }

  // SECRETDOORS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const secretdoors = map.secretdoors
  for (const s in secretdoors) {
    const sd = secretdoors[s]
    components.addComponent({
      label: 'secretdoor',
      type: 'secretdoors',
      rotation: sd.rotation,
      y: 0,
      x: 7,
      tiles: sd.tiles,
      events: false,
      close: false
    })
  }

  // STAIRWAYS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const stairways = map.stairways
  for (const s in stairways) {
    const sw = stairways[s]
    components.addComponent({
      label: 'stairway',
      type: 'stairways',
      rotation: sw.rotation,
      tiles: sw.tiles,
      events: false,
      close: false
    })
  }

  // FURNITURE =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const furnitures = map.furnitures
  for (const f in furnitures) {
    const furn = furnitures[f]
    components.addComponent({
      label: furn.label,
      type: 'furnitures',
      rotation: furn.rotation,
      y: furn.py,
      x: furn.px,
      tiles: furn.tiles,
      events: false,
      close: false
    })
  }

  // TRAPS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const traps = map.traps
  for (const t in traps) {
    const trap = traps[t]
    components.addComponent({
      label: trap.label,
      type: 'traps',
      y: trap.py,
      x: trap.px,
      tiles: trap.tiles,
      events: false,
      close: false
    })
  }

  // MONSTERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // const monsters = map.monsters
  for (const m in monsters) {
    const monster = monsters[m]
    components.addComponent({
      id: monster.entity_id,
      label: monster.label,
      type: 'monsters',
      height: monster.height || 29,
      width: monster.width || 29,
      y: monster.py,
      x: monster.px,
      tiles: monster.tiles,
      close: false
    })
  }

  // HEROES =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // const heroes = slots
  for (const h in heroes) {
    const hero = heroes[h]
    components.addComponent({
      id: hero.entity_id,
      label: hero.class,
      type: 'heroes',
      tiles: hero.tiles,
      height: 29,
      width: 29,
      x: -9,
      y: -10,
      close: false
    })
  }
}
