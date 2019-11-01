import axios from 'axios'
import Config from '../config/env'
export default () => {
  return {
    async getQuest (id) {
      try {
        const response = await axios.get(`${Config.paths.base_url}/api/quests/${id}`)
        return response
      } catch (e) {
        console.log('[facade] quest getQuest')
        return e
      }
    },

    async getAllQuests () {
      try {
        const response = await axios.get(`${Config.paths.base_url}/api/quests`)
        return response
      } catch (e) {
        console.log('[facade] quest getAllQuests')
        return e
      }
    },

    async addQuest (quest) {
      try {
        const response = await axios.post(`${Config.paths.base_url}/api/quests/add`, quest)
        return response
      } catch (e) {
        console.log('[facade] quest addQuest')
        return e
      }
    },

    async updateQuest (quest) {
      try {
        const response = await axios.post(`${Config.paths.base_url}/api/quests/update`, quest)
        return response
      } catch (e) {
        console.log('[facade] quest updateQuest')
        return e
      }
    },

    async removeQuest (id) {
      try {
        const response = await axios.delete(`${Config.paths.base_url}/api/quests/remove`, { data: { id: id } })
        return response
      } catch (e) {
        console.log('[facade] removeQuest')
        return e
      }
    }
  }
}
