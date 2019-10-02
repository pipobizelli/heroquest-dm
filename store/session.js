import SessionFacade from '@@/facades/session'
import DefaultQuest from '@@/data/quest.json'
export const state = () => ({
  quest: DefaultQuest,
  slots: [],
  turns: []
})

export const mutations = {
  set_quest (state, quest) {
    state.quest = quest
  }
}

export const actions = {
  async load_quest ({ commit, dispatch }, id) {
    const response = await SessionFacade().getSession(id)
    console.log(response)
    commit('set_quest', response.data.quest)
    // dispatch('setup_quest')
  },
  setup_session ({ state }) {
    // const types = Object.keys(state.data.map)
  },
  update_session ({ commit }, data) {
    commit('set_quest', data)
  },
  save_session ({ state }, id) {
  }
}
