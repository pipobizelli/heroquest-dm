import Adapter from '../../adapters/firebase'
export async function Get (id) {
  try {
    const quest = await Adapter().getDoc('quests', id)
    return quest
  } catch (e) {
    console.log('[model] quest')
    return e
  }
}

export async function GetAll () {
  try {
    const quests = []
    const response = await Adapter().getAllDocs('quests')
    response.forEach(quest => {
      quests.push({
        id: quest.id,
        data: quest.data()
      })
    })
    return quests
  } catch (e) {
    console.log('[model] get all quests')
    return e
  }
}

export async function Add (payload) {
  try {
    const response = await Adapter().addDoc('quests', payload)
    return response
  } catch (e) {
    console.log('[model] add quest')
    return e
  }
}

export async function Update (payload) {
  try {
    const response = await Adapter().updateDoc('quests', payload)
    return response
  } catch (e) {
    console.log('[model] update quest')
    return e
  }
}

export async function Remove (id) {
  try {
    await Adapter().removeDoc('quests', id)
    return true
  } catch (e) {
    console.log('[model] remove quest')
    return e
  }
}
