import Grid from '@@/modules/board/grid'
import Menu from '@@/modules/menu'

export default function (target) {
  console.log(target)
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
      }
    }
  }
}
