import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'

export function rotateBoardComponent (target) {
  const grid = new Grid()
  const menu = new Menu()
  window.Store.commit('board/rotate_component', {
    component: {
      tiles: target.tiles,
      type: target.type,
      rotation: target.angle
    }
  })
  menu.closeMenu()
  grid.drawGrid()
}

export default function (target) {
  const grid = new Grid()
  const menu = new Menu()

  return {
    actors: {
      rotate: {
        label: 'Girar',
        condition: () => {
          return target.type === 'secretdoors' || target.type === 'furniture'
        },
        sub: [
          {
            label: '↻ +90º',
            callback: () => {
              target.angle += 90
              rotateBoardComponent(target)
            }
          }, {
            label: '↺ -90º',
            callback: () => {
              target.angle -= 90
              rotateBoardComponent(target)
            }
          }, {
            label: '↻ +180º',
            callback: () => {
              target.angle += 180
              rotateBoardComponent(target)
            }
          }, {
            label: '↺ -180º',
            callback: () => {
              target.angle -= 180
              rotateBoardComponent(target)
            }
          }
        ]
      },
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
