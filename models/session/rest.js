import Adapter from '../../adapters/firebase'

export async function Get (id) {
  try {
    const response = await Adapter().getDoc('sessions', id)
    return response
  } catch (e) {
    console.log('[model] session get')
    return {}
  }
}

export async function GetAll () {
  try {
    const sessions = []
    const response = await Adapter().getAllDocs('sessions')
    response.forEach(quest => {
      sessions.push({
        id: quest.id,
        data: quest.data()
      })
    })
    return sessions
  } catch (e) {
    console.log('[model] session get all')
    return e
  }
}

export async function Add (payload) {
  try {
    const response = await Adapter().addDoc('sessions', payload)
    return response
  } catch (e) {
    console.log('[model] session add')
    return {}
  }
}

export async function AddEntities (arr) {
  try {
    const response = await Adapter().batchDocs('session_entities', arr)
    return response
  } catch (e) {
    console.log('[model] session addEntity')
    return {}
  }
}

export async function Update (payload) {
  try {
    const response = await Adapter().updateDoc('sessions', payload)
    return response
  } catch (e) {
    console.log('[model] session update')
    return e
  }
}
