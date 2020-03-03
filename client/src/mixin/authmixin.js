import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
export default {
  computed: {
    ...mapGetters(['getUsers', 'getErrors']),
    auth() {
      return !!this.getUsers;
    },
    getUserName() {
      return this.getUsers;
    },
    confirmed() {
      return !!this.getUsers.emailConfirmDate;
    }
  },
  methods: {
    ...mapActions(['logout']),
    setAuth(payload) {
      localStorage.setItem('auth', JSON.stringify(payload));
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${payload.token}`;
      this.$router.push('/');
    },

    unsetAuth() {
      localStorage.removeItem('auth');
      this.logout();
      // this.$router.push('/');
    }
  }
};
