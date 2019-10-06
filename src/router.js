import Vue from 'vue';
import Router from 'vue-router';
import NotFound from './views/NotFound.vue';
import Home from './components/Reserve.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/roomtypes',
      name: 'roomtypes',
      component: () => import('./components/RoomType.vue')
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('./components/Room.vue')
    },
    // {
    //   path: '/guests',
    //   name: 'guests',
    //   component: () => import('./components/RoomType.vue')
    // },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('./components/Reservations.vue')
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
});
