import {asyncRoutes, constantRoutes} from '@/router'
import Layout from '@/layout'

/**
 * 将后台返回的路由转换成本地路由
 * @param routes
 * @returns {*[]}
 */
export const transformRoute = (routes = []) => {
  return routes.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        router.component = Layout
      } else {
        router.component = loadView(router.component)
      }
    }
    if (router.children && router.children.length) {
      router.children = transformRoute(router.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routes = []) {
    return new Promise(resolve => {
        let accessedRoutes = transformRoute(routes)
        accessedRoutes = accessedRoutes.concat(asyncRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
