import Vue from 'vue';
import Valdator from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';
import textInput from '@components/textInput.vue';
import VueNoty from 'vuejs-noty';
import 'vuejs-noty/dist/vuejs-noty.css';
import authMixin from './mixin/authmixin';
import axios from 'axios';

Vue.config.productionTip = false;
Vue.use(VueNoty);
Vue.component('text-input', textInput);
Vue.use(Valdator);
Vue.mixin(authMixin);

Vue.prototype.$http = axios;
const token = JSON.parse(localStorage.getItem('auth')) || '';
Vue.prototype.$http.defaults.headers.common[
  'Authorization'
] = `Bearer ${token.token}`;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
