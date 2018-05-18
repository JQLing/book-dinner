import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/home'
import City from '@/pages/city/city'
import Msite from '@/pages/msite/msite'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: 'APP',
      children: [
        //地址为空时跳转home页面
        {
          path: '',
          redirect: '/home'
        },
        //首页 城市列表页
        {
          path: '/',
          name: 'Home',
          component: Home
        },
        //选择城市页
        {
          path: '/city/:cityId',
          name: 'City',
          component: City
        },
        //所有商铺列表页
        {
          path: '/msite',
          name: 'Msite',
          component: Msite,
          meta: { keepAlive: true }
        }
      ]
    }
    
    
  ]
})
