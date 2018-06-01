<template lang="pug">
  .shop_list
    ul(v-load-more="loaderMore" v-if="shopList.length" type="1")
      router-link.clear.shop_item(v-for="(item, index) in shopList" :to="{name:'Shop', query: {geohash, id: item.id}}"  :key='index' tag='li')
        img.fl.shop_img(:src="imgBaseUrl + item.image_path")
        .con.fl
          .tit.clear
            h3.fl.ellipsis.shop_tit {{item.name}}
            ul.fr.clear
              li.fl.support(v-for="(i, index) in item.supports" :key="index") {{i.icon_name}}
          section.clear.rating_order
            .rate.fl
              ratingStar(:rating='item.rating')
              span.grade {{item.rating}}
              span.order_num 月售{{item.recent_order_num}}单
            .delivery.fr.clear
              span.fl.delivery_mode(v-if="item.delivery_mode") {{item.delivery_mode.text}}
              //- span.fl.arrive(v-if="zhunshi(item.supports)") 准时达
              span.fl.arrive 准时达
          section.clear
            .fee.fl.clear
              span.fl.order_amount ￥{{item.float_minimum_order_amount}}起送 / 
              span.fl {{item.piecewise_agent_fee.tips}}
            .distance.fr.clear
              span.fl.distance_text {{item.distance}} /
              span.fl.time {{item.order_lead_time}}
    ul.animation_opactiy(v-else)
      li.list_back_li(v-for="item in 10" :key="item")
        //- img.list_back_svg(:src="../../images/shopback.svg")
    p.empty_data(v-if="touchend") 没有更多了
    aside(v-if="showBackStatus" @click="backTop")
      //- img(:src="")
    .other(ref="abc")
    transition(name="loading")
      loading(v-show="showLoading")
</template>

<script>
import {mapState} from 'vuex'
import {imgBaseUrl} from '@/assets/js/env'
// 指令
import {loadMore} from './mixin'
// 组件
import ratingStar from './ratingStar'
import loading from './loading'
// 方法
import {showBack, animate} from '@/helper/utils'
import {shopList} from '@/service/api'
export default {
  name: 'shopList',
  data () {
    return {
      shopList: [],        // 店铺列表数据
      offset: 0,          //批次加载店铺列表，每次加载20个 limit = 20,
      touchend: false,             //没有更多数据
      showBackStatus: false,      //显示返回顶部按钮
      showLoading: true,         //显示加载动画
      preventRepeatReuqest: false,   //到达底部加载数据，防止重复加载
      imgBaseUrl
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
<style lang="scss" scoped>
@import '../assets/css/mixin';
.shop_list{
  padding: .4rem;
  margin-bottom: 2rem;
  background: #fff;
}
.shop_item{
  padding: 0.7rem 0.4rem;
  border-bottom: 0.025rem solid #f1f1f1;
}
.shop_img{
  display: block;
  @include wh(2.7rem, 2.7rem);
  margin-right: 0.4rem;
  box-sizing: border-box;
}
.con{
  box-sizing: border-box;
}
.tit{
  height: 1rem;
  padding-top: 0.1rem;
}
.shop_tit{
  width: 8.5rem;
  @include font(0.65rem, 0.65rem, "PingFangSC-Regular");
  color: #333;
}
.shop_tit::before{
  content: '品牌';
  margin-right: 0.3rem;
  background: yellow;
  @include wh(1rem, 1rem);
}
.support{
  padding: 0 0.04rem;
  border: 0.025rem solid #f1f1f1;
  border-radius: 0.08rem;
  margin-left: 0.05rem;
  @include sc(0.5rem, #999);
}

.rating_order{
    height: 0.6rem;
    margin-top: 0.52rem;
}
.grade{
  margin: 0 0.2rem;
  @include sc(0.4rem, #ff6000);
}
.order_num{
  @include sc(0.4rem, #666);
}
.delivery_mode{
    padding: 0.04rem 0.08rem 0;
    border: 0.025rem solid $blue;
    border-radius: 0.08rem;
    margin-left: 0.08rem;
    background: $blue;
    @include sc(0.4rem, #fff);
    
}
.arrive{
    padding: 0.04rem 0.08rem 0;
    border: 0.025rem solid $blue;
    border-radius: 0.08rem;
    margin-left: 0.08rem;
    background: #fff;
    @include sc(0.4rem, $blue);
}
.fee{
  @include sc(0.5rem, #666);
}
.distance{
  font-size: 0.5rem;
}
.distance_text{
  color: #999;
}
.time{
  color: $blue;
}
</style>

