import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      try {
        const actor = await Adapter.getDoc(id, type)
        return actor
      } catch (e) {
        console.log('[model] heroes', e)
      }
    }
  }
}
