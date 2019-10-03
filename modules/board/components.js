import BoardConfig from '@@/data/board.json'
import Config from '@@/config/env'
import Grid from './grid'
import Tile from '@@/helpers/tile'
import { colors } from '@@/modules/colors'

let instance = null
export default class Components {
  constructor () {
    if (instance) {
      return instance
    }
    instance = this
    return instance
  }

  async setup () {
    this.PIXI = await import('pixi.js')
    this.grid = new Grid()
    this.wrapper = new this.PIXI.Container()
    this.wrapper.x = BoardConfig.margin
    this.wrapper.y = BoardConfig.margin
    this.sheet = this.PIXI.Loader.shared.resources[`${Config.paths.base_url}/api/session.json`].spritesheet
    this.TileHelper = Tile(window.Store.state.board.map)
    this.slots = 0
    this.pX = 16
    this.pY = 16
    return this
  }

  get data () {
    return this.wrapper
  }

  addDisabledTile (tile) {
    const tileSprite = new this.PIXI.Sprite(this.sheet.textures['tile.png'])
    const tileObj = this.TileHelper.getTilebyHandle(tile)
    // console.log(tileObj)
    tileSprite.label = 'disabled'
    tileSprite.x = parseInt(tileObj.c) * 33
    tileSprite.y = parseInt(tileObj.l) * 33
    tileSprite.tint = colors.darkGray
    tileSprite.alpha = 0.6
    this.wrapper.addChild(tileSprite)
  }

  addBlock (tiles) {
    // const tiles = window.Store.state.board.selectedTiles
    const config = {
      label: 'block',
      type: 'blocks',
      width: 33,
      height: 33
    }

    for (const t in tiles) {
      const tileObj = this.TileHelper.getTilebyHandle(tiles[t])
      const n = parseInt(t) + 1
      const p = parseInt(t) - 1
      const next = this.TileHelper.getTileHandle(this.TileHelper.getNextTile(tiles[t]))
      const prev = this.TileHelper.getTileHandle(this.TileHelper.getPrevTile(tiles[t]))
      const cords = {
        x: tileObj.c * 33,
        y: tileObj.l * 33
      }

      config.tiles = [tiles[t]]

      let double = false
      if (tiles[n] && (tiles[n] === next || tiles[n] === prev)) {
        config.label = 'doubleblock'
        config.width = 66
        config.tiles = [tiles[t], tiles[n]]
        double = true
      }

      if (tiles[p] && (tiles[p] === next || tiles[p] === prev)) {
        const prevTileObj = this.TileHelper.getFirstTile(tiles[t], tiles[p])
        cords.x = prevTileObj.c * 33
        cords.y = prevTileObj.l * 33
        config.tiles = [tiles[p], tiles[t]]
      }

      if (!double) {
        this.addActor({
          ...config,
          ...cords
        })

        // reset
        config.label = 'block'
        config.width = 33
      }
    }
  }

  addDoor (tiles) {
    if (tiles.length !== 2) {
      return false
    }

    const t1 = tiles[0]
    const t2 = tiles[1]
    const tileObj = this.TileHelper.getFirstTile(t1, t2)
    const door = this.addActor({
      label: 'door',
      type: 'doors',
      tiles: [t1, t2],
      rotation: this.TileHelper.isTileInColumn(t1, t2) ? 90 : 0,
      anchorX: this.TileHelper.isTileInColumn(t1, t2) ? 0 : 0,
      anchorY: this.TileHelper.isTileInColumn(t1, t2) ? 1 : 0,
      x: tileObj.c * 33,
      y: tileObj.l * 33
    })

    return door
  }

  addActor ({ label, x, y, type = 'actors', tiles = [], anchorX = 0, anchorY = 0, rotation = 0 }) {
    const actor = new this.PIXI.Sprite(this.sheet.textures[`${label}.png`])
    actor.type = type
    actor.label = label
    actor.tiles = tiles
    actor.anchor.set(anchorX, anchorY)
    actor.angle = rotation
    actor.x = x
    actor.y = y

    this.wrapper.addChild(actor)

    return actor
  }
}
