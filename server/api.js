import express from 'express'
// import Config from '../config/env'
import { GetSession, ListSession, AddSession, UpdateSession } from '../api/controllers/session'
import { GetQuest, ListQuest, AddQuest, UpdateQuest, RemoveQuest } from '../api/controllers/quests'
import { GetCharacter, ListCharacter } from '../api/controllers/characters'
import { ListMonsters, GetMonster } from '../api/controllers/monsters'
import { ListFurniture, GetFurniture } from '../api/controllers/furniture'
import BodyParser from 'body-parser'
import Editor from '../data/editor.json'
import Session from '../data/session.json'

const app = express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
// Spritesheet Editor ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--=
app.get('/editor.json', (req, res) => {
  res.json(Editor)
})
app.get('/session.json', (req, res) => {
  res.json(Session)
})
app.get('/editor.png', (req, res) => {
  res.redirect('/editor.png')
})
app.get('/session.png', (req, res) => {
  res.redirect('/session.png')
})

// Session ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--=
app.get('/sessions/:id', (req, res) => {
  try { GetSession(req, res) } catch (e) { res.send('GetSession Error') }
})
app.get('/sessions', (req, res) => {
  try { ListSession(req, res) } catch (e) { res.send('ListSession Error') }
})
app.post('/sessions/add', async (req, res, next) => {
  try { await AddSession(req, res) } catch (e) { res.send('AddSession Error') }
})
app.post('/sessions/update', async (req, res) => {
  try { await UpdateSession(req, res) } catch (e) { res.send('UpdateSession Error') }
})

// Quests ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/quests', (req, res) => {
  try { ListQuest(req, res) } catch (e) { res.send('ListQuest Error') }
})
app.get('/quests/:id', (req, res) => {
  try { GetQuest(req, res) } catch (e) { res.send('GetQuest Error') }
})
app.post('/quests/add', async (req, res, next) => {
  try { await AddQuest(req, res) } catch (e) { res.send('AddQuest Error') }
})
app.post('/quests/update', async (req, res) => {
  try { await UpdateQuest(req, res) } catch (e) { res.send('UpdateQuest Error') }
})
app.delete('/quests/remove', async (req, res) => {
  try { await RemoveQuest(req, res) } catch (e) { res.send('RemoveQuest Error') }
})

// Characters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/characters', (req, res) => {
  try { ListCharacter(req, res) } catch (e) { res.send('ListCharacter Error') }
})
app.get('/characters/:id', (req, res) => {
  try { GetCharacter(req, res) } catch (e) { res.send('GetCharacter Error') }
})

// Monsters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/monsters', (req, res) => { ListMonsters(req, res) })
app.get('/monsters/:id', (req, res) => { GetMonster(req, res) })

// Furniture ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/furniture', (req, res) => { ListFurniture(req, res) })
app.get('/furniture/:id', (req, res) => { GetFurniture(req, res) })

export default {
  path: '/api',
  handler: app
}
