<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mx-auto mt-5">
        <div class="card">
          <h1 class="card-header text-center">Reset Password</h1>
          <div class="card-body">
            <form @submit.prevent="resetPassword">
              <div class="form-group">
                <text-input
                  type="password"
                  placeholder="Enter your New Password"
                  v-model="model.password"
                  :value="model.password"
                  name="password"
                  v-validate="'required|min:8'"
                  :error="errors.first('password')"
                />
              </div>

              <div class="form-group">
                <text-input
                  type="password"
                  placeholder="Confirm your Password"
                  v-model="model.passwordConfirm"
                  :value="model.passwordConfirm"
                  name="passwordConfirm"
                  v-validate="'required|min: 8'"
                  :error="errors.first('passwordConfirm')"
                />
              </div>

              <div class="form-group">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary"
                >
                  <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                  {{ loading ? '' : 'Reset Password' }}
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
        password: '',
        passwordConfirm: ''
      }
    };
  },
  methods: {
    ...mapActions(['passwordReset']),

    resetPassword() {
      this.$validator.validate().then(isValid => {
        if (!isValid) {
          return;
        }
        this.toggleLoading();
        this.passwordReset({
          ...this.model,
          token: this.$route.params.token
        }).then(res => {
          this.toggleLoading();
          if (res && res.data.success) {
            this.setAuth(res.data);
            this.$noty.success('Your password has been reset successfully!');
          } else {
            this.$noty.error(this.getErrors);
          }
        });
      });
    }
  }
};
</script>
