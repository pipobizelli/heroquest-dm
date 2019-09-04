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
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          window.Store.commit('board/set_disabled', tiles)
          window.Store.commit('board/set_selected', [])
          menu.closeMenu()
          grid.drawGrid()
        }
      },
      enable: {
        label: 'Habilitar Tiles',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length > 0
        },
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          window.Store.commit('board/enable_tiles', tiles)
          window.Store.commit('board/set_selected', [])
          menu.closeMenu()
          grid.drawGrid()
        }
      }
    },
    actors: {
      addSlot: {
        label: 'Adicionar Slot',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          actors.addSlot(grid.tilePositon)
        }
      },
      addMonster: {
        label: 'Adicionar Monstro',
        sub: [{
          label: 'Orc',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'orc' }) }
        }, {
          label: 'Goblin',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'goblin' }) }
        }, {
          label: 'Fimir',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'fimir' }) }
        }, {
          label: 'Esqueleto',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'skeleton' }) }
        }, {
          label: 'Zumbi',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'zombie' }) }
        }, {
          label: 'Mumia',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'mummy' }) }
        }, {
          label: 'G. Caos',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'chaos' }) }
        }, {
          label: 'Gárgola',
          callback: () => { actors.addActor({ ...grid.tilePositon, type: 'gargoyle' }) }
        }]
      }
    },
    map: {
      addBlock: {
        label: 'Adicionar Bloco',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          actors.addBlock({ ...grid.tilePositon, type: 'block' })
        }
      }
    }
  }
}
