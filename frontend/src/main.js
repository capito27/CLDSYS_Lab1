import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import axios from 'axios'
import { EventBus } from '@/helpers/EventBus.js'

Vue.config.productionTip = true

// Define Property at global, like an alias
Object.defineProperty(Vue.prototype, '$http', { value: axios })
Object.defineProperty(Vue.prototype, '$events', { value: EventBus })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
