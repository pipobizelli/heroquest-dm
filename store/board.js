import BoardConfig from '@@/data/board.json'

export const state = () => ({
  map: {
    tiles: {
      lines: BoardConfig.lines,
      columns: BoardConfig.columns
    },
    config: BoardConfig.config
  },
  selectedTiles: [],
  disabledTiles: []
})

export const mutations = {
  add_selected (state, tile) {
    state.selectedTiles = [...state.selectedTiles, tile]
  },
  set_selected (state, tilesArr) {
    state.selectedTiles = tilesArr
  },
  set_disabled (state, tilesArr) {
    state.disabledTiles = state.disabledTiles.concat(tilesArr)
  },
  enable_tiles (state, tilesArr) {
    state.disabledTiles = state.disabledTiles.filter(t => !tilesArr.includes(t))
  }
}
