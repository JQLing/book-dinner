// https://www.cnblogs.com/wong-do/p/9059540.html
// https://blog.csdn.net/zjsfdx/article/details/80432793

// import Vue from 'vue'
// import Router from 'vue-router'
import App from '../App'
// import Home from '@/pages/home/home'
// import City from '@/pages/city/city'
// import Msite from '@/pages/msite/msite'
// import Search from '@/pages/search/search'
// import Food from '@/pages/food/food'
// import Shop from '@/pages/shop/shop'
// import Order from '@/pages/order/order'
// import Profile from '@/pages/profile/profile'
// Vue.use(Router)

/**  JS文件按需加载 :(按模块划分 懒加载 )
 * 如果没有这个设置，项目首屏加载时会加载整个网站所有的JS文件，所以将JS文件拆开，点击某个页面时再加载该页面的JS是一个很好的优化方法。 
 * 这里用到的就是vue的组件懒加载。在router.js中，不要使用import的方法引入组件，使用require.ensure
 * eg: 如果写了第二个参数home，就打包到该`JS/home`的文件中,,,如果不写第二个参数，就直接打包在`JS`目录下。
 */
const Home = r => require.ensure([], () => r(require('../pages/home/home')), 'home')
const City = r => require.ensure([], () => r(require('../pages/city/city')), 'city')
const Msite = r => require.ensure([], () => r(require('../pages/msite/msite')), 'msite')
const Search = r => require.ensure([], () => r(require('../pages/search/search')), 'search')
const Food = r => require.ensure([], () => r(require('../pages/food/food')), 'food')
const Shop = r => require.ensure([], () => r(require('../pages/shop/shop')), 'shop')
const Order = r => require.ensure([], () => r(require('../pages/order/order')), 'order')
const Profile = r => require.ensure([], () => r(require('../pages/profile/profile')), 'profile')


export default [
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
          // children: [
            // {
            //   path: 'foodDetail',    //食品详情页
            //   name: 'FoodDetail',
            //   component: FoodDetail
            // },
            // {
            //   path: 'shopDetail',    //商铺详情页
            //   name: 'ShopDetail',
            //   component: ShopDetail,
            //   children: [
            //     {
            //       path: 'shopSafe',    //商铺安全认证页
            //       name: 'ShopSafe',
            //       component: ShopSafe,
            //     }
            //   ]
            // }
          // ]
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
