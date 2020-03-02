<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mx-auto mt-5">
        <div class="card">
          <h1 class="card-header text-center">Forgot Password</h1>
          <div class="card-body">
            <form @submit.prevent="forgotPassword">
              <div class="form-group">
                <text-input
                  type="email"
                  placeholder="Enter your Email"
                  v-model="model.email"
                  :value="model.email"
                  name="email"
                  v-validate="'required|email'"
                  :error="errors.first('email')"
                />
              </div>

              <div class="form-group">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary btn-block"
                >
                  <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                  {{ loading ? '' : 'Send Reset Password Link' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import formmixin from '../mixin/formmixin';

export default {
  computed: mapGetters(['getErrors']),
  mixins: [formmixin],
  data() {
    return {
      model: {
        email: ''
      }
    };
  },
  methods: {
    ...mapActions(['passwordForgot']),
    forgotPassword() {
      this.$validator.validate().then(isValid => {
        if (!isValid) {
          return;
        }
        this.toggleLoading();
        this.passwordForgot(this.model).then(res => {
          this.toggleLoading();
          if (res && res.data.success) {
            this.$router.push('/');
            this.$noty.success('Password Reset Link Sent successfully!');
          } else {
            this.$noty.error(this.getErrors);
          }
        });
      });
    }
  }
};
</script>
