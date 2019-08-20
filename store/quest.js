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
  }
}

export const actions = {
  async load_quest ({commit}, id) {
    let response = await QuestFacade().getQuest(id)
    commit('set_quest', response.data)
  },
  update_quest ({state, commit}, data) {}
}
