import Vue from "vue";
import Vuex from "vuex";
import * as types from "./mutation-types";
import notification from "./modules/notification";
import citizens from "./modules/citizens";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  getters: {
    isLoading: state => state.isLoading
  },
  mutations: {
    [types.IS_LOADING](state, value) {
      state.isLoading = value;
    }
  },
  actions: {},
  modules: {
    notification,
    citizens
  }
});
