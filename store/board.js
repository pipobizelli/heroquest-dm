import BoardConfig from '@@/data/board.json'

export const state = () => ({
  map: {
    tiles: {
      lines: BoardConfig.lines,
      columns: BoardConfig.columns
    },
    config: BoardConfig.config
  },
  tiles: {}
})

export const mutations = {
  set_tiles (state, config) {
    state.tiles = config
  }
}

export const actions = {
  init ({ state, commit, dispatch }) {
    let config = {}
    for (let l = 0; l < BoardConfig.lines; l++) {
      for (let c = 0; c < BoardConfig.columns; c++) {
        config = {
          ...config,
          [`${l}:${c}`]: {
            ...BoardConfig.config[`${l}:${c}`],
            handle: `${l}:${c}`,
            fill: 'transparent',
            opacity: 0.5,
            x: (BoardConfig.tile.width * c),
            y: (BoardConfig.tile.height * l),
            width: BoardConfig.tile.width,
            height: BoardConfig.tile.height
          }
        }
      }
    }
    commit('set_tiles', config)
  }
}
