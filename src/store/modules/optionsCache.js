
const state = {
    data: [],
  }

const mutations = {
    SET_CACHE: (state, object) => {
      state.data.push(object)
    },
  }

const actions = {
    setCatch: ({commit}, object) => {
        commit('SET_CACHE', object)
    },
  }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
