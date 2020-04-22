<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mx-auto mt-5">
        <div class="card">
          <h1 class="card-header text-center">Login</h1>
          <div class="card-body">
            <form @submit.prevent="login">
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
                <text-input
                  type="password"
                  placeholder="Enter your Password"
                  v-model="model.password"
                  :value="model.password"
                  name="password"
                  v-validate="'required|min:8'"
                  :error="errors.first('password')"
                />
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div class="form-group">
                  <button
                    id="submit-login"
                    type="submit"
                    :disabled="loading"
                    class="btn btn-primary"
                  >
                    <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                    {{ loading ? '' : 'Login' }}
                  </button>
                </div>

                <div class="form-group">
                  <router-link to="/forgot-password" class="text-center my-2"
                    >forgot password?</router-link
                  >
                </div>
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
        email: '',
        password: ''
      }
    };
  },
  methods: {
    ...mapActions(['loginUser']),

    login() {
      this.$validator.validate().then(isValid => {
        if (!isValid) {
          return;
        }
        this.toggleLoading();
        this.loginUser(this.model).then(res => {
          this.toggleLoading();
          if (res && res.data.success) {
            this.setAuth(res.data);
            this.$noty.success('Your logged in successfully!');
            this.$router.push('/');
          } else {
            this.$noty.error(this.getErrors);
          }
        });
      });
    }
  }
};
</script>
