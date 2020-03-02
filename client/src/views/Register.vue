<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mx-auto mt-5">
        <div class="card">
          <h1 class="card-header text-center">Register</h1>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="form-group">
                <text-input
                  type="text"
                  name="name"
                  placeholder="Enter your Name"
                  v-model="model.name"
                  :value="model.name"
                  v-validate="'required|min:3'"
                  :error="errors.first('name')"
                />
              </div>

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
                  {{ loading ? '' : 'Register' }}
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
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    };
  },
  methods: {
    ...mapActions(['registerUser']),

    register() {
      this.$validator.validate().then(isValid => {
        if (!isValid) {
          return;
        }
        this.toggleLoading();
        this.registerUser(this.model).then(res => {
          this.toggleLoading();
          if (res && res.data.success) {
            this.setAuth(res.data);
            this.$noty.success('Your profile has been saved!');
          } else {
            this.$noty.error(this.getErrors);
          }
        });
      });
    }
  }
};
</script>
