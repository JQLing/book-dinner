import Vue from 'vue'
import VueRouter from 'vue-router'
// fastclick可以解决在手机上点击事件的300ms延迟
// import FastClick from 'fastclick'

import routes from './router'
import store from './store/'

import {routerMode} from './assets/js/env'
import './assets/js/rem'
// 组件
// import App from './App'
import Head from '@/components/Head'
import FootGuide from '@/components/FootGuide'
// 方法
import storage from '@/helper/storage'
import * as filter from '@/filter/filter'

// 注册组件
Vue.component('headTop', Head)
Vue.component('foot', FootGuide)
// 注册混合对象
Vue.mixin({
  created() {
    this.$storage = storage;
    this.$filter = filter;
  }
})

// if('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function(){
//     FastClick.attach(document.body);       // 绑定到body
//   }, false);
// }

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  // https://www.cnblogs.com/sophie_wang/p/7880261.html
  // 当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置(只在 HTML5 history 模式下可用)
  // 第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
  // 这个方法返回滚动位置的对象信息：{ x: number, y: number }
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {x: 0, y: to.meta.savedPosition || 0};
    }
  }
})

new Vue({
  // el: '#app',
  router,
  store
  // components: { App },
  // template: '<App/>'
}).$mount('#app')
