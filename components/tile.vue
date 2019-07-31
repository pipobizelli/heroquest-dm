<template>
  <v-rect ref="tile" :config="config" @click="tile_click"></v-rect>
</template>

<script>
import { EventHub } from '@@/models/event_hub'
export default {
  data () {
    return {
      config: {}
    }
  },
  props: ['tile_config', 'selected'],
  watch: {
    selected (newVal, oldVal) {
      console.log(this)
      let tile = this.$children[0]
      console.log(tile)
      tile.config.fill = '#bababa'
      // tile.opacity(0.5)
      tile.draw()
    }
  },
  created () {
    this.config = this.tile_config
  },
  methods: {
    disable (e) {
      let tile = e.target
      tile.attrs.disabled = true
      tile.attrs.fill = '#bababa'
      tile.opacity(0.5)
      tile.draw()
    },
    tile_click (e) {
      EventHub.$emit('Tile/click', this.tile_config)
    }
  }
}
</script>

<style lang="css">
</style>
