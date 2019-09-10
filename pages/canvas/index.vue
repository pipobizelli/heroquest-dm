<template>
  <section id="editor">
  </section>
</template>

<script>
import { initBoard } from '@@/modules/editor/index'

export default {
  async mounted () {
    if (process.browser) {
      window.Store = this.$store
      await initBoard()
    }
  }
}
</script>

<style lang="css">
</style>
