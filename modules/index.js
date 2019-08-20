import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'

export const colors = {
  iddle: 0xFFFFFF,
  hover: 0xBABABA,
  selected: 0x00BE00
}

export async function canvasInit () {
  const PIXI = await import('pixi.js')
  let canvasApp = new PIXI.Application({ width: 868, height: 637, transparent: true })
  document.body.appendChild(canvasApp.view)

  const grid = PIXI.Sprite.from(`${Config.paths.images}boardmap.png?alt=media`)
  const tiles = new PIXI.Container()

  canvasApp.stage.addChild(grid)
  canvasApp.stage.addChild(tiles)

  tiles.x = 5
  tiles.y = 5

  for (let l = 0; l < BoardConfig.lines; l++) {
    for (let c = 0; c < BoardConfig.columns; c++) {
      let tile = new PIXI.Graphics()
      changeFill({
        tile: tile,
        color: colors.iddle,
        alpha: 0.1,
        x: l * 33,
        y: c * 33
      })
      tile
        .on('pointerdown', function () {
          changeFill({
            tile: this,
            color: colors.selected,
            alpha: 0.3,
            x: l * 33,
            y: c * 33
          })
          Store.commit('board/set_selected', [`${l}:${c}`])
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
        .interactive = true

      tiles.addChild(tile)
    }
  }
}

function changeFill ({ tile, color, alpha, x, y }) {
  tile.clear()
  tile.beginFill(color, alpha)
  tile.drawRect(y, x, 33, 33)
  tile.endFill()
  return tile
}

export function setupBoard (PIXI, canvasApp) {
  console.log(canvasApp)
}
