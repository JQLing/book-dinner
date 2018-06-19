// https://blog.csdn.net/sinat_17775997/article/details/75270529
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './action'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex);

const state = {
  latitude: '',         // 当前位置纬度
  longitude: '',         // 当前位置经度
  geohash: '31.22299,121.36025', //地址geohash值
  login: true,            //是否登录
	imgPath:null,           //头像地址
  userInfo: null,        //用户信息
  addAddress:'',		     //新增地址
  removeAddress:[],      //移除地址
  cartList: {},          // 加入购物车的商品列表
  shopid: null,          //商铺id
  shopDetail: null,      //商家详情信息
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})