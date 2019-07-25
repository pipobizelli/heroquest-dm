<template>
  <v-rect :config="tile_config"></v-rect>
</template>

<script>
export default {
  data () {
    return {
      handle: '',
      path: '0000',
      hasDoor: false
    }
  },
  props: ['tile_config']
}
</script>

<style lang="css">
</style>
