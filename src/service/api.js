import fetch from './fetch'
import storage from '../helper/storage'
/**
 * 获取用户信息
 */
export const getUser = () => fetch('/v1/user', {user_id: storage.lsGet('user_id')})
/**
 * 获取首页默认地址
 */
export const cityGuess = () => fetch('/v1/cities', {type: 'guess'})
/**
 * 获取首页热门城市
 */
export const hotcity = () => fetch('/v1/cities', {type: 'hot'})
/**
* 获取首页所有城市
*/
export const groupcity = () => fetch('/v1/cities', {type: 'group'})
/**
 * 获取当前所在城市
 */
export const currentcity = number => fetch('/v1/cities/'+ number)
/**
 * 获取搜索地址
 */
export const searchplace = (city_id, keyword) => fetch('/v1/pois', {
  type: 'search',
  city_id: city_id,
  keyword: keyword
})
/**
 * 获取msite页面地址信息
 */
export const  msiteAddress = geohash => fetch('/v2/pois/'+geohash)
/**
 * 获取msite页面 食品分类 列表
 */
export const  msiteFoodTypes = geohash => fetch('/v2/index_entry', {
  geohash,
  group_type: '1',
  'flags[]': 'F'
})
/**
 * 获取msite商铺列表（从 shopList.vue调用）
 */
export const shopList = (latitude, longitude, offset, restaurant_category_id='', order_by='', restaurant_category_ids='', delivery_mode='', support_ids=[]) => {
  let str = '';
  support_ids.forEach(item => {
    if(item.status) {
      str += '&support_ids[]=' + item.id;
    }
  });
  let param = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    order_by,
    'restaurant_category_ids[]': restaurant_category_ids,
    'delivery_mode[]': delivery_mode + str
  };
  return fetch('/shopping/restaurants', param);
}
/**
 * 获取search页面搜索结果
 */


/**
 * 获取food页面的 category 种类列表
 */
export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
	latitude,
	longitude
});
/**
 * 获取food页面的配送方式
 */
export const foodDelivery = (latitude, longitude) => fetch('/shopping/v1/restaurants/delivery_modes', {
	latitude,
	longitude,
	kw: ''
});

/**
 * 获取food页面的商家属性活动列表
 */
export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
	latitude,
	longitude,
	kw: ''
});

/**
 * 获取shop页面商铺详情
 */




/**
*个人中心-编辑地址
*/
export const getAddressList = (user_id) => fetch('/v1/users/'+ user_id +'/addresses')

