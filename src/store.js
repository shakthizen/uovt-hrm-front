import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logged: true,
    user: {
      name: 'Shakthi'
    }
  },
  mutations: {},
  actions: {}
});
