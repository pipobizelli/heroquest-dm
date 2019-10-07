import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'
import Menu from '@@/modules/editor/menu'
import { getTileColor } from '@@/modules/colors'

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
    this.grid.x = BoardConfig.margin
    this.grid.y = BoardConfig.margin
    this.grid.label = 'grid'
    this.menu = new Menu()
    this.sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/editor.json`].spritesheet
    this.shift = false
    document.addEventListener('keydown', (e) => {
      // SHIFT
      if (e.keyCode === 16) {
        this.shift = true
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 16) {
        this.shift = false
      }
    })
    return this
  }

  get data () {
    return this.grid
  }

  get tilePositon () {
    const tile = window.Store.state.board.selectedTiles[0]
    const first = tile.split(':')
    const x = parseInt(first[1]) * 33
    const y = parseInt(first[0]) * 33
    return { x, y }
  }

  clearGrid () {
    if (this.grid) {
      this.grid.removeChildren()
    }
    return this
  }

  changeFill ({ tile, color, alpha }) {
    tile.tint = color
    tile.alpha = alpha
    return tile
  }

  drawBorders () {
    const btop = new this.PIXI.Sprite(this.sheet.textures['border-top.png'])
    const bright = new this.PIXI.Sprite(this.sheet.textures['border-right.png'])
    const bbottom = new this.PIXI.Sprite(this.sheet.textures['border-bottom.png'])
    const bleft = new this.PIXI.Sprite(this.sheet.textures['border-left.png'])

    btop.x = 0
    btop.y = 0

    bright.x = BoardConfig.width - 5
    bright.y = 0

    bbottom.x = 0
    bbottom.y = BoardConfig.height - 5

    bleft.x = 0
    bleft.y = 0

    this.grid.parent.addChild(bleft, btop, bright, bbottom)

    return this
  }

  drawGrid () {
    if (!this.grid) {
      return false
    }
    this.clearGrid()
    for (let l = 0; l < BoardConfig.lines; l++) {
      for (let c = 0; c < BoardConfig.columns; c++) {
        const config = BoardConfig.config[`${l}:${c}`].config
        const tile = new this.PIXI.Sprite(this.sheet.textures[`${config}.png`])
        tile.label = `${l}:${c}`
        tile.x = c * 33
        tile.y = l * 33

        this.changeFill({
          tile,
          color: getTileColor(tile.label),
          alpha: 1
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
    tile
      .on('click', function () {
        clicks++
        if (clicks === 1) {
          timer = setTimeout(function () {
            if (window.Store.state.board.selectedTiles.indexOf(tile.label) < 0) {
              if (window.Store.state.board.selectedTiles.length > 0 && self.shift) {
                const l = window.Store.state.board.selectedTiles.length - 1
                const last = window.Store.state.board.selectedTiles[l]
                const path = Pathfinder(window.Store.state.board.map).getPath(tile.label, last)
                // window.Store.commit('board/set_selected', path)
                window.Store.commit('board/set_components', {
                  type: 'selectedTiles',
                  arr: path
                })
              } else {
                window.Store.commit('board/add_selected', tile.label)
              }
              self.drawGrid()
            } else {
              window.Store.commit('board/remove_selected', tile.label)
              // window.Store.commit('board/remove_component', {
              //   type: 'selectedTiles',
              //   component: tile.label
              // })
              self.drawGrid()
            }
          }, delay)
        } else {
          clearTimeout(timer)
          const path = Pathfinder(window.Store.state.board.map).getAllPaths(this.label)
          // window.Store.commit('board/set_selected', path)
          window.Store.commit('board/set_components', {
            type: 'selectedTiles',
            arr: path
          })
          self.drawGrid()
        }
      })
      .on('pointerover', function () {
        self.changeFill({
          tile: this,
          color: getTileColor(this.label, 'hover'),
          alpha: 0.8
        })
      })
      .on('pointerout', function () {
        self.changeFill({
          tile: this,
          color: getTileColor(this.label),
          alpha: 1
        })
      })
      .on('rightdown', async function (e) {
        const x = e.data.global.x
        const y = e.data.global.y
        if (window.Store.state.board.selectedTiles.length < 1) {
          const label = `${parseInt(y / 33)}:${parseInt(x / 33)}`
          // window.Store.commit('board/set_selected', [label])
          window.Store.commit('board/set_components', {
            type: 'selectedTiles',
            arr: [label]
          })
          self.drawGrid()
        }
        self.menu.openMenu({ x, y })
      })

    tile.interactive = true
    tile.hitArea = new this.PIXI.Rectangle(0, 0, 33, 33)

    return tile
  }
}
