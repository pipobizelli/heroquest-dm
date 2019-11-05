<template>
  <section>
    <article class="session__wrapper">
      <ul class="session__list">
        <li class="session__ref" v-for="(session, i) in sessions">
          <nuxt-link :to="`/sessions/${session.id}`" v-html="`Sessão ${i}`"></nuxt-link>
        </li>
      </ul>
    </article>
    <article class="session__wrapper">
      <form class="session-form">
        <label v-if="selected_quest == ''">
          <h3 class="session-form__label">Quest:</h3>
          <select class="session-form__quest-select" v-model="selected_quest">
            <option disabled value="">Escolha a quest</option>
            <option v-for="q in quests" :value="q.id" v-html="q.data.name"></option>
          </select>
        </label>
        <template v-else>
          <h3 class="session-form__label">Quest:</h3>
          <h2 v-html="selected_quest_name"></h2>
          <label>
            <h3 class="session-form__label">Dificuldade:</h3>
            <select class="session-form__difficulty" v-model="difficulty">
              <option disabled value="">Escolha a dificuldade</option>
              <option>easy</option>
              <option>normal</option>
              <option>hard</option>
            </select>
          </label>
          <div>
            <h3 class="session-form__label">Personagens:</h3>
            <div class="session-form__players" v-for="(s, i) in slots">
              <label>
                <!-- slot {{i + 1}}: -->
                <!-- <input type="text" name="players" v-model="slots[i].character" v-if="!slots[i].is_loaded"> -->
                <autocomplete :search="search" :placeholder="`slot ${i + 1}`" :get-result-value="getResultValue" @submit="handleSubmit"></autocomplete>
              </label>
              <!-- <p v-if="slots[i].is_loaded">
                <span v-html="slots[i].name"></span>
                <font-awesome-icon icon="check"></font-awesome-icon>
              </p> -->
            </div>
          </div>
          <button type="button" name="play" v-show="all_characters.length > 0" @click="create_session">Play!</button>
        </template>
      </form>
    </article>
  </section>
</template>

<script>
import QuestFacade from '@@/facades/quest'
import CharactersFacade from '@@/facades/characters'
import SessionFacade from '@@/facades/session'

// import Render from '@@/renders/session'
export default {
  data () {
    return {
      sessions: [],
      quests: [{
        id: '',
        data: {
          name: ''
        }
      }],
      all_characters: [],
      selected_quest: '',
      selected_quest_name: '',
      difficulty: '',
      slots: []
    }
  },
  computed: {
    characters () {
      let chars = this.slots.map(s => s.character)
      return chars
    }
  },
  watch: {
    selected_quest (val) {
      let quest = this.quests.filter(q => q.id === val)[0]
      this.selected_quest_name = quest.data.name
      this.slots = []
      quest.data.slots.forEach((s) => {
        this.slots.push({
          is_loaded: false,
          tiles: s.tiles
        })
      })
    }
  },
  async created () {
    try {
      let response = await SessionFacade().getAllSessions()
      this.sessions = response.data
    } catch (e) {
      console.log(e.toString())
    }

    try {
      let chars = await CharactersFacade().getAllCharacters()
      this.all_characters = chars.data
    } catch (e) {
      console.log('[page] session form characters', e)
    }
  },
  async mounted () {
    try {
      let quest = await QuestFacade().getAllQuests()
      this.quests = quest.data
    } catch (e) {
      console.log('[page] session form quest', e)
    }
  },
  methods: {
    search(input) {
      if (input.length < 1) { return [] }
      return this.all_characters.filter(char => {
        return char.data.name.toLowerCase()
          .startsWith(input.toLowerCase())
      })
    },
    getResultValue(char) {
      return char.data.name
    },
    handleSubmit(char) {
      if (char) {
        const i = this.slots.filter(s => s.is_loaded).length
        this.slots[i] = {
          character: char.id,
          name: char.data.name,
          class: char.data.class,
          is_loaded: true,
          tiles: this.slots[i].tiles
        }
        // console.log(this.slots)
      }
    },
    async create_session () {
      try {
        const slots = this.slots.filter(s => s.is_loaded)
        if (slots.length > 0) {
          var newSession = await SessionFacade().addSession({
            quest: this.selected_quest,
            slots: slots,
            turns: [],
            state: {}
          })
        }
        this.$router.replace({ path: `sessions/${newSession.data}` })
      } catch (e) {
        console.log('[page] session create', e)
      }
    }
  }
}
</script>

<style lang="scss">
  .session-form {
    &__players + &__players {
      margin-top: 10px;
    }
  }
</style>
