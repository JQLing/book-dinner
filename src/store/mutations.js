import {
	GET_USERINFO,
  SAVE_ADDRESS,
  SAVE_GEOHASH,
  RECORD_ADDRESS,
  ADD_CART,
  REDUCE_CART
} from './mutation-types.js'


export default {
  //获取用户信息存入vuex
  [GET_USERINFO](state, info) {
    // console.log('info' + info);
    if(state.userInfo && state.userInfo.username != info.username) {
      return;
    }
    if(!state.login) {
      return;
    }
    if(!info.message) {
      state.userInfo = {...info};
    }else {
      state.userInfo = null;
    }
  },
  //删除地址列表
  [SAVE_ADDRESS](state, newAdress) {
    console.log('newAdress' + newAdress);
    state.removeAddress = newAdress;
  },
  //保存geohash
  [SAVE_GEOHASH](state, geohash) {
    state.geohash = geohash;
  },
  //记录当前经度纬度
  [RECORD_ADDRESS](state, {latitude, longitude}) {
    console.log('latitude'+latitude +'---longitude' +longitude);
    state.latitude = latitude;
    state.longitude = longitude;
  },
  // 加入购物车
  [ADD_CART] () {},
  // 移出购物车
  [REDUCE_CART] () {}
}