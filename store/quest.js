import QuestFacade from '@@/facades/quest'
import DefaultQuest from '@@/data/quest.json'
export const state = () => ({
  data: DefaultQuest
})

export const mutations = {
  set_quest (state, quest) {
    state.data = {
      ...state.data,
      ...quest
    }
  },
  add_slot (state, slot) {
    state.data.slots = [...state.data.slots, slot]
  }
}

export const actions = {
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
    const quest = {
      ...state.data,
      slots: board.slots,
      map: {
        blocks: board.blocks,
        disabledTiles: board.disabledTiles,
        doors: board.doors,
        furnitures: board.furnitures,
        monsters: board.monsters,
        searchs: board.searchs,
        secretdoors: board.secretdoors,
        stairway: board.stairway,
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
