import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'
import { colors, getTileColor } from '@@/modules/editor/colors'
import { openMenu } from '@@/modules/editor/menu'

export function setupGrid (PIXI) {
  const grid = new PIXI.Container()
  grid.x = 6
  grid.y = 6

  return grid
}

export function clearGrid (grid) {
  grid.removeChildren()
}

export function getConfigTexture (handle) {
  return BoardConfig.config[handle].config
}

export function drawBorders (PIXI, canvasApp) {
  let sheet = PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
  let btop = new PIXI.Sprite(sheet.textures['border-top.png'])
  let bright = new PIXI.Sprite(sheet.textures['border-right.png'])
  let bbottom = new PIXI.Sprite(sheet.textures['border-bottom.png'])
  let bleft = new PIXI.Sprite(sheet.textures['border-left.png'])

  btop.x = 0
  btop.y = 0

  bright.x = BoardConfig.width - 5
  bright.y = 0

  bbottom.x = 0
  bbottom.y = BoardConfig.height - 5

  bleft.x = 0
  bleft.y = 0

  canvasApp.stage.addChild(btop, bright, bbottom, bleft)
}

export function drawGrid ({ PIXI, grid, menus }) {
  let sheet = PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
  grid.removeChildren()
  for (let l = 0; l < BoardConfig.lines; l++) {
    for (let c = 0; c < BoardConfig.columns; c++) {
      let config = getConfigTexture(`${l}:${c}`)
      let tile = new PIXI.Sprite(sheet.textures[`${config}.png`])

      changeFill({
        tile,
        color: getTileColor(l, c),
        alpha: 1,
        x: c * 33,
        y: l * 33
      })

      // EVENTS
      if (window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) < 0) {
        tilesEvents({ PIXI, sheet, grid, menus, tile, l, c })
      }

      grid.addChild(tile)
    }
  }
}

export function changeFill ({ tile, color, alpha, x, y }) {
  tile.tint = color
  tile.alpha = alpha
  tile.x = x
  tile.y = y
  return tile
}

export function tilesEvents ({ PIXI, grid, menus, tile, l, c }) {
  const delay = 200
  let clicks = 0
  let timer
  tile
    .on('click', function () {
      clicks++
      if (clicks === 1) {
        timer = setTimeout(function () {
          window.Store.commit('board/set_selected', [`${l}:${c}`])
          drawGrid({ PIXI, grid })
        }, delay)
      } else {
        clearTimeout(timer)
        let path = Pathfinder(window.Store.state.board.map).getAllPaths(`${l}:${c}`)
        window.Store.commit('board/set_selected', path)
        drawGrid({ PIXI, grid })
      }
    })
    .on('pointerover', function () {
      changeFill({
        tile: this,
        color: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.hover,
        alpha: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? 0.7 : 1,
        x: c * 33,
        y: l * 33
      })
    })
    .on('pointerout', function () {
      changeFill({
        tile: this,
        color: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.iddle,
        alpha: 1,
        x: c * 33,
        y: l * 33
      })
    })
    .on('rightdown', function (e) {
      openMenu({
        PIXI,
        grid,
        menus,
        x: e.data.global.x,
        y: e.data.global.y
      })
    })

  tile.interactive = true
  tile.hitArea = new PIXI.Rectangle(0, 0, 33, 33)

  return tile
}
