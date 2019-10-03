import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Grid from './grid'
import Components from '@@/modules/board/components'

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
      const components = new Components()
      await grid.setup()
      await components.setup()
      canvasApp.stage.addChild(grid.data, components.data)
      loadQuest()
    })
}

export async function loadQuest () {
  const components = new Components()
  const quest = window.Store.state.session.quest
  const map = quest.map

  // DISABLEDS ===--===--===--===--===--===--===
  for (const d in map.disabledTiles) {
    components.addDisabledTile(map.disabledTiles[d])
  }

  // BLOCKS ===--===--===--===--===--===--===
  for (const b in map.blocks) {
    components.addBlock(map.blocks[b].tiles)
  }

  // DOORS ===--===--===--===--===--===--===
  for (const d in map.doors) {
    components.addDoor(map.doors[d].tiles)
  }
}