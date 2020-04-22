import axios from 'axios';
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
      const res = await axios.post(
        'http://localhost:3200/api/v1/auth/register',
        dataa
      );
      if (res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  },

  //Login
  async loginUser({ commit }, dataa) {
    try {
      const res = await axios.post(
        'http://localhost:3200/api/v1/auth/login',
        dataa
      );
      if (res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  },
  // logout
  logout({ commit }) {
    commit('logout_res');
  },

  //password forgot
  async passwordForgot({ commit }, dataa) {
    try {
      const res = await axios.post(
        'http://localhost:3200/api/v1/auth/password/forgot',
        dataa
      );
      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  },

  //reset password
  async passwordReset({ commit }, dataa) {
    try {
      const res = await axios.patch(
        'http://localhost:3200/api/v1/auth/password/reset',
        dataa
      );
      if (res && res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  },

  //confirm account
  async confirmAccount({ commit }, dataa) {
    try {
      const res = await axios.patch(
        'http://localhost:3200/api/v1/auth/email/confirm',
        dataa
      );
      if (res && res.data.success) {
        commit('register_state', res.data);
      }
      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  },

  // resend email {
  async emailResend({ commit }) {
    try {
      const res = await axios.post(
        'http://localhost:3200/api/v1/auth/email/resend'
      );

      return res;
    } catch (err) {
      commit('error', err.response.data.error);
    }
  }
};

const mutations = {
  register_state(state, data) {
    state.user = data.user;
    state.token = data.token;
    state.errors = '';
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
