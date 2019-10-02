import Adapter from '../../adapters/firebase'
import { Add, Get, AddEntities } from './rest'
export async function GetSession (sessionId) {
  try {
    const session = await Get(sessionId)
    const quest = await Adapter().getDoc('quests', session.quest)
    const entities = await Adapter().queryDocs('session_entities', ['session_id', '==', sessionId])
    const components = entities.map(e => {
      return {
        ...e.data(),
        entity_id: e.id
      }
    })

    return {
      ...session,
      quest: {
        title: quest.name,
        description: quest.description,
        objectives: {
          ...quest.objectives
        },
        map: quest.map,
        components: components
      }
    }
  } catch (e) {
    console.log('[factory] session GetSession')
  }
}

export async function AddSession (session) {
  // Criar as entities juntando os personagens e components
  try {
    const quest = await Adapter().getDoc('quests', session.quest)
    const components = await GetComponents(quest)
    const characters = await GetCharaceters(session.slots)
    const heroes = ValidateCharacters(characters)
    const entitiesArr = heroes.concat(components)
    const id = await Add(session)
    entitiesArr.map((e) => {
      e.session_id = id
      return e
    })
    await AddEntities(entitiesArr)

    return id
  } catch (e) {
    console.log('[factory] session AddSession')
  }
}

// Carregar os components da quest
export async function GetComponents (quest) {
  try {
    let components = quest.components.map(async (c) => {
      let comp = await Adapter().getDoc(c.collection, c.type)
      return {
        ...comp,
        attributes: {
          ...comp.attributes,
          tiles: c.attributes.tiles
        }
      }
    })
    return Promise.all(components)
  } catch (e) {
    console.log('[factory] session GetComponents')
  }
}

// Carregar e validar os Personagens carregados (se existem e se estão aptos)
export async function GetCharaceters (slots) {
  try {
    let characters = slots.map(async (slot, index) => {
      let char = await Adapter().getDoc('characters', slot.character)
      let hero = await Adapter().getDoc('heroes', char.type)
      return {
        ...hero,
        ...char,
        slot: index,
        class: 'hero',
        attributes: {
          ...char.attributes,
          tiles: slot.tiles
        }
      }
    })
    return Promise.all(characters)
  } catch (e) {
    console.log('[factory] session ValidateCharacters')
  }
}

export function ValidateCharacters (characters) {
  return characters.filter((c) => {
    return c.attributes.life > 0
  })
}
