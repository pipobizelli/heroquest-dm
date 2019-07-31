<template>
  <section>
    <img :src="board.image" alt="tabuleiro">
    <no-ssr placeholder="Loading...">
      <v-stage :config="configKonva" class="board">
        <v-layer>
          <template v-for="(line, l) in board.tiles.lines">
            <template v-for="(column, c) in board.tiles.columns">
              <v-rect ref="tile" :config="get_config(l, c)" @click="tile_click" @dblclick="tile_dblclick($event, `${l}:${c}`)"></v-rect>
            </template>
          </template>
        </v-layer>
      </v-stage>
    </no-ssr>
  </section>
</template>

<script>
import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Pathfinder from '@@/helpers/pathfinder'
export default {
  data () {
    return {
      configKonva: {
        width: 858,
        height: 627
      },
      board: {
        image: `${Config.paths.images}boardmap.png?alt=media`,
        tiles: {
          lines: BoardConfig.lines,
          columns: BoardConfig.columns
        },
        config: BoardConfig.config
      },
      selectedTiles: []
    }
  },
  props: {
    disabledTiles: {
      type: Array,
      default: []
    }
  },
  methods: {
    get_config (l, c) {
      let handle = `${l}:${c}`
      return {
        handle,
        ...this.get_tile_fill(handle),
        x: (BoardConfig.tile.width * c),
        y: (BoardConfig.tile.height * l),
        width: BoardConfig.tile.width,
        height: BoardConfig.tile.height
      }
    },
    get_tile_fill (handle) {
      if (this.disabledTiles.indexOf(handle) >= 0) {
        if (this.selectedTiles.indexOf(handle) >= 0) {
          return {
            opacity: 0.8,
            fill: '#5faa5a'
          }
        }

        return {
          opacity: 0.8,
          fill: '#c8c8c8'
        }
      }

      if (this.selectedTiles.indexOf(handle) >= 0) {
        return {
          opacity: 0.5,
          fill: '#69d162'
        }
      }

      return {
        opacity: 0.5,
        fill: 'transparent'
      }
    },
    clear_selected_tiles () {
      this.selectedTiles = []
    },
    tile_click (e) {
      this.clear_selected_tiles()
      this.selectedTiles = [ e.target.attrs.handle ]
    },
    tile_dblclick (e, tile) {
      this.clear_selected_tiles()
      this.selectedTiles = Pathfinder(this.board).getAllPaths(tile)
    }
  }
}
</script>

<style lang="scss">
  .board {
    position: absolute;
    top: 5px;
    left: 5px;
  }
</style>
