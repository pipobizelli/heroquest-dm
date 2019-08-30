import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'

export default function () {
  const grid = new Grid()
  const menu = new Menu()

  return {
    disable: {
      label: 'Desabilitar Tiles',
      callback: () => {
        const tiles = window.Store.state.board.selectedTiles
        window.Store.commit('board/set_disabled', tiles)
        menu.closeMenu()
        grid.drawGrid()
      }
    },
    enable: {
      label: 'Habilitar Tiles',
      callback: () => {
        const tiles = window.Store.state.board.selectedTiles
        window.Store.commit('board/enable_tiles', tiles)
        menu.closeMenu()
        grid.drawGrid()
      }
    }
  }
}
