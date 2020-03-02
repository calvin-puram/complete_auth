import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@views/Home.vue';
import Login from '@views/Login.vue';
import Register from '@views/Register.vue';
import ForgotPassword from '@views/ForgotPassword.vue';
import ResetPassword from '@views/ResetPassword.vue';
import ConfirmAccount from '@views/ConfirmAccount.vue';

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
  },
  {
    path: '/resetPassword/:token',
    component: ResetPassword
  },
  {
    path: '/emails/confirm/:token',
    component: ConfirmAccount
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
