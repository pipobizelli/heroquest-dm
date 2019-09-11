import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'
import Actors from '@@/modules/editor/actors'
import Tile from '@@/helpers/tile'

export function addComponent ({ label, type, tiles, rotation = 0, y = 0, x = 0, tilesArr }) {
  const actors = new Actors()
  actors.addComponent({ label: label, type, y, x }, tilesArr)
  window.Store.commit('board/add_component', {
    component: {
      tiles: tilesArr,
      label,
      type,
      rotation,
      px: x,
      py: y
    }
  })
}

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
          const tileObj = grid.tilePositon
          window.Store.commit('board/add_component', {
            component: {
              tiles: tileObj,
              type: 'slots'
            }
          })
          actors.addSlot(tileObj)
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
          addComponent({
            label: 'secretdoor',
            type: 'secretdoors',
            y: 0,
            x: 7,
            tilesArr: window.Store.state.board.selectedTiles
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
              x: 2,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Baú',
          callback: () => {
            addComponent({
              label: 'chest',
              type: 'furnitures',
              y: 4,
              x: 0,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Escrivaninha',
          callback: () => {
            addComponent({
              label: 'alchemistsbench',
              type: 'furnitures',
              y: 3,
              x: 4,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Estante de Livros',
          callback: () => {
            addComponent({
              label: 'bookcase',
              type: 'furnitures',
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Lareira',
          callback: () => {
            addComponent({
              label: 'fireplace',
              type: 'furnitures',
              y: 1,
              x: 1,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Mesa',
          callback: () => {
            addComponent({
              label: 'table',
              type: 'furnitures',
              y: 5,
              x: 3,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Mesa do Livro',
          callback: () => {
            addComponent({
              label: 'sorcererstable',
              type: 'furnitures',
              y: 3,
              x: 2,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Rack de Armas',
          callback: () => {
            addComponent({
              label: 'weaponsrack',
              type: 'furnitures',
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Tortura',
          callback: () => {
            addComponent({
              label: 'rack',
              type: 'furnitures',
              y: 1,
              x: 2,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Trono',
          callback: () => {
            addComponent({
              label: 'throne',
              type: 'furnitures',
              y: 1,
              x: 2,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Tumba',
          callback: () => {
            addComponent({
              label: 'tomb',
              type: 'furnitures',
              y: 4,
              x: 3,
              tilesArr: window.Store.state.board.selectedTiles
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
            // actors.addComponent({ label: 'speartrap' })
            addComponent({
              label: 'speartrap',
              type: 'traps',
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }, {
          label: 'Poço',
          callback: () => {
            // actors.addComponent({ label: 'pittrap', y: 3, x: 4 })
            addComponent({
              label: 'pittrap',
              type: 'traps',
              y: 3,
              x: 4,
              tilesArr: window.Store.state.board.selectedTiles
            })
          }
        }]
      }
    }
  }
}
