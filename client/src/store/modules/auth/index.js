import client from '@utils/axios';
const initState = {
  user: null,
  token: null,
  errors: null
};

const state = JSON.parse(localStorage.getItem('auth')) || initState;

const getters = {
  getErrors: () => state.errors
};

const actions = {
  async registerUser({ commit }, data) {
    try {
      const res = await client.post('/register', data);
      if (res.data.success) {
        commit('register_state', res.data);
        console.log(res.data.user);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.msg);
      console.log(err.response.data.msg);
    }
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
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
