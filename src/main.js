import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
// fastclick可以解决在手机上点击事件的300ms延迟
// import FastClick from 'fastclick'

import Head from '@/components/Head'
Vue.components = {
  Head
}
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
