<template lang="pug">
  .page.shop_page
    section.shop_container(v-if="!showLoading")
      // 头部
      header
        router-link.goback(:to="{name: 'Msite'}")
          img.back(:src="back")
        router-link.shopInfo(:to="{name: 'Msite'}" v-if="shopDetailData")
          img.shop_pic(:src="imgBaseUrl + shopDetailData.image_path")
          .info
            h3 {{shopDetailData.name}}
            p 商家配送 / {{shopDetailData.order_lead_time}}分钟送达 / 配送费¥{{shopDetailData.float_delivery_fee}}
            p.ellipsis 公告：{{shopDetailData.promotion_info}}
        router-link.next(:to="{name: 'Msite'}")
          img.gonext(:src="go")
      ul.chooseType(ref="choodeType")
        li
          span(@click="changeShowType='food'" :class="{on: changeShowType =='food'}") 商品
        li
          span(@click="changeShowType='rating'" :class="{on: changeShowType =='rating'}") 评价
      // main
      // 商品
      section.food_container(v-show="changeShowType =='food'")
        .menu_container
          // 左侧菜单
          section.menu_left#wrapper_menu(ref="wrapperMenu")
            ul.classifiy
              li(v-for="(item, index) in menuList" @click="chooseMenu(index)" :class="{activity_menu: index == menuIndex}" :key="index")
                img.menu_icon(v-if="item.icon_url" :src="getImgPath(item.icon_url)")
                span.menu_tit.ellipsis {{item.name}}
                span.category_num(v-if="categoryNum[index] && item.type==1") {{categoryNum[index]}}
          // 右侧菜单
          section.menu_right(ref="menuFoodList")
            ul
              li(v-for="(item,index) in menuList" :key="index")
                h4.menu_detail_tit
                  p.menu_detail_left
                    span.menu_item_title {{item.name}}
                    span.menu_item_description {{item.description}}
                  span.menu_detail_right(@click="showTitleDetail(index)")
                  p.description_tip(v-if="index == TitleDetailIndex") {{item.name}} {{item.description}}
                .menu_detail_list(v-for="(food, foodindex) in item.foods" :key="foodindex")
                  // router-link.menu_detail_item(:to="{path: 'shop/foodDetail', query:{image_path: food.image_path, description: food.description, month_sales: food.month_sales, name: food.name, rating: food.rating, rating_count: food.rating_count, satisfy_rate: food.satisfy_rate, food, shopId}}" tag="div")
                  .menu_detail_item
                    img.food_icon(:src="imgBaseUrl + food.image_path")
                    .menu_food_description
                      h3
                        strong.food_tit {{food.name}}
                        ul.attributes_ul(v-if="food.attributes.length")
                          li(v-for="(attribute, foodindex) in food.attributes" :class="{attribute_new: attribute.icon_name == '新'}" :style="{color: '#'+attribute.icon_color, borderColor: '#'+attribute.icon_color}" :key="foodindex" )
                      p.food_description_content {{food.description}}
                      p.food_description_sale_rating
                        span.month_sales 月售{{food.month_sales}}份
                        span 好评率{{food.satisfy_rate}}%
                      p.food_activity(v-if="food.activity")
                        span(:style="{color: '#'+food.activity.image_text_color, borderColor: '#'+food.activity.icon_color}") {{food.activity.image_text}}
                      .menu_detail_footer
                        .food_price
                          span.price_icon ¥
                          span.price_num {{food.specfoods[0].price}}
                          span(v-if="food.specifications.length") 起
                        // 点解 " + 或 规格" 加入购物车
                        buy-cart(:shopId='shopId' :food='food' @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun" @moveInCart="listenInCart")
        // 底部 购物车
        .buy_cart_container
          .cart_icon_num
            // 小圆点到达目标位置，购物车放大缩小动画（动画结束...)
            p.cart_icon_container(ref="cartContainer" :class="{cart_icon_activity: totalPrice > 0, move_in_cart: receiveInCart}" )
              span.totalNum(v-if="totalNum") {{totalNum}}
              img.icon_cart(:src="cart" @click="toggleCartList")
              // span 购物车
            .cart_num
              p.sum ¥ {{totalPrice}}
              p.deliMoney 配送费 ¥{{deliveryFee}}
          .gotopay(:class="{gotopay_acitvity: minimumOrderAmount <= 0}")
            p.gotopay_btn_dis(v-if="minimumOrderAmount > 0") 还差¥{{minimumOrderAmount}}起送
            router-link.gotopay_btn_en(v-else :to="{path:'/confirmOrder', query:{geohash, shopId}}") 去结算
        // 购物车 弹框
        .cart_food_list(v-show="showCartList && cartFoodList.length")
          .cart_list_tit
            h4.cart_text 购物车
            .clearCart(@click="clearCart")
              img
              span.empty 清空
          .cart_food_details
            ul
              li(v-for="(item, index) in cartFoodList" :key="index")
                .cart_list_num
                  span.ellipsis {{item.name}}
                  span.ellipsis {{item.specs}}
                .cart_list_price
                  span ￥
                  span {{item.price}}
                .cart_list_control
                  span.reduce_btn(@click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)") -
                  span.num_now {{item.num}}
                  span.add_btn(@click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)") +
        .screen_cover(v-show="showCartList && cartFoodList.length" @click="toggleCartList")
      // 评价
      section.rating_container#ratingContainer(v-show="changeShowType =='rating'")
        div(v-load-more="loaderMoreRating" type="2")
          section
            .rating_head
              .rate_scroe
                p.scroe_num {{shopDetailData.rating}}
                p.rate_all 综合评价
                p.rate_over 高于周边商家 {{(ratingScoresData.compare_rating * 100).toFixed(1)}}%
              .rate_star
                p
                  span.tit 服务态度
                  rating-star.star_num(:rating='ratingScoresData.service_score')
                  span.rating_num {{parseFloat(ratingScoresData.service_score).toFixed(1)}}
                p
                  span.tit 菜品评价
                  rating-star.star_num(:rating='ratingScoresData.food_score')
                  span.rating_num {{parseFloat(ratingScoresData.food_score).toFixed(1)}}
                p
                  span.tit 送达时间
                  span.delivery_time {{shopDetailData.order_lead_time}}分钟
            ul.tag_list
              li(v-for="(item, index) in ratingTagsList" @click="changeTagIndex(index, item.name)" :class="{tagActivity: ratingTageIndex == index, unsatisfied: item.unsatisfied}" :key="index") {{item.name}} {{item.count}}
            ul.rating_list
              li(v-for="(item, index) in ratingList" :key="index")
                img.user_avatar(:src="getImgPath(item.avatar)")
                .rating_list_detail
                  .username_info
                    .username_star
                      p.username {{item.username}}
                      p.star_desc
                        rating-star.star_container(:rating='item.rating_star')
                        span.time_spent_desc {{item.time_spent_desc}}
                    // <time datetime="2008-02-14">情人节</time> 
                    // datetime定义元素的日期和时间。如果未定义该属性，则必须在元素的内容中规定日期或时间。
                    time.rated_at {{item.rated_at}}
                  ul.food_img_list
                    li(v-for="(item, index) in item.item_ratings" :key="index")
                      img(v-if="item.image_hash" :src="getImgPath(item.image_hash)")
                  ul.food_name_list
                    li.ellipsis(v-for="(item, index) in item.item_ratings" :key="index") {{item.food_name}}
                
    // 规格 弹框
    section.spec_pop
      transition(name="")
        .cover(v-if="showSpecs" @click="showChooseList")
      transition(name="")
        .specs_list(v-if="showSpecs")
          h4.spec_name.ellipsis {{choosedFoods.name}}
          span.close(@click="showChooseList") x
          .specs_details
            h5.tit {{choosedFoods.specifications[0].name}}
            ul.spec_box
              li(v-for="(item, i) in choosedFoods.specifications[0].values" @click="chooseSpecs(i)" :class="{specs_activity: i == specsIndex}") {{item}}
          .spec_add
            .spec_price
              span ￥
              span {{choosedFoods.specfoods[specsIndex].price}}
            .spec_addto(@click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)") 加入购物车
    // 减少 规格商品 数量 提示
    transition()
      p.show_delete_tip(v-if="showDeleteTip") 多规格商品只能去购物车删除
    // (单个或多个)下落圆点 抛物线运动
    // 通过 appear 特性设置节点在 初始 渲染的过渡
    transition(appear @before-appear="beforeEnter" @after-appear="afterEnter" v-for="(item,index) in showMoveDot" :key="index")
      .run
        span.dotNum(v-if="item") 1
    // 加载中 ...
    transition(name="loading")
      loading(v-show="showLoading || loadRatings")

</template>
<style lang="scss" src="./shop.scss" scoped></style>

<script>
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl} from '@/assets/js/env'
import {loadMore, getImgPath} from '@/components/mixin'
// 组件
import ratingStar from '@/components/ratingStar'
import loading from '@/components/loading'
import buyCart from '@/components/buyCart'
import {msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from '@/service/api'
import BScroll from 'better-scroll'

export default {
  name: 'Shop',
  data () {
    return {
      geohash: '', 
      back: require('@/assets/img/icon_back.png'),
      go: require('@/assets/img/icon_more.png'),
      cart: require('@/assets/img/cart_icon.jpg'),
      imgBaseUrl,
      showLoading: true,
      shopDetailData: null,               //商铺详情
      menuList: [],                       //食品列表     
      ratingList: null,                   //评价列表 
      ratingScoresData: null,             //评价总体分数
      ratingTagsList: null,                //评价分类列表
      shopId: '',
      ratingOffset: 0,                       //评价获取数据offset值
      changeShowType: 'food',                //切换显示商品或者评价
      categoryNum: [],                        //左侧菜单分类-右上角已加入购物车的数量
      TitleDetailIndex: null,                 //右侧菜单详情-展示列表头部
      totalPrice: 0,                          //总共价格
      receiveInCart: false,                  //购物车组件下落的圆点是否到达目标位置
      cartFoodList: [],                       //购物车-商品列表
      showCartList: false,                    //是否显示购物车列表
      showDeleteTip: false,                     //是否显示 不能减少 的提示
      showSpecs: false,                          // 是否显示 规格的弹框
      choosedFoods: {},                            // 选中的 食物
      specsIndex: 0,                               // 选中规格的 索引值
      showMoveDot: [],                            // 控制下落的小圆点显示隐藏
      elLeft: 0,                               //当前点击'+'按钮 在网页中的绝对top值
      elBottom: 0,                             //当前点击'+'按钮在网页中的绝对left值
      windowHeight: null,                            //屏幕的高度
      shopListTop: [],                       //食品列表的高度集合
      foodScroll: null,                      //食品列表scroll
      menuIndex: 0,                          //已选菜单索引值，默认为0
      menuIndexChange: true,                 //解决选中index时，scroll监听事件重复判断设置index的bug
      ratingTageIndex: 0,                       // 评价分类索引
      ratingTagName: '',                         //评论的类型
      ratingScroll: null,                      //评论页Scroll
      preventRepeatRequest: false,
      loadRatings: false
    }
  },
  mixins: [loadMore, getImgPath],
  components: {
    loading,
    buyCart,
    ratingStar
  },
  computed: {
    ...mapState([
      'latitude', 'longitude', 'cartList'
    ]),
    //当前商店购物信息(商铺切换，shopId变化)
    shopCart: function() {
      return {...this.cartList[this.shopId]};
    },
    //配送费
    deliveryFee: function () {
      if(this.shopDetailData) {
        return this.shopDetailData.float_delivery_fee;
      } else {
        return null;
      }
    },
    //还差多少元起送，为负数时显示去结算按钮
    minimumOrderAmount: function () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_minimum_order_amount - this.totalPrice;
      } else {
        return null;
      } 
    },
    //购物车中总共商品的数量
    totalNum: function () {
      let num = 0;
      // (购物车-商品列表)
      this.cartFoodList.forEach(item => {
        num += item.num;
      });
      return num;
    }
  },
  created() {
    this.geohash = this.$route.query.geohash;
    this.shopId = this.$route.query.id;
    this.INIT_BUYCART();
  },
  mounted () {
    this.fetchData();
    this.windowHeight = window.innerHeight;
  },
  // beforeDestroy(){
  //   // this.foodScroll.removeEventListener('scroll', )
  // },
  watch: {
    //showLoading变化时说明组件已经获取初始化数据，在下一帧 nextTick进行后续操作
    showLoading: function(value) {
      if(!value) {
        // Vue.nextTick 的原理和用途: https://segmentfault.com/a/1190000012861862
        // 在 created 和 mounted 阶段，如果需要操作渲染后的视图，也要使用 nextTick 方法。
        this.$nextTick(() => {
          this.getFoodListHeight();
          this.initCategoryNum();
        });
      }
    },
    shopCart: function(value) {
      this.initCategoryNum();
    },
    //购物车列表发生变化，没有商品时，隐藏列表
    cartFoodList: function (value){
      if(!value.length){
        this.showCartList = false;
      }
    },
    //商品、评论切换状态
    changeShowType: function(type) {
      if(type == 'rating') {
        this.$nextTick(() => {
          this.ratingScroll = new BScroll('#ratingContainer', {
            probeType: 3,
            deceleration: 0.003,
            bounce: false,
            swipeTime: 2000,
            click: true
          });
          // 鼠标滚轮滑动 和  点击鼠标左键滑动 不一样
          this.ratingScroll.on('scroll', (pos) => {
          // scroll 纵向滚动的位置区间是 0 - maxScrollY，并且 maxScrollY 是负值
            if(Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
              this.loaderMoreRating();
              // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
              this.ratingScroll.refresh();
              
            }
          });
        }); 
      }
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS', 'ADD_CART', 'REDUCE_CART', 'INIT_BUYCART', 'CLEAR_CART', 'RECORD_SHOPDETAIL'
    ]),
    async fetchData() {
      if (!this.latitude) {
        //获取位置信息
        let r = await msiteAddress(this.geohash);
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(r);
      }
      //获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude);
      //获取商铺食品列表
      this.menuList = await foodMenu(this.shopId);
      //评论列表
      this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
      //商铺评论详情
      this.ratingScoresData = await ratingScores(this.shopId);
      //评论Tag列表
      this.ratingTagsList = await ratingTags(this.shopId);

      this.RECORD_SHOPDETAIL(this.shopDetailData);
      this.showLoading = false;        // 加载动画结束
    },
    //多规格商品加入购物车
    addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
      this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
      this.showChooseList();
    },
    //记录当前所选规格的索引值
    chooseSpecs(index){
      this.specsIndex = index;
    },
    // ------------------ 子组件事件触发，调用的方法
    //显示规格列表
    showChooseList (food) {
      if(food) {
        this.choosedFoods = food;
      }
      this.showSpecs = !this.showSpecs;
      this.specsIndex = 0;
    },
    // 点击‘规格’ 左侧的 ‘-’，弹出提示: 多规格商品只能去购物车删除
    showReduceTip () {
      this.showDeleteTip = true;
      // let timer = null;
      // clearTimeout(timer);
      // timer = setTimeout(() => {
      //   clearTimeout(timer);
      //   this.showDeleteTip = false;
      // }, 3000);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.showDeleteTip = false;
      }, 3000);
    },
    //显示下落圆球(初始位置)
    showMoveDotFun (showMoveDot, elLeft, elBottom) {
      console.log('this.showMoveDot :'+this.showMoveDot);
      console.log('showMoveDot :'+showMoveDot)
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
      console.log('this.showMoveDot2 :'+this.showMoveDot);
      this.elLeft = elLeft;
      this.elBottom = elBottom;
    },
    // 监听圆点是否进入购物车
    listenInCart () {
      // animationstart - CSS 动画开始后触发
      // animationend 事件在 CSS 动画完成后触发。
      if(!this.receiveInCart) {
        this.receiveInCart = true;
        console.log('购物车运动ing')
        this.$refs.cartContainer.addEventListener('animationend', () => {
          console.log('购物车运动ed')
          this.receiveInCart = false;
        });
        this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
          this.receiveInCart = false;
        });
      }
    },
    // ------------------------- 子组件事件触发，调用的方法  End

    // 下落圆点  运动
    beforeEnter(el) {
      el.style.transform = `translate3d(0, ${37 + this.elBottom - this.windowHeight}px, 0)`;
      el.children[0].style.transform = `translate3d(${this.elLeft -30}px, 0, 0)`;
      el.children[0].style.opacity = 0;
      // console.log('beforeEnter: el.children[0]' + el.children[0]);
    },
    afterEnter(el) {
      console.log('afterEnter: el.children[0]' + el.children[0]);
      el.style.transform = `translate3d(0, 0, 0)`;
      el.children[0].style.transform = `translate3d(0, 0, 0)`;
      el.children[0].style.opacity = 1;
      
      el.style.transition ='transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
      el.children[0].style.transition = 'transform .55s linear';

      console.log('小圆点到达了，重新清空');
      // map不会改变原始数组,返回一个新数组
      // this.showMoveDot = this.showMoveDot.map( item => false);
      this.showMoveDot = [];
      // 连续多次点击+，直到最后一个小圆点进入购物车，  transitionend 运动结束
      el.children[0].addEventListener('transitionend', () => {
        console.log('小圆点运动结束, 购物车即将运动');
        this.listenInCart();
      });
      el.children[0].addEventListener('webkitAnimationEnd', () => {
        this.listenInCart();
      });
    },
    /**
     * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
     * 购物车商品 总数量
     * 购物车  总价格
     * 购物车 列表
     */
    initCategoryNum (){
      this.cartFoodList = [];
      let cartFoodIndex = 0;
      this.totalPrice = 0;
      let arr = [];
      // shopCart.category_id.item_id.food_id.
      //依次检验菜单（menuList）中的分类  是否存在于 购物车（shopCart）
      this.menuList.forEach((item, index) => {
        // 购物车中是否有该分类（热销榜），没有查询下一个分类（优惠）
        if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
          let num = 0;         // 每个分类中的数量
          Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
            Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
              let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
              num += foodItem.num;
              if(item.type == 1) {
                this.totalPrice += foodItem.num * foodItem.price;        // 总价格
                if(foodItem.num > 0) {           //列表
                  this.cartFoodList[cartFoodIndex] = {};
                  this.cartFoodList[cartFoodIndex].category_id = item.foods[0].category_id;
                  this.cartFoodList[cartFoodIndex].item_id = itemid;
                  this.cartFoodList[cartFoodIndex].food_id = foodid;
                  this.cartFoodList[cartFoodIndex].num = foodItem.num;
                  this.cartFoodList[cartFoodIndex].price = foodItem.price;
                  this.cartFoodList[cartFoodIndex].name = foodItem.name;
                  this.cartFoodList[cartFoodIndex].specs = foodItem.specs;
                  cartFoodIndex ++;
                }
              }
            })
          })
          arr[index] = num;             // 每个分类中的数量
        } else {    
          arr[index] = 0;
        }
      });
      this.categoryNum = [...arr];
      this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    },
    //加入购物车，所需7个参数: 商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart (category_id, item_id, food_id, name, price, specs) {
      this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
    },
    //移出购物车
    removeOutCart (category_id, item_id, food_id, name, price, specs) {
      this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
    },
    // 清空购物车
    clearCart () {
      this.toggleCartList();
      this.CLEAR_CART(this.shopId);
    },
    //控制购物列表是否显示
    toggleCartList () {
      this.cartFoodList.length ? this.showCartList = !this.showCartList : false;
    },
    /**  BetterScroll滚动   https://ustbhuangyi.github.io/better-scroll/#/
     * 普通滚动列表：左侧菜单                https://juejin.im/post/59b777015188257e764c716f
     * 索引列表： 左侧菜单 结合 右侧列表       https://juejin.im/post/59b777015188257e764c716f
     */
     //获取食品列表的高度，存入shopListTop
    getFoodListHeight () {
      const list = this.$refs.menuFoodList;
      // Array.from() 方法从一个类似数组或可迭代对象中创建一个新的数组实例
      const arr = Array.from(list.children[0].children);
      arr.forEach((item, index) => {
        // offsetTop只读属性，它返回当前元素相对于其 offsetParent 元素的顶部的距离
        this.shopListTop[index] = item.offsetTop;
      });
      this.listenScroll(list);
    },
    //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
    listenScroll (el) {
      // 左侧菜单的总高度
      const menuHeight = this.$refs.wrapperMenu.clientHeight;
      // 普通滚动列表
      const menuScroll = new BScroll('#wrapper_menu', {
        click: true    // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
      });
      // 索引列表
      this.foodScroll = new BScroll(el, {
        // 索引列表，首先需要在滚动过程中实时监听滚动到哪个索引的区域了，来更新当前索引。在这种场景下，我们可以使用probeType选项，
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
        probeType: 3,
        deceleration: 0.001,                     // 表示 momentum 动画的减速度
        bounce: false,                           // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
        swipeTime: 2000,                         // 设置 momentum 动画的动画时长     
        click: true     
      });
      this.foodScroll.on('scroll', (pos) => {
        if(!this.$refs.wrapperMenu) {return ;}
        // 右侧列表滑动到某个地方，左侧菜单设置对应菜单样式，并滑动到对应菜单处
        this.shopListTop.forEach((item, index) => {
          if(Math.abs(Math.round(pos.y)) >= item && this.menuIndexChange) {
            this.menuIndex = index;
            const activEl = this.$refs.wrapperMenu.querySelectorAll('.activity_menu')[0];
            // 滚动到指定的目标元素 (滚动到的目标元素,滚动动画执行的时长（单位 ms）,相对于目标元素的横轴偏移量,相对于目标元素的纵轴偏移量)
            menuScroll.scrollToElement(activEl, 800, 0, -(menuHeight/2 -50));                      
          }
        });
      });
    },
    //点击左侧菜单，右侧相应列表移动到最顶层
    chooseMenu(index){
      this.menuIndex = index;
      //menuIndexChange解决运动时listenScroll依然监听的bug
      this.menuIndexChange = false;
      // 滚动到指定的位置
      this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
      this.foodScroll.on('scrollEnd', () => {
        this.menuIndexChange = true;
      });
    },
    //获取不同类型的评论列表
    async changeTagIndex(index, name){
      this.ratingTageIndex = index;
      this.ratingTagName = name;
      this.ratingOffset = 0;
      let r = await getRatingList(this.shopId, this.ratingOffset, name);
      this.ratingList = [...r];
      this.$nextTick(() => {
        this.ratingScroll.refresh();
      });
    },
    //加载更多评论
    async loaderMoreRating () {
      if(this.preventRepeatRequest) { return ;}
      this.loadRatings = true;
      this.preventRepeatRequest = true;
      this.ratingOffset += 10;
      let r = await getRatingList(this.shopId, this.ratingOffset, this.ratingTagName);
      this.ratingList = [...this.ratingList, ...r];
      this.loadRatings = false;
      if(r.length >= 10) {
        this.preventRepeatRequest = false;
      }
    },
    showTitleDetail (index) {
      if(this.TitleDetailIndex == index ) {
        this.TitleDetailIndex = null;
      } else {
        this.TitleDetailIndex = index;
      }
    },
    goback(){
      this.$router.go(-1);
    }
  }
}
</script>


