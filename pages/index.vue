<template>
  <section>
    <board :disabledTiles="[]"></board>
  </section>
</template>

<script>
import Board from '@@/components/board'
export default {
  components: {
    Board
  }
}
</script>

<style lang="scss">
</style>
