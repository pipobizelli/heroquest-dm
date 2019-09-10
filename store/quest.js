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
      type: 'disabledTiles',
      arr: state.data.map.disables
    })

    this.commit('board/set_components', {
      type: 'blocks',
      arr: state.data.map.blocks
    })

    this.commit('board/set_components', {
      type: 'doors',
      arr: state.data.map.doors
    })

    this.commit('board/set_components', {
      type: 'secretdoors',
      arr: state.data.map.secretdoors
    })

    this.commit('board/set_components', {
      type: 'traps',
      arr: state.data.map.traps
    })
  },
  update_quest ({ commit }, data) {
    commit('set_quest', data)
  },
  async save_quest ({ state }, id) {
    const board = this.state.board
    const quest = {
      ...state.data,
      map: {
        blocks: board.blocks,
        disables: board.disabledTiles,
        doors: board.doors,
        searchs: board.searchs,
        secretdoors: board.secretdoors,
        stairway: board.stairway,
        traps: board.traps
      }
    }
    console.log(quest.map)
    await QuestFacade().updateQuest({
      id: id,
      data: quest
    })
  }
}
