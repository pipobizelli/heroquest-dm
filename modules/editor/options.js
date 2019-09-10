import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Actors from '@@/modules/editor/actors'
import Tile from '@@/helpers/tile'

export default function () {
  const grid = new Grid()
  const menu = new Menu()
  const actors = new Actors()
  const TileHelper = Tile(window.Store.state.board.map)

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
          // window.Store.commit('board/set_disabled', tiles)
          window.Store.commit('board/push_components', {
            type: 'disabledTiles',
            arr: tiles
          })
          // window.Store.commit('board/set_selected', [])
          window.Store.commit('board/set_components', {
            type: 'selectedTiles',
            arr: []
          })
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
          window.Store.commit('board/set_enabled', tiles)
          // window.Store.commit('board/set_selected', [])
          window.Store.commit('board/set_components', {
            type: 'selectedTiles',
            arr: []
          })
          menu.closeMenu()
          grid.drawGrid()
        }
      }
    },
    actors: {
      slots: {
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
      monsters: {
        label: 'Adicionar Monstro',
        sub: [{
          label: 'Orc',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'orc' }) }
        }, {
          label: 'Goblin',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'goblin' }) }
        }, {
          label: 'Fimir',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'fimir' }) }
        }, {
          label: 'Esqueleto',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'skeleton' }) }
        }, {
          label: 'Zumbi',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'zombie' }) }
        }, {
          label: 'Mumia',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'mummy' }) }
        }, {
          label: 'G. Caos',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'chaos' }) }
        }, {
          label: 'Gárgola',
          callback: () => { actors.addActor({ ...grid.tilePositon, label: 'gargoyle' }) }
        }]
      }
    },
    map: {
      blocks: {
        label: 'Adicionar Bloco',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          actors.addBlock(tiles)
          window.Store.commit('board/add_component', {
            component: {
              tiles,
              type: 'blocks'
            }
          })
        }
      },
      doors: {
        label: 'Adicionar Porta',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          return selected.length === 2 &&
          (TileHelper.isTileInLine(selected[0], selected[1]) ||
          TileHelper.isTileInColumn(selected[0], selected[1]))
        },
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          actors.addDoors(tiles)
          window.Store.commit('board/add_component', {
            component: {
              tiles,
              type: 'doors'
            }
          })
        }
      },
      secreetdoors: {
        label: 'Add P. Secreta',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          const tiles = window.Store.state.board.selectedTiles
          actors.addComponent({ label: 'secretdoor', type: 'secretdoors', y: 0, x: 7 }, tiles)
          window.Store.commit('board/add_component', {
            component: {
              tiles,
              type: 'secretdoors',
              rotation: 0
            }
          })
        }
      },
      furniture: {
        label: 'Adicionar Móvel',
        sub: [{
          label: 'Armário',
          callback: () => { actors.addComponent({ label: 'cupboard', type: 'furniture', y: 0, x: 2 }) }
        }, {
          label: 'Baú',
          callback: () => { actors.addComponent({ label: 'chest', type: 'furniture', y: 4, x: 0 }) }
        }, {
          label: 'Escrivaninha',
          callback: () => { actors.addComponent({ label: 'alchemistsbench', type: 'furniture', y: 3, x: 4 }) }
        }, {
          label: 'Estante de Livros',
          callback: () => { actors.addComponent({ label: 'bookcase', type: 'furniture' }) }
        }, {
          label: 'Lareira',
          callback: () => { actors.addComponent({ label: 'fireplace', type: 'furniture', y: 1, x: 1 }) }
        }, {
          label: 'Mesa',
          callback: () => { actors.addComponent({ label: 'table', type: 'furniture', y: 5, x: 3 }) }
        }, {
          label: 'Mesa do Livro',
          callback: () => { actors.addComponent({ label: 'sorcererstable', type: 'furniture', y: 3, x: 2 }) }
        }, {
          label: 'Rack de Armas',
          callback: () => { actors.addComponent({ label: 'weaponsrack', type: 'furniture' }) }
        }, {
          label: 'Tortura',
          callback: () => { actors.addComponent({ label: 'rack', type: 'furniture', y: 1, x: 2 }) }
        }, {
          label: 'Trono',
          callback: () => { actors.addComponent({ label: 'throne', type: 'furniture', y: 1, x: 2 }) }
        }, {
          label: 'Tumba',
          callback: () => { actors.addComponent({ label: 'tomb', type: 'furniture', y: 4, x: 3 }) }
        }]
      },
      trap: {
        label: 'Adicionar Armadilha',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        sub: [{
          label: 'Lanças',
          callback: () => {
            actors.addComponent({ label: 'speartrap' })
          }
        }, {
          label: 'Poço',
          callback: () => {
            actors.addComponent({ label: 'pittrap', y: 3, x: 4 })
          }
        }]
      }
    }
  }
}
