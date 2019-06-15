import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessCode: null,
  },
  mutations: {
    setCode(state, code){
      state.accessCode = code;
    }
  },
  actions: {
    setCode(context, code){
      context.commit('setCode', code);
    }
  },
  getters: {
    isLoggedIn: state => (state.accessCode != null)
  }
});