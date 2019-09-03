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
        }, {
          label: 'Fimir',
          callback: () => { actors.addMonster('fimir', grid.tilePositon) }
        }, {
          label: 'Esqueleto',
          callback: () => { actors.addMonster('skeleton', grid.tilePositon) }
        }, {
          label: 'Zumbi',
          callback: () => { actors.addMonster('zombie', grid.tilePositon) }
        }, {
          label: 'Mumia',
          callback: () => { actors.addMonster('mummy', grid.tilePositon) }
        }, {
          label: 'G. Caos',
          callback: () => { actors.addMonster('chaos', grid.tilePositon) }
        }, {
          label: 'Gárgola',
          callback: () => { actors.addMonster('gargoyle', grid.tilePositon) }
        }]
      }
    }
  }
}
