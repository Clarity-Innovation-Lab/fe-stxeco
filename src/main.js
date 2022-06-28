import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import Notifications from 'vue-notification'
import browserDetect from 'vue-browser-detect-plugin'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/scss/custom.scss'
import VueMarkdown from 'vue-markdown'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Notifications, { closeOnClick: true, duration: 6000 })
Vue.use(browserDetect)
Vue.use(VueMarkdown)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
