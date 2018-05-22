import fetch from './fetch'
// import {lsGet} from '../helper/storage'


const Api = {
  /**
   * 获取用户信息
   */
  getUser: () => fetch('/v1/user', {user_id: this.$storage.lsGet('user_id')}),
  /**
   * 获取首页默认地址
   */
  cityGuess: () => fetch('/v1/cities', {type: 'guess'}),
  /**
   * 获取首页热门城市
   */
  hotcity: () => fetch('/v1/cities', {type: 'hot'}),
  /**
  * 获取首页所有城市
  */
  groupcity: () => fetch('/v1/cities', {type: 'group'}),
  /**
   * 获取当前所在城市
   */
  currentcity: number => fetch('/v1/cities/'+ number),
  /**
   * 获取搜索地址
   */
  searchplace: (city_id, keyword) => fetch('/v1/pois', {
    type: 'search',
    city_id: city_id,
    keyword: keyword
  }),
  /**
   * 获取msite页面地址信息
   */
  msiteAddress: geohash => fetch('/v2/pois/'+geohash),
  /**
   * 获取msite页面 食品分类 列表
   */
  msiteFoodTypes: geohash => fetch('/v2/index_entry', {
    geohash,
    group_type: '1',
    'flags[]': 'F'
  }),
  /**
   * 获取msite商铺列表
   */
  // shopList: 
  /**
   * 获取search页面搜索结果
   */
  /**
  *个人中心-编辑地址
  */
 getAddressList: (user_id) => fetch('/v1/users/'+ user_id +'/addresses')
};
export default Api;