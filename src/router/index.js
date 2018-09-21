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
      path: '/status',
      name: 'status',
      component: require('@/components/Status').default,
    },
    {
      path: '/list',
      name: 'list',
      component: require('@/components/List').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});