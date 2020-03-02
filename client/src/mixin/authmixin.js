import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters(['getUsers']),
    auth() {
      return !!this.getUsers;
    },
    getUserName() {
      return this.getUsers;
    }
  },
  methods: {
    ...mapActions(['logout']),
    setAuth(payload) {
      localStorage.setItem('auth', JSON.stringify(payload));

      this.$router.push('/');
    },

    unsetAuth() {
      localStorage.removeItem('auth');
      this.logout();
      // this.$router.push('/');
    }
  }
};
