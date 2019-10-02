import axios from 'axios'
import Config from '../config/env'
export default () => {
  return {
    async getSession (id) {
      try {
        const response = await axios.get(`${Config.paths.base_url}/api/sessions/${id}`)
        return response
      } catch (e) {
        console.log('[facade] session getSession')
        return e
      }
    },

    async getAllSessions () {
      try {
        const response = await axios.get(`${Config.paths.base_url}/api/sessions`)
        return response
      } catch (e) {
        console.log('[facade] session getAllSessions')
        return e
      }
    },

    async addSession (session) {
      try {
        const response = await axios.post(`${Config.paths.base_url}/api/sessions/add`, session)
        return response
      } catch (e) {
        console.log('[facade] session addSession')
        return e
      }
    },

    async updateSession (session) {
      try {
        const response = await axios.post(`${Config.paths.base_url}/api/sessions/update`, session)
        return response
      } catch (e) {
        console.log('[facade] session updateSession')
        return e
      }
    }
  }
}
