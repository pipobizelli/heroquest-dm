import { drawGrid } from '@@/modules/editor/grid'

export const options = {
  tiles: {
    disable: {
      label: 'Desabilitar Tiles',
      callback: () => {
        const tiles = window.Store.state.board.selectedTiles
        window.Store.commit('board/set_disabled', tiles)
        drawGrid()
      }
    }
  }
}
