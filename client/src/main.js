import Vue from 'vue';
import Valdator from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';
import textInput from '@components/textInput.vue';
import VueNoty from 'vuejs-noty';
import 'vuejs-noty/dist/vuejs-noty.css';
import authMixin from './mixin/authmixin';

Vue.config.productionTip = false;
Vue.use(VueNoty);
Vue.component('text-input', textInput);
Vue.use(Valdator);
Vue.mixin(authMixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
