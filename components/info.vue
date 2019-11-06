<template>
  <section class="info" v-if="Object.values(actor).length > 0">
    <article class="info__wrapper">
      <header>
        <img class="info__icon" :src="`${image_path}${actor.label}.png?alt=media`" alt="actor">
        <h2 class="info__name" v-if="actor.name" v-html="actor.name"></h2>
        <h2 class="info__name" v-else v-html="actor.label"></h2>
      </header>
      <section class="info__data">
        <h3 class="info__label">Vida:</h3>
        <p class="info__value" v-html="actor.attributes.life"></p>
      </section>
      <section class="info__data">
        <h3 class="info__label">Ataque:</h3>
        <p class="info__value--combat">
          <img v-for="a in actor.attributes.attack" class="info__icon--combat" :src="`${image_path}skull.png?alt=media`" alt="actor">
        </p>
      </section>
      <section class="info__data">
        <h3 class="info__label">Defesa:</h3>
        <p class="info__value--combat">
          <img v-for="a in actor.attributes.defense" class="info__icon--combat" :src="`${image_path}${defIcon}.png?alt=media`" alt="actor">
        </p>
      </section>
      <section v-if="actor.attributes.move" class="info__data">
        <h3 class="info__label">Movimento:</h3>
        <p class="info__value" v-html="actor.attributes.move"></p>
      </section>
    </article>
  </section>
</template>

<script>
import Config from '@@/config/env'
export default {
  computed: {
    actor () {
      return this.$store.state.session.info
    },
    image_path () {
      return Config.paths.images
    },
    defIcon () {
      return this.actor.class !== 'monster' ? 'shield' : 'bunny'
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.info {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px dashed gray;

  &__wrapper {
    @extend .container;
    background: #b0b0b0;
    color: #fff;
  }

  &__icon {
    opacity: .8;
    height: 31px;
    display: inline-block;

    &--combat {
      height: 20px;
    }
  }

  &__name {
    display: inline-block;
    line-height: 32px;
    font-size: 20px;
    text-transform: capitalize;
    vertical-align: top;
    margin-left: 10px;
    color: #fff;
  }

  &__data {
    display: grid;
    grid-template-columns: 40% auto;
    grid-gap: 10px;
    margin-top: 10px;
  }

  &__label {
    font-size: 14px;
    line-height: 20px;
  }

  &__value {
    line-height: 20px;
    padding-left: 7px;

    &--combat {
      padding-left: 0px;
      display: grid;
      grid-template-columns: repeat(auto-fill, 25px);
      justify-items: center;
    }
  }
}
</style>
