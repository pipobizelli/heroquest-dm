<template>
  <section class="quest">
    <article id="editor"></article>
    <article class="quest__info">
      <div class="quest__data">
        <h2 class="quest__label">Titulo</h2>
        <p class="quest__value" v-html="quest.name" v-show="!edit.name"></p>
        <input class="quest__field" type="text" name="quest_name" v-show="edit.name" v-model="name">
        <a class="quest__edit" href="#" @click.prevent="editInfo('name')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Descrição</h2>
        <p class="quest__value" v-html="quest.description" v-show="!edit.desc"></p>
        <textarea class="quest__field" name="quest_desc" rows="6" v-show="edit.desc" v-model="description"></textarea>
        <a class="quest__edit" href="#" @click.prevent="editInfo('desc')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Dificuldade</h2>
        <p class="quest__value" v-html="difficulty" v-show="!edit.diff"></p>
        <select class="quest__dificulty" name="quest-dificulty" v-show="edit.diff" v-model="difficulty">
          <option value="easy">easy</option>
          <option value="normal">normal</option>
          <option value="hard">hard</option>
        </select>
        <a class="quest__edit" href="#" @click.prevent="editInfo('diff')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Numero Máximo de Jogadores</h2>
        <p class="quest__value" v-html="quest.slots.length"></p>
      </div>
      <article class="quest__actions">
        <button type="button" name="button" @click="updateQuest">Save!</button>
      </article>
    </article>
  </section>
</template>

<script>
import { initBoard } from '@@/modules/editor/index'
export default {
  data () {
    return {
      edit: {
        name: false,
        desc: false,
        diff: false
      },
      id: '',
      name: '',
      description: '',
      difficulty: ''
    }
  },
  watch: {
    name (val) {
      this.$store.commit('quest/change_name', val)
    },
    description (val) {
      this.$store.commit('quest/change_desc', val)
    },
    difficulty (val) {
      this.$store.commit('quest/change_diff', val)
    }
  },
  computed: {
    quest () {
      return this.$store.state.quest.data
    }
  },
  async mounted () {
    this.id = this.$route.params.quest
    if (process.browser) {
      window.Store = this.$store
      await this.$store.dispatch('quest/load_quest', this.id)
      await initBoard()
      this.name = this.$store.state.quest.data.name
      this.description = this.$store.state.quest.data.description
      this.difficulty = this.$store.state.quest.data.difficulty
    }
  },
  methods: {
    editInfo (node) {
      this.edit[node] = !this.edit[node]
      this.updateQuest()
    },
    update () {
      this.edit.name = false
      this.edit.desc = false
      this.edit.diff = false
      this.updateQuest()
    },
    async updateQuest () {
      this.$store.dispatch('quest/save_quest', this.id)
    }
  }
}
</script>

<style lang="scss">
  @import '~assets/styles/base';
  .quest {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 865px 20%;
    grid-gap: 10px;

    &__data {
      @extend .container;
    }

    &__data + &__data {
      margin-top: 10px;
    }

    &__label {
      font-size: 12px;
      color: gray;
      border-bottom: 1px solid lightgray;
      padding-bottom: 5px;
    }

    &__value {
      display: inline-block;
      margin-top: 10px;
      font-size: 12px;
      font-weight: bold;
      max-width: 70%;
    }

    &__edit {
      color: gray;
      float: right;
      margin: 7px 0 0 10px;
      vertical-align: top;
      text-decoration: none;

      > svg {
        font-size: 16px;
        vertical-align: top;
      }
    }

    &__field {
      display: inline-block;
      margin-top: 10px;
      max-width: 120px;
    }
  }
</style>
