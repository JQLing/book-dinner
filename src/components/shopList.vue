<template lang="pug">
  .shop_list
    ul(v-load-more="loaderMore" v-if="shopList.length" type="1")
      .shop_item.clear(v-for="(item, index) in shopList" @click="goShop(item.id)" :key='index')
        img.shop_img(:src="imgBaseUrl + item.image_path")
        .con
          .tit
            h3.ellipsis.shop_tit {{item.name}}
            ul.supports
              li.support(v-for="(i, index) in item.supports" :key="index") {{i.icon_name}}
          section.rating_order
            .rate
              ratingStar(:rating='item.rating')
              span.grade {{item.rating}}
              span.order_num 月售{{item.recent_order_num}}单
            .ensure
              span.delivery_mode(v-if="item.delivery_mode") {{item.delivery_mode.text}}
              span.arrive(v-if="zhunshi(item.supports)") 准时达
          section.delivery
            .fee
              span.order_amount ￥{{item.float_minimum_order_amount}}起送 / 
              span {{item.piecewise_agent_fee.tips}}
            .distance
              span.distance_text {{item.distance}} / 
              span.time {{item.order_lead_time}}
    ul.animation_opactiy(v-else)
      li.list_back_li(v-for="item in 10" :key="item")
        //- img.list_back_svg(:src="../../images/shopback.svg")
    p.empty_data(v-if="touchend") 没有更多了
    aside.toTop(v-if="showBackStatus" @click="backTop")
      img(:src="top")
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
      imgBaseUrl,
      top: require('@/assets/img/top.png')
    }
  },
  /**
   * @param geohash                    来自 msite, food
   * @param restaurantCategoryId，     来自food的 “分类”
   * @param sortByType                来自food的  “排序”
   * @param restaurantCategoryIds     来自food的 “筛选”
   * @param deliveryMode               来自food的 “筛选--”
   * @param supportIds                 来自food的 “筛选--”
   * @param confirmSelect              来自food的 “筛选--确认”（是否被点击）
   */
  props: ['geohash', 'restaurantCategoryId','sortByType', 'restaurantCategoryIds',  'deliveryMode', 'supportIds', 'confirmSelect'],
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mixins: [loadMore],
  components: {
    loading,
		ratingStar
  },
  watch: {
    //监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
    restaurantCategoryIds: function (value) {
      this.listenPropChange();
    },
    //监听父级传来的排序方式
    sortByType: function (value) {
      this.listenPropChange();
    },
    //监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
    confirmSelect: function (value) {
      this.listenPropChange();
    }
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
      // console.log('touchend='+this.touchend)
      // console.log('preventRepeatReuqest='+this.preventRepeatReuqest)
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
      animate(document.documentElement, {scrollTop: '0'}, 400, 'ease-out');
    },
    goShop(id) {
      this.$router.push({
        name: 'Shop',
        query: {
          id: id,
          geohash: this.geohash
        }
      });
    },
    //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange(){
      this.showLoading = true;
      this.offset = 0;
      let r = await shopList(this.latitude, this.longitude, this.offset, '', this.sortByType, this.restaurantCategoryIds, this.deliveryMode, this.supportIds);
			this.showLoading = false;
			//考虑到本地模拟数据是引用类型，所以返回一个新的数组
			this.shopList = [...r];
      console.log('listenPropChange-ing');
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
.shop_list{
  padding: .4rem;
  padding-bottom: 0;
  margin-bottom: 2rem;
  background: #fff;
}
.shop_item{
  display: flex;
  padding: 0.7rem 0.4rem;
  border-bottom: 0.025rem solid #f1f1f1;
}
.shop_img{
  display: block;
  @include wh(2.7rem, 2.7rem);
  margin-right: 0.4rem;
}
.tit, .rating_order, .delivery{
  display: flex;
  justify-content: space-between;
}
.supports{
  display: flex;
  transform: scale(0.8);
}
.shop_tit{
  width: 8.5rem;
  margin-right: 0.5rem;
  @include font(0.65rem, 0.65rem, "PingFangSC-Regular");
  color: #333;
  // line-height: 1rem;
}
.shop_tit::before{
  content: '品牌';
  padding: 0 0.1rem;
  border-radius: 0.1rem;
  margin-right: 0.3rem;
  background: yellow;
  font-size: 0.5rem;
  line-height: .5rem;
  color: #333;
}
.con{
  flex: auto;
}
.support{
  padding: 0 0.04rem;
  border: 0.025rem solid #f1f1f1;
  border-radius: 0.08rem;
  margin-left: 0.05rem;
  transform: scale(0.8);
  @include sc(0.5rem, #999);
}
.rating_order{
  // height: 1rem;
  margin: 0.2rem 0;
}
.rate{
  display: flex;
  justify-content: flex-start;
}
.grade{
  margin: 0 0.2rem;
  @include sc(0.4rem, #ff6000);
}
.order_num{
  @include sc(0.4rem, #666);
  transform: scale(0.8);
}
.ensure{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: -0.4rem;
  transform: scale(0.7);
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
  transform: scale(0.9);
}
.distance{
  font-size: 0.5rem;
  transform: scale(0.9);
}
.distance_text{
  color: #999;
}
.time{
  color: $blue;
}
.toTop{
  position: fixed;
  right: 1rem;
  bottom: 3rem;
  img{
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>