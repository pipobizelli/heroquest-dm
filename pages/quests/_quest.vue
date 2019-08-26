<template>
  <section class="quest">
    <article class="quest__info">
      <div class="quest__data">
        <h2 class="quest__label">Titulo</h2>
        <p class="quest__value" v-html="quest.name" v-show="!edit.name"></p>
        <input class="quest__field" type="text" name="quest_name" v-show="edit.name" v-model="quest.name">
        <a class="quest__edit" href="#" @click.prevent="editInfo('name')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Descrição</h2>
        <p class="quest__value" v-html="quest.description" v-show="!edit.desc"></p>
        <textarea class="quest__field" name="quest_desc" rows="6" v-show="edit.desc" v-model="quest.description"></textarea>
        <a class="quest__edit" href="#" @click.prevent="editInfo('desc')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Dificuldade</h2>
        <p class="quest__value" v-html="quest.dificulty" v-show="!edit.dificulty"></p>
        <select class="quest__dificulty" name="quest-dificulty" v-show="edit.dificulty" v-model="quest.dificulty">
          <option value="easy">Facil</option>
          <option value="normal">Normal</option>
          <option value="hard">Difícil</option>
        </select>
        <a class="quest__edit" href="#" @click.prevent="editInfo('dificulty')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Numero Máximo de Jogadores</h2>
        <p class="quest__value" v-html="quest.slots.length"></p>
      </div>
    </article>
    <!-- <board :setupQuest="quest"></board> -->
    <!-- <button type="button" name="quest_update" @click="update()">Salvar</button> -->
  </section>
</template>

<script>
import QuestFacade from '@@/facades/quest'
import DefaultQuest from '@@/data/quest.json'
import { EventHub } from '@@/models/event_hub'
export default {
  data () {
    return {
      edit: {
        name: false,
        desc: false,
        dificulty: false
      },
      id: '',
      quest: DefaultQuest
    }
  },
  created () {
    EventHub.$on('Editor/add', (payload) => {
      switch (payload.component.collection) {
        case 'slots':
          this.addSlot(payload)
          break
        case 'blocks':
        case 'doors':
        case 'stairway':
          this.addMapComp(payload)
          break
        default:
          this.addComponent(payload)
          break
      }
    })

    EventHub.$on('Editor/enableTiles', (tiles) => {
      this.enableTiles(tiles)
    })

    EventHub.$on('Editor/disableTiles', (tiles) => {
      this.disableTiles(tiles)
    })

    EventHub.$on('Editor/remove', (payload) => {
      switch (payload.type) {
        case 'slots':
          this.removeSlot(payload)
          break
        case 'blocks':
        case 'doors':
        case 'stairway':
          this.removeMapComp(payload)
          break
        default:
          this.removeComponent(payload)
          break
      }
    })
  },
  mounted () {
    this.id = this.$route.params.quest
    this.$nextTick(async () => {
      let response = await QuestFacade().getQuest(this.$route.params.quest)
      this.setup(response.data)
    })
  },
  methods: {
    setup (quest) {
      let self = this
      setTimeout(() => {
        self.quest = quest
      }, 300)
    },
    editInfo (node) {
      this.edit[node] = !this.edit[node]
      this.saveQuest()
    },
    update () {
      this.edit.name = false
      this.edit.desc = false
      this.edit.dificulty = false
      this.saveQuest()
    },
    async saveQuest () {
      await QuestFacade().updateQuest({
        id: this.id,
        data: this.quest
      })
    },
    addSlot (payload) {
      this.quest.slots.push({
        tiles: payload.tiles
      })
      this.update()
    },
    removeSlot (payload) {
      this.quest.slots = this.quest.slots.filter(s => s.tiles[0] !== payload.tiles[0])
      this.update()
    },
    addMapComp (payload) {
      this.quest.map[payload.type].push({
        tiles: payload.tiles,
        id: `comp_${Date.now()}`
      })
      this.update()
    },
    addComponent (payload) {
      console.log(payload)
      this.quest.components.push({
        attributes: {
          tiles: payload.tiles,
          life: payload.component.data.attributes.life
        },
        collection: payload.collection,
        id: `${payload.type}_${Date.now()}`,
        type: payload.type
      })
      this.update()
    },
    removeMapComp (payload) {
      let arr = this.quest.map[payload.type].filter(b => b.id !== payload.id)
      this.quest.map[payload.type] = arr
      this.update()
    },
    removeComponent (payload) {
      let arr = this.quest.components.filter(c => c.id !== payload.id)
      this.quest.components = arr
      this.update()
    },
    enableTiles (tiles) {
      this.quest.map.disables = this.quest.map.disables.filter(t => tiles.indexOf(t) < 0)
      this.update()
    },
    disableTiles (tiles) {
      this.quest.map.disables = this.quest.map.disables.concat(tiles)
      this.update()
    }
  }
}
</script>

<style lang="scss">
</style>
