import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@views/Home.vue';
import Login from '@views/Login.vue';
import Register from '@views/Register.vue';
import ForgotPassword from '@views/ForgotPassword.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
