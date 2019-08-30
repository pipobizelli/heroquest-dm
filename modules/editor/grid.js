import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'
import Menu from '@@/modules/editor/menu'
import { colors, getTileColor } from '@@/modules/editor/colors'

export default async () => {
  const PIXI = await import('pixi.js')
  const grid = new PIXI.Container()
  const menu = await Menu()

  var setupGrid = () => {
    grid.x = 6
    grid.y = 6
    drawGrid()
    return grid
  }

  var clearGrid = (grid) => {
    grid.removeChildren()
    return grid
  }

  var changeFill = ({ tile, color, alpha, x, y }) => {
    tile.tint = color
    tile.alpha = alpha
    tile.x = x
    tile.y = y
    return tile
  }

  var drawBorders = () => {
    const sheet = PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
    const btop = new PIXI.Sprite(sheet.textures['border-top.png'])
    const bright = new PIXI.Sprite(sheet.textures['border-right.png'])
    const bbottom = new PIXI.Sprite(sheet.textures['border-bottom.png'])
    const bleft = new PIXI.Sprite(sheet.textures['border-left.png'])

    btop.x = 0
    btop.y = 0

    bright.x = BoardConfig.width - 5
    bright.y = 0

    bbottom.x = 0
    bbottom.y = BoardConfig.height - 5

    bleft.x = 0
    bleft.y = 0

    grid.parent.addChild(btop, bright, bbottom, bleft)
  }

  var drawGrid = () => {
    const sheet = PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
    grid.removeChildren()
    for (let l = 0; l < BoardConfig.lines; l++) {
      for (let c = 0; c < BoardConfig.columns; c++) {
        const config = BoardConfig.config[`${l}:${c}`].config
        const tile = new PIXI.Sprite(sheet.textures[`${config}.png`])

        changeFill({
          tile,
          color: getTileColor(l, c),
          alpha: 1,
          x: c * 33,
          y: l * 33
        })

        // EVENTS
        tilesEvents({ tile, l, c })

        grid.addChild(tile)
      }
    }

    return grid
  }

  var tilesEvents = async ({ tile, l, c }) => {
    const delay = 200
    let clicks = 0
    let timer
    tile
      .on('click', function () {
        clicks++
        if (clicks === 1) {
          timer = setTimeout(function () {
            window.Store.commit('board/set_selected', [`${l}:${c}`])
            drawGrid()
          }, delay)
        } else {
          clearTimeout(timer)
          const path = Pathfinder(window.Store.state.board.map).getAllPaths(`${l}:${c}`)
          window.Store.commit('board/set_selected', path)
          drawGrid()
        }
      })
      .on('pointerover', function () {
        if (window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) < 0) {
          changeFill({
            tile: this,
            color: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.hover,
            alpha: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? 0.7 : 1,
            x: c * 33,
            y: l * 33
          })
        }
      })
      .on('pointerout', function () {
        if (window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) < 0) {
          changeFill({
            tile: this,
            color: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.white,
            alpha: 1,
            x: c * 33,
            y: l * 33
          })
        }
      })
      .on('rightdown', async function (e) {
        console.log(menu)
        menu.openMenu({
          x: e.data.global.x,
          y: e.data.global.y
        })
      })

    tile.interactive = true
    tile.hitArea = new PIXI.Rectangle(0, 0, 33, 33)

    return tile
  }

  return {
    setupGrid,
    clearGrid,
    changeFill,
    drawGrid,
    drawBorders
  }
}
