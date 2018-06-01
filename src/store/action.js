import {
	getUser,
	getAddressList
} from '../service/api'
import {
	GET_USERINFO,
	SAVE_ADDRESS
} from './mutation-types.js'

export default {
  async getUserInfo({commit, state}) {
    let r = await getUser();
    commit(GET_USERINFO, r);
  },
  async saveAddress({commit, state}) {
    let r = await getAddressList(state.userInfo.user_id);
    commit(SAVE_ADDRESS, r);
  }
}

