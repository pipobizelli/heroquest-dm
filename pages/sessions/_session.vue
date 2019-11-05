<template>
  <section class="session">
    <article id="session"></article>
    <article class="initiative">
      <h2>Iniciativa:</h2>
      <ul class="initiative__list">
        <li :class="[{'initiative__data--active': k === active_turn}, 'initiative__data']" v-for="(actor, k) in actors">
          <img :src="`${image_path}${actor.class}.png?alt=media`" alt="initiative actor">
          <p class="initiative__name" v-html="actor.name"></p>
        </li>
      </ul>
      <button type="button" @click="pass_turn" name="button">next turn</button>
    </article>
  </section>
</template>

<script>
import Config from '@@/config/env'
import { initSession } from '@@/modules/board/index'
export default {
  data () {
    return {
      actors: [],
      actual_turn: 0
    }
  },
  computed: {
    image_path () {
      return Config.paths.images
    },
    active_turn () {
      return this.actual_turn % this.actors.length
    }
  },
  watch: {
    active_turn (val) {
      if (val < 0) {
        this.active_turn = 0
      }
    }
  },
  async created () {
    this.id = this.$route.params.session
    if (process.browser) {
      window.Store = this.$store
      await this.$store.dispatch('session/load_quest', this.id)
      await initSession()
      this.actors = [...window.Store.state.session.slots, {
        class: 'orc',
        name: 'Monsters'
      }]
    }
  },
  methods: {
    pass_turn () {
      this.actual_turn++
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.session {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 865px 20%;
  grid-gap: 10px;

  .initiative {
    &__data {
      @extend .container;
      background-color: #f0f0f0;

      > img {
        display: inline-block;
        max-height: 31px;
      }

      &--active {
        background-color: #fff8ea;
      }
    }

    &__name {
      display: inline-block;
      line-height: 32px;
      vertical-align: top;
      margin-left: 10px;
    }
  }
}
</style>
