import SessionFacade from '@@/facades/session'
import DefaultQuest from '@@/data/quest.json'
export const state = () => ({
  quest: DefaultQuest,
  slots: [],
  actors: [],
  turns: [],
  info: {}
})

export const mutations = {
  set_quest (state, quest) {
    state.quest = quest
  },
  set_slots (state, slots) {
    state.slots = slots
  },
  set_actors (state, actors) {
    state.actors = actors
  },
  set_info (state, actor) {
    state.info = actor
  },
  add_action (state, { component, action }) {
    console.log({ component, action })
    state.turns.push({
      ...component,
      action
    })
  }
}

export const actions = {
  async load_quest ({ commit, dispatch }, id) {
    const response = await SessionFacade().getSession(id)
    commit('set_quest', response.data.quest)
    commit('set_slots', response.data.slots)
    commit('set_actors', response.data.actors)
  },
  update_session ({ commit }, data) {
    commit('set_quest', data)
  }
}
