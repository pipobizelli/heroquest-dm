import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'

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
          }, {
            label: '↺ -90º',
            callback: () => {
              target.angle -= 90
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
          }, {
            label: '↻ +180º',
            callback: () => {
              target.angle += 180
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
          }, {
            label: '↺ -180º',
            callback: () => {
              target.angle -= 180
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
          }
        ]
      },
      remove: {
        label: '✖ Remover',
        callback: () => {
          console.log(target)
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
