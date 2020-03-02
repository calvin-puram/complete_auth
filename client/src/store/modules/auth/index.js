import client from '@utils/axios';
const initState = {
  user: null,
  token: null,
  errors: null
};

const state = JSON.parse(localStorage.getItem('auth')) || initState;

const getters = {
  getErrors: () => state.errors,
  getUsers: () => state.user
};

const actions = {
  //Register
  async registerUser({ commit }, dataa) {
    try {
      const res = await client.post('/register', dataa);
      if (res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.msg);
    }
  },

  //Login
  async loginUser({ commit }, dataa) {
    try {
      const res = await client.post('/login', dataa);
      if (res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.msg);
    }
  },
  // logout
  logout({ commit }) {
    commit('logout_res');
  }
};

const mutations = {
  register_state(state, data) {
    state.user = data.user;
    state.token = data.token;
    state.errors = null;
  },

  error(state, err) {
    state.errors = err;
  },

  logout_res(state) {
    state.token = null;
    state.user = null;
    state.errors = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
