import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Home from '@/pages/home/home'
import City from '@/pages/city/city'
import Msite from '@/pages/msite/msite'
import Search from '@/pages/search/search'
import Food from '@/pages/food/food'
import Shop from '@/pages/shop/shop'
import Order from '@/pages/order/order'
import Profile from '@/pages/profile/profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: App,
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
        },
        //搜索页
        {
          path: '/search/:geohash',
          name: 'Search',
          component: Search
        },
        // 特色商铺列表页
        {
          path: '/food',
          name: 'Food',
          component: Food
        },
        // 商铺详情页
        {
          path: '/shop',
          name: 'Shop',
          component: Shop,
          children: [
            {
              path: 'foodDetail',    //食品详情页
              name: 'FoodDetail',
              component: FoodDetail
            },
            {
              path: 'shopDetail',    //商铺详情页
              name: 'ShopDetail',
              component: ShopDetail,
              children: [
                {
                  path: 'shopSafe',    //商铺安全认证页
                  name: 'ShopSafe',
                  component: ShopSafe,
                }
              ]
            }
          ]
        },
        //
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
        //
        {
          path: '/profile',
          name: 'Profile',
          component: Profile
        },
      ]
    }
    
    
  ]
})
