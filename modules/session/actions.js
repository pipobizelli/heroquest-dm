import Grid from '@@/modules/session/grid'
import Menu from '@@/modules/menu'

export default function (target) {
  // console.log('id:', target)
  const grid = new Grid()
  const menu = new Menu()

  return {
    actors: {
      remove: {
        label: '✖ Apagar',
        callback: () => {
          target.parent.removeChild(target)
          window.Store.commit('board/remove_component', {
            component: target
          })
          menu.closeMenu()
          grid.drawGrid()
        }
      },
      combat: {
        label: '➤ Atacar',
        callback: () => {
          window.Store.commit('session/add_action', {
            component: {
              id: target.id
            },
            action: 'attack'
          })
          menu.closeMenu()
          grid.drawGrid()
        }
      }
    }
  }
}
