<template>

</template>

<script>
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
      // await initBoard()
    }
  }
}
</script>

<style lang="scss">
</style>
