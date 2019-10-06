import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/axios';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import Notifications from 'vue-notification';

Vue.use(Notifications);

Vue.config.productionTip = true;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
