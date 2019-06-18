import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueProgressBar from 'vue-progressbar'

Vue.config.productionTip = false;


const options = {
  color: '#1900ff',
  failedColor: '#874b4b',
  thickness: '0.5%',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
