import SessionFacade from '@@/facades/session'
import DefaultQuest from '@@/data/quest.json'
export const state = () => ({
  quest: DefaultQuest,
  heroes: [],
  turns: []
})

export const mutations = {
  set_quest (state, quest) {
    state.quest = quest
  },
  set_heroes (state, heroes) {
    state.heroes = heroes
  }
}

export const actions = {
  async load_quest ({ commit, dispatch }, id) {
    const response = await SessionFacade().getSession(id)
    commit('set_quest', response.data.quest)
    commit('set_heroes', response.data.slots)
  },
  update_session ({ commit }, data) {
    commit('set_quest', data)
  }
}
