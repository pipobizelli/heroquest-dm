import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/menu'

export function rotateBoardComponent (target) {
  const grid = new Grid()
  const menu = new Menu()
  // console.log(target)
  window.Store.commit('board/rotate_component', {
    component: {
      label: target.label,
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
          return target.type === 'secretdoors' || target.type === 'furnitures' || target.type === 'stairways'
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
