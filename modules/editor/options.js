import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Actors from '@@/modules/editor/actors'

export default function () {
  const grid = new Grid()
  const menu = new Menu()
  const actors = new Actors()

  return {
    tiles: {
      disable: {
        label: 'Desabilitar Tiles',
        group: 'tiles',
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          window.Store.commit('board/set_disabled', tiles)
          menu.closeMenu()
          grid.drawGrid()
        }
      },
      enable: {
        label: 'Habilitar Tiles',
        group: 'tiles',
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          window.Store.commit('board/enable_tiles', tiles)
          menu.closeMenu()
          grid.drawGrid()
        }
      }
    },
    actors: {
      addSlot: {
        label: 'Adicionar Slot',
        callback: () => {
          actors.addSlot(grid.tilePositon)
          window.Store.commit('board/set_selected', [])
          menu.closeMenu()
          grid.drawGrid()
        }
      },
      addMonster: {
        label: 'Adicionar Monstro',
        sub: [{
          label: 'Orc',
          callback: () => { actors.addMonster('orc', grid.tilePositon) }
        }, {
          label: 'Goblin',
          callback: () => { actors.addMonster('goblin', grid.tilePositon) }
        }]
      }
    }
  }
}
