<template>
  <div>
    <div
      class="h-12 text-center text-primary bg-white p-2"
      v-if="auth && !confirmed"
    >
      Please Confirm Your Email Didn't Recieve an Email?
      <a
        href="#"
        @click.prevent="resendEmail"
        class="cursor-pointer border-bottom-3 ml-3"
        >{{ loading ? 'sending mail...' : 'Click Here to Resend Email' }}</a
      >
    </div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" exact class="navbar-brand">MEVN</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link to="/" exact class="nav-link">Home</router-link>
          </li>
          <li id="register-button" class="nav-item" v-if="!auth">
            <router-link to="/register" exact class="nav-link"
              >Register</router-link
            >
          </li>
          <li id="login-button" class="nav-item" v-if="!auth">
            <router-link to="/login" exact class="nav-link">Login</router-link>
          </li>
          <li class="nav-item ml-3" v-if="auth">
            <a id="logout" class="nav-link" href="#" @click.prevent="unsetAuth"
              >Logout</a
            >
          </li>

          <li class="d-flex align-items-center mt-1 ml-5" v-if="auth">
            <i class="fas fa-2x fa-user-circle nav-link"></i>
            <span id="name">{{ getUserName.name }}</span>
          </li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import formmixin from './mixin/formmixin';
export default {
  computed: mapGetters(['getErrors']),
  mixins: [formmixin],
  methods: {
    ...mapActions(['emailResend']),
    resendEmail() {
      this.toggleLoading();
      this.emailResend().then(res => {
        this.toggleLoading();
        if (res && res.data.success) {
          this.$noty.success('Your email has been sent');
        } else {
          this.toggleLoading();
          this.$noty.error(this.getErrors);
        }
      });
    }
  }
};
</script>

<style scoped>
a {
  font-size: 18px;
}
</style>
