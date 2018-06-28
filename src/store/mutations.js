import storage from '../helper/storage'
import {
	GET_USERINFO,
  SAVE_ADDRESS,
  SAVE_GEOHASH,
  RECORD_ADDRESS,
  RECORD_SHOPDETAIL,
  ADD_CART,
  REDUCE_CART,
  INIT_BUYCART,
  CLEAR_CART
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
  [RECORD_SHOPDETAIL](state, detail) {
    state.shopDetail = detail;
  },
  // 加入购物车
  [ADD_CART](state, {shopid, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock}) {
    let cart = state.cartList;
    // cart.shopid.category_id.item_id.food_id.   (深度：6)
    let shop = cart[shopid] = cart[shopid] || {};
    let category = shop[category_id] = shop[category_id] || {};
    let item = category[item_id] = category[item_id] || {};
    if(item[food_id]) {   // 已存在，数量加1
      item[food_id]['num'] ++;
    } else {  // 不存在，将数据存入
      item[food_id] = {
        "num" : 1,
        "id" : food_id,
        "name" : name,
        "price" : price,
        "specs" : specs,
        "packing_fee" : packing_fee,
        "sku_id" : sku_id,
        "stock" : stock
      };
    }
    state.cartList = {...cart};
    storage.lsSet('cart', state.cartList);
  },
  // 移出购物车
  [REDUCE_CART](state, {shopid, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock}) {
    let cart = state.cartList;
    // cart.shopid.category_id.item_id.food_id.   (深度：6)
    let shop = cart[shopid] = cart[shopid] || {};
    let category = shop[category_id] = shop[category_id] || {};
    let item = category[item_id] = category[item_id] || {};

    if (item && item[food_id]) {
      if(item[food_id]['num'] > 0) {   // 已存在
        item[food_id]['num'] --;
        state.cartList = {...cart};
        storage.lsSet('cart', state.cartList);
      } else {  // 商品数量为0，则清空当前商品的信息
        item[food_id] = null;
      }
    }
  },
  //网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART](state) {
    let cart = storage.lsGet('cart');
    if(cart) {
      state.cartList = JSON.parse(cart);
    }
  },
  //清空当前商铺的购物车信息
  [CLEAR_CART](state, shopid) {
    state.cartList[shopid] = null;
    state.cartList = {...state.cartList};
    storage.lsSet('cart', state.cartList);
  }
}