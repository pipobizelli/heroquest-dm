<template>
  <section id="session"></section>
</template>

<script>
import { initSession } from '@@/modules/board/index'
export default {
  data () {
    return {
      id: null
    }
  },
  async created () {
    this.id = this.$route.params.session
    if (process.browser) {
      window.Store = this.$store
      await this.$store.dispatch('session/load_quest', this.id)
      await initSession()
    }
  }
}
</script>

<style lang="scss">
</style>
