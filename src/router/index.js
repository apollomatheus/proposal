import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({  
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default,
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/dashboard/Home').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});