import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const VueProgressBar = require("vue-progressbar");
const Paginate =  require("vuejs-paginate");

library.add(faPlusSquare, faTimesCircle) 
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('paginate', Paginate)

Vue.config.productionTip = false;


const options = {
  color: '#FFFFFF',
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
  ...App,
  router,
  store,
  render: h => h(App)
}).$mount("#app");