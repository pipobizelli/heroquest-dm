import Grid from '@@/modules/editor/grid'
import Menu from '@@/modules/editor/menu'

export default function (target) {
  const grid = new Grid()
  const menu = new Menu()

  return {
    actors: {
      rotate: {
        label: 'Girar',
        sub: [
          {
            label: '↻ 90º',
            callback: () => {
              target.angle += 90
              menu.closeMenu()
              grid.drawGrid()
            }
          }, {
            label: '↺ 90º',
            callback: () => {
              target.angle -= 90
              menu.closeMenu()
              grid.drawGrid()
            }
          }
        ]
      }
    }
  }
}
