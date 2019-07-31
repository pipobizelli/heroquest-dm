<template>
  <section>
    <img :src="board.image" alt="tabuleiro">
    <no-ssr placeholder="Loading...">
      <v-stage :config="configKonva" class="board">
        <v-layer>
          <template v-for="(line, l) in board.tiles.lines">
            <template v-for="(column, c) in board.tiles.columns">
              <v-rect ref="tile" :config="{
                handle: `${l}:${c}`,
                x: (33 * c),
                y: (33 * l),
                width: 33,
                height: 33,
                opacity: 0.5,
                fill: selectedTiles.indexOf(`${l}:${c}`) >= 0 ? '#bababa' : 'transparent'
              }" @click="tile_click" @dblclick="tile_dblclick($event, `${l}:${c}`)"></v-rect>
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
  watch: {
    selectedTiles (n) {
      console.log(n)
    }
  },
  methods: {
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
