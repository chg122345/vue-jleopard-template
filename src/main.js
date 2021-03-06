import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import VueElementExtends from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'
import JLeopard from '@/components'

Vue.use(VueElementExtends)
Vue.use(JLeopard)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
