import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入Vuex
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'assets/stylus/index.styl'
/* eslint-disable no-unused-vars */
import vConsole from 'vconsole'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('assets/image/default.png')
})

// Vue.config.productionTip = false

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
