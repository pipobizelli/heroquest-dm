import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'

export const colors = {
  iddle: 0xFFFFFF,
  hover: 0xBABABA,
  disabled: 0xA5A5A5,
  selected: 0x00BE00
}

export async function canvasInit () {
  const PIXI = await import('pixi.js')
  let canvasApp = new PIXI.Application({ width: 868, height: 637, transparent: true })
  document.body.appendChild(canvasApp.view)
  canvasApp.view.addEventListener('contextmenu', (e) => {
    window.wasRightClick = true
    e.preventDefault()
  })

  const bg = PIXI.Sprite.from(`${Config.paths.images}boardmap.png?alt=media`)
  const grid = new PIXI.Container()
  grid.x = 5
  grid.y = 5

  canvasApp.stage.addChild(bg)
  canvasApp.stage.addChild(grid)

  drawGrid({ PIXI, grid })
}

function drawGrid ({ PIXI, grid }) {
  grid.removeChildren()
  for (let l = 0; l < BoardConfig.lines; l++) {
    for (let c = 0; c < BoardConfig.columns; c++) {
      let tile = new PIXI.Graphics()
      let config = getTileConfig({tile, l, c})
      changeFill(config)

      // EVENTS
      bindEvents({PIXI, grid, tile, l, c})
      grid.addChild(tile)
    }
  }
}

function changeFill ({tile, color, alpha, x, y}) {
  tile.clear()
  tile.beginFill(color, alpha)
  tile.drawRect(y, x, 33, 33)
  tile.endFill()
  return tile
}

function getTileConfig ({tile, l, c}) {
  return {
    tile: tile,
    color: getTileColor(l, c),
    alpha: getTileAlpha(l, c),
    x: l * 33,
    y: c * 33
  }
}

function getTileColor (l, c) {
  let color = Store.state.board.disabledTiles.indexOf(`${l}:${c}`) >= 0
    ? 'disabled'
    : Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0
      ? 'selected'
      : 'iddle'

  return colors[color]
}

function getTileAlpha (l, c) {
  let alpha = Store.state.board.disabledTiles.indexOf(`${l}:${c}`) >= 0
    ? 0.5
    : Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0
      ? 0.3
      : 0.1

  return alpha
}

function bindEvents ({PIXI, grid, tile, l, c}) {
  const delay = 200
  let clicks = 0
  let timer
  tile
    .on('pointerdown', function (e) {
      clicks++
      if(clicks === 1) {
        timer = setTimeout(function() {
            Store.commit('board/set_selected', [`${l}:${c}`])
            drawGrid({ PIXI, grid })
        }, delay)
      } else {
        clearTimeout(timer)
        let path = Pathfinder(Store.state.board.map).getAllPaths(`${l}:${c}`)
        Store.commit('board/set_selected', path)
        drawGrid({ PIXI, grid })
      }
    })
    .on('pointerover', function () {
      changeFill({
        tile: this,
        color: Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.hover,
        alpha: 0.5,
        x: l * 33,
        y: c * 33
      })
    })
    .on('pointerout', function () {
      changeFill({
        tile: this,
        color: Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.iddle,
        alpha: Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? 0.3 : 0.1,
        x: l * 33,
        y: c * 33
      })
    })
    .on('rightdown', function (e) {
      // e.preventDefault()
      console.log('abre menu!')
    })
    .interactive = true

  return tile
}
