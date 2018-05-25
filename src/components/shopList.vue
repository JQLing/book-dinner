<template lang="pug">
  .shop_list
    ul(v-load-more="loaderMore" v-if="shopList.length" type="1")
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
import {loadMore} from './mixin'
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
  props: ['restaurantCategoryId', 'restaurantCategoryIds', 'sortByType', 'deliveryMode', 'supportIds', 'confirmSelect', 'geohash'],
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mixin: {
    loadMore
  },
  components: {
    loading,
		ratingStar
  },
  watch: {
    restaurantCategoryIds: this.listenPropChange,
    //监听父级传来的排序方式
    sortByType: this.listenPropChange,
    //监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
    confirmSelect: this.listenPropChange
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
      if(this.touchend) {
        return
      }
      //（请求中）防止重复请求
      if(this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true;
      // 请求中
      this.preventRepeatReuqest = true;
      //数据的定位:加20位
      this.offset += 20;
      let r = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
      this.showLoading = false;
      this.shopList = [...this.shopList, ...r];
      //当获取数据小于20，说明没有更多数据，不需要再次请求数据
      if(r.length < 20) {
        this.touchend = true;
        return
      }
      // 请求结束，可以再次请求
      this.preventRepeatReuqest = false;
    },
    //返回顶部
    backTop() {
      animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
    },
    //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange(){
      this.showLoading = true;
      this.offset = 0;
      let r = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds);
			this.showLoading = false;
			//考虑到本地模拟数据是引用类型，所以返回一个新的数组
			this.shopList = [...r];
    }
  }
}
</script>


