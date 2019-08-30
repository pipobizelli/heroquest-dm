import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'
import Menu from './menu'
import { colors, getTileColor } from './colors'

let instance = null

export default class Grid {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup () {
    this.PIXI = await import('pixi.js')
    this.grid = new this.PIXI.Container()
    this.grid.x = 6
    this.grid.y = 6
    this.grid.label = 'grid'
    this.menu = new Menu()
    return this
  }

  get data () {
    return this.grid
  }

  clearGrid () {
    this.grid.removeChildren()
    return this
  }

  changeFill ({ tile, color, alpha, x, y }) {
    tile.tint = color
    tile.alpha = alpha
    tile.x = x
    tile.y = y
    return tile
  }

  drawBorders () {
    const sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
    const btop = new this.PIXI.Sprite(sheet.textures['border-top.png'])
    const bright = new this.PIXI.Sprite(sheet.textures['border-right.png'])
    const bbottom = new this.PIXI.Sprite(sheet.textures['border-bottom.png'])
    const bleft = new this.PIXI.Sprite(sheet.textures['border-left.png'])

    btop.x = 0
    btop.y = 0

    bright.x = BoardConfig.width - 5
    bright.y = 0

    bbottom.x = 0
    bbottom.y = BoardConfig.height - 5

    bleft.x = 0
    bleft.y = 0

    this.grid.parent.addChild(btop, bright, bbottom, bleft)

    return this
  }

  drawGrid () {
    const sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/spritesheet.json`].spritesheet
    this.clearGrid()
    for (let l = 0; l < BoardConfig.lines; l++) {
      for (let c = 0; c < BoardConfig.columns; c++) {
        const config = BoardConfig.config[`${l}:${c}`].config
        const tile = new this.PIXI.Sprite(sheet.textures[`${config}.png`])

        this.changeFill({
          tile,
          color: getTileColor(l, c),
          alpha: 1,
          x: c * 33,
          y: l * 33
        })

        // EVENTS
        this.tilesEvents({ tile, l, c })

        this.grid.addChild(tile)
      }
    }

    return this
  }

  tilesEvents ({ tile, l, c }) {
    const delay = 200
    const self = this
    let clicks = 0
    let timer
    tile.label = `${l}:${c}`
    tile
      .on('click', function () {
        clicks++
        if (clicks === 1) {
          timer = setTimeout(function () {
            window.Store.commit('board/set_selected', [`${l}:${c}`])
            self.drawGrid()
          }, delay)
        } else {
          clearTimeout(timer)
          const path = Pathfinder(window.Store.state.board.map).getAllPaths(`${l}:${c}`)
          window.Store.commit('board/set_selected', path)
          self.drawGrid()
        }
      })
      .on('pointerover', function () {
        if (window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) < 0) {
          self.changeFill({
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
          self.changeFill({
            tile: this,
            color: window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0 ? colors.selected : colors.white,
            alpha: 1,
            x: c * 33,
            y: l * 33
          })
        }
      })
      .on('rightdown', async function (e) {
        self.menu.openMenu({
          x: e.data.global.x,
          y: e.data.global.y
        })
      })

    tile.interactive = true
    tile.hitArea = new this.PIXI.Rectangle(0, 0, 33, 33)

    return tile
  }
}
