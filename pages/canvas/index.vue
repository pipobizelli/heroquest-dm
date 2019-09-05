<template>
  <section id="editor">
  </section>
</template>

<script>
import { canvasInit } from '@@/modules/editor/index'

export default {
  async mounted () {
    if (process.browser) {
      window.Store = this.$store
      await canvasInit()
    }
  }
}
</script>

<style lang="css">
</style>
