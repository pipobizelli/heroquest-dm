<template>
  <section>
  </section>
</template>

<script>
import {canvasInit} from '@@/modules/index'

export default {
  created () {
    if (process.browser) {
      window.Store = this.$store
    }
  },
  async mounted () {
    await canvasInit()
  }
}
</script>

<style lang="css">
</style>
