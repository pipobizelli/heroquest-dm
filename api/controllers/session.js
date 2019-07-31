import { Factory, Rest } from '../../models/session/index'

export async function GetSession (req, res) {
  try {
    let session = await Factory.GetSession(req.params.id)
    res.json(session)
  } catch (e) {
    console.log('[Controller] Session GetSession')
    res.json({
      error: e
    })
  }
}

export async function ListSession (req, res) {
  try {
    let session = await Rest.GetAll()
    res.json(session)
  } catch (e) {
    console.log('[Controller] Session ListSession')
    res.json({
      error: e
    })
  }
}

export async function AddSession (req, res) {
  try {
    let response = await Factory.AddSession({
      'state': req.body.state,
      'quest': req.body.quest,
      'slots': req.body.slots,
      'turns': req.body.turns
    })
    res.json(response)
  } catch (e) {
    console.log('[controller] session AddSession')
  }
}

export async function AddEntities (req, res) {
  try {
    let response = await Rest.addEntities(req.body.entities)
    res.json(response)
  } catch (e) {
    console.log('[controller] session AddEntities')
  }
}

export async function UpdateSession (req, res) {
  try {
    let response = await Rest.Update(req.body)
    res.json(response)
  } catch (e) {
    console.log('[controller] session UpdateSession')
    res.json(e)
  }
}
