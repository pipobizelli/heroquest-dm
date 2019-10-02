import BoardConfig from '@@/data/board.json'

export const state = () => ({
  map: {
    tiles: {
      lines: BoardConfig.lines,
      columns: BoardConfig.columns
    },
    config: BoardConfig.config
  },
  furnitures: [],
  slots: [],
  monsters: [],
  selectedTiles: [],
  disabledTiles: [],
  blocks: [],
  doors: [],
  secretdoors: [],
  searchs: [],
  stairways: [],
  traps: []
})

export const mutations = {
  add_selected (state, tile) {
    state.selectedTiles = [...state.selectedTiles, tile]
  },
  remove_selected (state, tile) {
    state.selectedTiles = state.selectedTiles.filter(t => t !== tile)
  },
  set_enabled (state, tilesArr) {
    state.disabledTiles = state.disabledTiles.filter(t => !tilesArr.includes(t))
  },
  add_component (state, { component }) {
    state[component.type] = [...state[component.type], component]
  },
  remove_component (state, { component }) {
    state[component.type] = state[component.type].filter(c => JSON.stringify(c.tiles) !== JSON.stringify(component.tiles))
  },
  rotate_component (state, { component }) {
    const temp = state[component.type].filter(c => JSON.stringify(c.tiles) !== JSON.stringify(component.tiles))
    state[component.type] = [...temp, { ...component }]
  },
  move_component (state, { component }) {
    const temp = state[component.type].filter(c => JSON.stringify(c.tiles) !== JSON.stringify(component.tiles))
    const comp = state[component.type].find(c => JSON.stringify(c.tiles) === JSON.stringify(component.tiles))
    state[component.type] = [...temp, {
      ...comp,
      ...component,
      tiles: component.moveTo
    }]
  },
  push_components (state, { type, arr }) {
    state[type] = state[type].concat(arr)
  },
  set_components (state, { type, arr }) {
    state[type] = arr
  }
}
