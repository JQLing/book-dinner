import {
	GET_USERINFO,
	SAVE_ADDRESS
} from './mutation-types.js'


export default {
  //获取用户信息存入vuex
  [GET_USERINFO](state, info) {
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
    state.removeAddress = newAdress;
  }
}