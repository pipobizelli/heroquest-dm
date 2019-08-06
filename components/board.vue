<template>
  <section>
    <img :src="boardImage" alt="tabuleiro">
    <no-ssr placeholder="Loading...">
      <v-stage :config="configKonva" class="board">
        <v-layer>
          <template v-for="tile in tiles">
            <v-rect :config="tile" @click="tile_click(tile.handle)" @dblclick="tile_dblclick($event, tile.handle)"></v-rect>
          </template>
        </v-layer>
      </v-stage>
    </no-ssr>
  </section>
</template>

<script>
import Config from '@@/config/env'
import Pathfinder from '@@/helpers/pathfinder'
export default {
  data () {
    return {
      configKonva: {
        width: 858,
        height: 627
      },
      boardImage: `${Config.paths.images}boardmap.png?alt=media`,
      map: this.$store.state.board.map,
      tiles: this.$store.state.board.tiles,
      quest: {
        heroes: [],
        monsters: [],
        misc: [],
        active_turn: 0,
        disabledTiles: ['0:1', '0:2'],
        ...this.setupQuest
      },
      selectedTiles: []
    }
  },
  watch: {
    selectedTiles (tiles) {
      tiles.map(tile => {
        this.set_tile_options(tile)
      })
    }
  },
  props: ['setupQuest'],
  created () {
    this.$store.dispatch('board/init')
    this.quest.disabledTiles.map(tile => {
      this.set_tile_options(tile)
    })
  },
  methods: {
    clear_selected_tiles () {
      let tempTiles = this.selectedTiles
      this.selectedTiles = []
      tempTiles.map(tile => {
        this.set_tile_options(tile)
      })
    },
    set_tile_options (tile) {
      let options = {
        fill: 'transparent',
        opacity: 0.5
      }

      if (this.selectedTiles.indexOf(tile) >= 0) {
        options = {
          opacity: 0.5,
          fill: '#69d162'
        }
      }

      if (this.quest.disabledTiles.indexOf(tile) >= 0) {
        options = {
          opacity: 0.8,
          fill: '#c8c8c8'
        }

        if (this.selectedTiles.indexOf(tile) >= 0) {
          options = {
            opacity: 0.8,
            fill: '#5faa5a'
          }
        }
      }

      this.tiles[tile] = {
        ...this.tiles[tile],
        ...options
      }
    },
    tile_click (tile) {
      this.clear_selected_tiles()
      this.selectedTiles = [ tile ]
    },
    tile_dblclick (e, tile) {
      this.clear_selected_tiles()
      this.selectedTiles = Pathfinder(this.map).getAllPaths(tile)
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
