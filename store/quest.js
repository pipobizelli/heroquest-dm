import QuestFacade from '@@/facades/quest'
import MonstersFacade from '@@/facades/monsters'
import DefaultQuest from '@@/data/quest.json'
export const state = () => ({
  data: DefaultQuest,
  monsters: []
})

export const mutations = {
  set_quest (state, quest) {
    state.data = {
      ...state.data,
      ...quest
    }
  },
  set_monsters (state, monsters) {
    state.monsters = monsters
  },
  add_slot (state, slot) {
    state.data.slots = [...state.data.slots, slot]
  },
  change_name (state, name) {
    state.data.name = name
  },
  change_desc (state, desc) {
    state.data.description = desc
  },
  change_diff (state, diff) {
    state.data.difficulty = diff
  }
}

export const actions = {
  async load_monsters ({ commit }) {
    const response = await MonstersFacade().getAllMonsters()
    commit('set_monsters', response.data)
  },
  async load_quest ({ commit, dispatch }, id) {
    const response = await QuestFacade().getQuest(id)
    commit('set_quest', response.data)
    dispatch('setup_quest')
  },
  setup_quest ({ state }) {
    this.commit('board/set_components', {
      type: 'slots',
      arr: state.data.slots
    })

    const types = Object.keys(state.data.map)

    for (const t in types) {
      this.commit('board/set_components', {
        type: types[t],
        arr: state.data.map[types[t]]
      })
    }
  },
  update_quest ({ commit }, data) {
    commit('set_quest', data)
  },
  async save_quest ({ state }, id) {
    const board = this.state.board
    const monstersArr = []
    for (const m in board.monsters) {
      const monster = board.monsters[m]
      const monsterObj = state.monsters.find(m => m.id === monster.label)
      monstersArr.push({
        ...monster,
        ...monsterObj.data
      })
    }
    const quest = {
      ...state.data,
      slots: board.slots,
      map: {
        blocks: board.blocks,
        disabledTiles: board.disabledTiles,
        doors: board.doors,
        furnitures: board.furnitures,
        monsters: monstersArr,
        searchs: board.searchs,
        secretdoors: board.secretdoors,
        stairways: board.stairways,
        traps: board.traps
      }
    }
    console.log(quest)
    await QuestFacade().updateQuest({
      id: id,
      data: quest
    })
  }
}
