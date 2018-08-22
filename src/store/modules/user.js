import {HOST} from '../../utils/config'
import axios from 'axios'
import {loginByUsername} from '../../api/login'
const user = {
  state: {
    user: '',
    id: localStorage.id,
    status: localStorage.status,
    code: '',
    token: localStorage.token,
    name: localStorage.name,
    avatar: '',
    introduction: '',
    roles: [],
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    LoginByUsername ({ commit }, userInfo) {
      console.log('logging in---------------')
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: HOST + '/login/login_alpha',
          data: {"username": username},
        }).then(response => {
          if (response.data.data) {
            const data = response.data.data
            localStorage.token = data.token
            localStorage.name = data.name
            localStorage.id = data.id
            localStorage.status = 'login'
            commit('SET_TOKEN', data.token)
            commit('SET_NAME', data.name)
            commit('SET_ID', data.id)
            commit('SET_STATUS', 'login')
          }
          else {
            console.log(response)
            alert('Wrong username!')
          }
          resolve()
        }).catch(function (err) {
          console.log(err)
          alert('ERROR')
          reject(error)
        });
      })
    }
  }
}

export default user
