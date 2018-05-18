import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
// fastclick可以解决在手机上点击事件的300ms延迟
// import FastClick from 'fastclick'

import Head from '@/components/Head'
import * as helper from '@/helper/utils'
import * as api from '@/service/api'

Vue.components = {
  Head
}
Vue.mixin({
  helper,
  api
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
