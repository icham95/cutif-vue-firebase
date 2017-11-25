import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    detailUser: []
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getDetailUser (state) {
      return state.detailUser
    }
  },
  mutations: {
    changeUser (state, data) {
      state.user = data
    },
    changeDetailUser (state, data) {
      state.detailUser = data
    }
  }
})
