<template>
  <no-ssr placeholder="Loading...">
    <v-stage :config="configKonva" class="board">
      <v-layer>
        <v-image :config="{ image: bgImage }"></v-image>
        <template v-for="(line, l) in board.tiles.lines">
          <template v-for="(column, c) in board.tiles.columns">
            <tile :tile_config="get_config(l, c)"></tile>
          </template>
        </template>
      </v-layer>
    </v-stage>
  </no-ssr>
</template>

<script>
import Config from '@@/config/env'
import BoardConfig from '@@/data/board.json'
import Tile from './tile'
export default {
  data () {
    return {
      configKonva: {
        width: 877,
        height: 644
      },
      board: {
        tiles: {
          lines: BoardConfig.lines,
          columns: BoardConfig.columns
        },
        config: BoardConfig.config
      },
      bgImage: null
    }
  },
  components: {
    Tile
  },
  created () {
    if (process.client) {
      const image = new window.Image()
      image.src = `${Config.paths.images}boardmap.png?alt=media`
      image.onload = () => {
        this.bgImage = image
      }
    }
  },
  methods: {
    get_config (l, c) {
      return {
        x: (33 * c) + 5,
        y: (33 * l) + 5,
        width: 33,
        height: 33
      }
    }
  }
}
</script>

<style lang="scss">
</style>
