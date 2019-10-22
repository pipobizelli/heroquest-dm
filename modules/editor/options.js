import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/menu'
import Componets from '@@/modules/components'
import Tile from '@@/helpers/tile'

export function addComponent ({ type, label, x = 0, y = 0, rotation = 0, height, width }) {
  const actors = new Componets()
  const tiles = window.Store.state.board.selectedTiles
  actors.addComponent({ label, type, y, x, tiles, height, width }, tiles)
  window.Store.commit('board/add_component', {
    component: {
      tiles,
      label,
      type,
      rotation,
      px: x,
      py: y,
      height,
      width
    }
  })
}

export default function () {
  const grid = new Grid()
  const menu = new Menu()
  const actors = new Componets()
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
          window.Store.commit('board/push_components', {
            type: 'disabledTiles',
            arr: tiles
          })
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
          window.Store.commit('board/add_component', {
            component: {
              tiles: window.Store.state.board.selectedTiles,
              type: 'slots'
            }
          })
          actors.addSlot(window.Store.state.board.selectedTiles)
        }
      },
      monsters: {
        label: 'Adicionar Monstro',
        sub: [{
          label: 'Orc',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'orc',
              y: 2,
              x: 1
            })
          }
        }, {
          label: 'Goblin',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'goblin',
              y: 2,
              x: 2
            })
          }
        }, {
          label: 'Fimir',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'fimir',
              y: 2,
              x: 2
            })
          }
        }, {
          label: 'Esqueleto',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'skeleton',
              y: 1,
              x: 1
            })
          }
        }, {
          label: 'Zumbi',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'zombie',
              y: 2,
              x: 1
            })
          }
        }, {
          label: 'Mumia',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'mummy',
              y: 2,
              x: 2
            })
          }
        }, {
          label: 'G. Caos',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'chaos',
              height: 31,
              width: 29,
              x: -7,
              y: -8
            })
          }
        }, {
          label: 'Gárgola',
          callback: () => {
            addComponent({
              type: 'monsters',
              label: 'gargoyle',
              width: 30,
              height: 23,
              x: -6
            })
          }
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
          actors.addDoor(tiles)
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
          addComponent({
            label: 'secretdoor',
            type: 'secretdoors',
            y: 0,
            x: 7
          })
        }
      },
      furniture: {
        label: 'Adicionar Móvel',
        sub: [{
          label: 'Armário',
          callback: () => {
            addComponent({
              label: 'cupboard',
              type: 'furnitures',
              y: 0,
              x: 2
            })
          }
        }, {
          label: 'Baú',
          callback: () => {
            addComponent({
              label: 'chest',
              type: 'furnitures',
              y: 4,
              x: 0
            })
          }
        }, {
          label: 'Escrivaninha',
          callback: () => {
            addComponent({
              label: 'alchemistsbench',
              type: 'furnitures',
              y: 3,
              x: 4
            })
          }
        }, {
          label: 'Estante de Livros',
          callback: () => {
            addComponent({
              label: 'bookcase',
              type: 'furnitures'
            })
          }
        }, {
          label: 'Lareira',
          callback: () => {
            addComponent({
              label: 'fireplace',
              type: 'furnitures',
              y: 1,
              x: 1
            })
          }
        }, {
          label: 'Mesa',
          callback: () => {
            addComponent({
              label: 'table',
              type: 'furnitures',
              y: 5,
              x: 3
            })
          }
        }, {
          label: 'Mesa do Livro',
          callback: () => {
            addComponent({
              label: 'sorcererstable',
              type: 'furnitures',
              y: 3,
              x: 2
            })
          }
        }, {
          label: 'Rack de Armas',
          callback: () => {
            addComponent({
              label: 'weaponsrack',
              type: 'furnitures'
            })
          }
        }, {
          label: 'Tortura',
          callback: () => {
            addComponent({
              label: 'rack',
              type: 'furnitures',
              y: 1,
              x: 2
            })
          }
        }, {
          label: 'Trono',
          callback: () => {
            addComponent({
              label: 'throne',
              type: 'furnitures',
              y: 1,
              x: 2
            })
          }
        }, {
          label: 'Tumba',
          callback: () => {
            addComponent({
              label: 'tomb',
              type: 'furnitures',
              y: 4,
              x: 3
            })
          }
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
            addComponent({
              label: 'speartrap',
              type: 'traps'
            })
          }
        }, {
          label: 'Poço',
          callback: () => {
            addComponent({
              label: 'pittrap',
              type: 'traps',
              y: 3,
              x: 4
            })
          }
        }]
      },
      stairway: {
        label: 'Add Escadaria',
        condition: () => {
          return window.Store.state.board.selectedTiles.length === 4
        },
        callback: () => {
          addComponent({
            label: 'stairway',
            type: 'stairways'
          })
        }
      }
    }
  }
}
