import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    UPDATE_USER (state, user) {
      state.user = user
    },
    REMOVE_USER (state) {
      state.user = {}
    }
  },
  actions: {
    updateUser ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get('/user')
        .then((response) => {
          console.log(response.data)
          commit('UPDATE_USER', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          console.log("Test")
          reject(err)
        })
      })
    },
    removeUser ({commit}) {
      commit('REMOVE_USER')
    }
  },
  getters: {
    user: state => state.user
  }
})
