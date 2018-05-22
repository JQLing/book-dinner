import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
// fastclick可以解决在手机上点击事件的300ms延迟
// import FastClick from 'fastclick'

import App from './App'
import router from './router'
import store from './store/'
import api from '@/service/api'

import Head from '@/components/Head'
import FootGuide from '@/components/FootGuide'

import storage from '@/helper/storage'
import * as filter from '@/filter/filter'

// 注册组件
Vue.component('head', Head)
Vue.component('foot', FootGuide)
// 注册混合对象
Vue.mixin({
  created() {
    this.$storage = storage;
    this.$filter = filter;
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
