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
      addActor: {
        label: 'Adicionar Actor',
        callback: () => {
          actors.addActor({
            ...grid.tilePositon,
            type: 'barbarian',
            width: 33,
            height: 33
          })
          menu.closeMenu()
        }
      }
    },
    doors: {
      addActor: {
        label: 'Adicionar Actor',
        callback: () => {
          actors.addActor({
            ...grid.tilePositon,
            type: 'barbarian',
            width: 33,
            height: 33
          })
          menu.closeMenu()
        }
      },
      addDoor: {
        label: 'Adicionar Actor',
        callback: () => {
          actors.addActor({
            ...grid.tilePositon,
            type: 'barbarian',
            width: 33,
            height: 33
          })
          menu.closeMenu()
        }
      },
      addBlock: {
        label: 'Adicionar Actor',
        callback: () => {
          actors.addActor({
            ...grid.tilePositon,
            type: 'barbarian',
            width: 33,
            height: 33
          })
          menu.closeMenu()
        }
      }
    }
  }
}
