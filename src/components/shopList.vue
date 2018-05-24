<template lang="pug">
  .shop_list
    ul(v-if="shopList.length" type="1")
      router-link(v-for="(item, index) in shopList" :to={name:'Shop', {query:geohash, id: item.id}} :key="index" tag="li")
        img.shop_img(:src="imgBaseUrl + item.image_path")
        .con
          .tit
            h3 {{item.name}}
            ul
              li(v-for="(i, index) in item.supports" :key="index") {{i.icon_name}}
          section
            .rate
              ratingStar(:rating='i.rating')
              span.grade {{i.rating}}
              span 月售{{i.recent_order_num}}单
            .delivery
              span(v-if="i.delivery_mode") {{i.delivery_mode.text}}
              span(v-if="zhunshi(item.supports)") 准时达
          section
            .fee
              span ￥{{item.float_minimum_order_amount}}起送 / 
              span {{item.piecewise_agent_fee.tips}}
            .distance
              span {{item.distance}} /
              span.time {{item.order_lead_time}}
    ul.animation_opactiy(v-else)
      li.list_back_li(v-for="item in 10" :key="item")
        img.list_back_svg(:src="../../images/shopback.svg")
    p.empty_data(v-if="touchend") 没有更多了
    aside(v-if="showBackStatus" @click="backTop")
      img(:src="")
    .other(ref="abc")
    transition(name="loading")
      loading(v-show="showLoading")
</template>
<style lang="scss" scoped></style>

<script>
import {mapState} from 'vuex'
import {imgBaseUrl} from '/config/env'
// 指令
// import {loadMore} from './mixin'
// 组件
import ratingStar from './ratingStar'
import loading from './loading'
// 方法
import {showBack, animate} from '@/helper/utils'

export default {
  name: 'shopList',
  data () {
    return {
      shopList: [],        // 店铺列表数据
      offset: 0,          //批次加载店铺列表，每次加载20个 limit = 20,
      touchend: false,             //没有更多数据
      showBackStatus: false,      //显示返回顶部按钮
      showLoading: true,         //显示加载动画
      preventRepeatReuqest: false   //到达底部加载数据，防止重复加载
    }
  },
  props: ['restaurantCategoryId'],
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mixin: {
    
  },
  watch: {

  },
  components: {
    loading,
		ratingStar
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    fetchData() {
      //获取商铺列表
      shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId).then(r => {
        this.shopList = [...r];
        if(r.length < 20) {
          this.touchend = true;
        }
        this.showLoading = false;
        // 开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
        showBack(status => {
          this.showBackStatus = status;
        });

      });
    },
    zhunshi(supports) {
      if((supports instanceof Array) && supports.length) {
 				supports.forEach(item => {
 					if(item.icon_name === '准') {
 						return true;
 					}
 				});
			}else{
				return false;
			}
    },
    //到达底部加载更多数据
    async loaderMore(){

    },
    //返回顶部
    backTop() {
      animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
    },
    //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange(){}
  }
}
</script>


