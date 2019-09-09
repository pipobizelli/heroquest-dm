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
      blocks: {
        label: 'Adicionar Bloco',
        condition: () => {
          const selected = window.Store.state.board.selectedTiles
          const disabled = window.Store.state.board.disabledTiles
          const intersection = selected.filter(v => disabled.indexOf(v) >= 0)
          return intersection.length < 1
        },
        callback: () => {
          actors.addBlock()
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
          actors.addDoor()
        }
      },
      furniture: {
        label: 'Adicionar Móvel',
        sub: [{
          label: 'Armário',
          callback: () => { actors.addFurniture('cupboard', 0, 2) }
        }, {
          label: 'Baú',
          callback: () => { actors.addFurniture('chest', 4, 0) }
        }, {
          label: 'Escrivaninha',
          callback: () => { actors.addFurniture('alchemistsbench', 3, 4) }
        }, {
          label: 'Estante de Livros',
          callback: () => { actors.addFurniture('bookcase') }
        }, {
          label: 'Lareira',
          callback: () => { actors.addFurniture('fireplace', 1, 1) }
        }, {
          label: 'Mesa',
          callback: () => { actors.addFurniture('table', 5, 3) }
        }, {
          label: 'Mesa do Livro',
          callback: () => { actors.addFurniture('sorcererstable', 3, 2) }
        }, {
          label: 'Rack de Armas',
          callback: () => { actors.addFurniture('weaponsrack') }
        }, {
          label: 'Tortura',
          callback: () => { actors.addFurniture('rack', 1, 2) }
        }, {
          label: 'Trono',
          callback: () => { actors.addFurniture('throne', 1, 2) }
        }, {
          label: 'Tumba',
          callback: () => { actors.addFurniture('tomb', 4, 3) }
        }]
      }
    }
  }
}
