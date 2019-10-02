import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _548a3b85 = () => interopDefault(import('../pages/quests/index.vue' /* webpackChunkName: "pages/quests/index" */))
const _20846711 = () => interopDefault(import('../pages/sessions/index.vue' /* webpackChunkName: "pages/sessions/index" */))
const _4fd18f40 = () => interopDefault(import('../pages/quests/_quest.vue' /* webpackChunkName: "pages/quests/_quest" */))
const _4ebb0330 = () => interopDefault(import('../pages/sessions/_session.vue' /* webpackChunkName: "pages/sessions/_session" */))
const _7ff11a9e = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
      path: "/quests",
      component: _548a3b85,
      name: "quests"
    }, {
      path: "/sessions",
      component: _20846711,
      name: "sessions"
    }, {
      path: "/quests/:quest",
      component: _4fd18f40,
      name: "quests-quest"
    }, {
      path: "/sessions/:session",
      component: _4ebb0330,
      name: "sessions-session"
    }, {
      path: "/",
      component: _7ff11a9e,
      name: "index"
    }],

  fallback: false
}

export function createRouter() {
  return new Router(routerOptions)
}
