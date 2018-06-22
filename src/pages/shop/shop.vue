<template lang="pug">
  .page.shop_page
    section
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
        li( @click="changeShowType='food'") 
          span.on(:class="") 商品
        li( @click="changeShowType='rating'") 
          span(:class="") 评价
      main
        // 商品
        section.food_container(v-show="changeShowType =='food'")
          .menu_container
            // 左侧菜单
            section.menu_left(ref="wrapperMenu")
              ul.classifiy
                li(v-for="(item, index) in menuList" @click="chooseMenu(index)" :class="{activity_menu: !index}" :key="index")
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
                    router-link.menu_detail_item(:to="{path: 'shop/foodDetail', query:{image_path: food.image_path, description: food.description, month_sales: food.month_sales, name: food.name, rating: food.rating, rating_count: food.rating_count, satisfy_rate: food.satisfy_rate, food, shopId}}" tag="div")
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
            .cart_icon_num(@click="toggleCartList")
              // 小圆点到达目标位置，执行放大缩小动画（动画结束...)
              p.cart_icon_container(ref="cartContainer" :class="{cart_icon_activity: totalPrice > 0, move_in_cart: receiveInCart}" )
                span(v-if="totalNum") {{totalNum}}
                // img
                span 购物车
              p.cart_num
                span ¥ {{totalPrice}}
                span 配送费 ¥{{deliveryFee}}
            p.gotopay(:class="{gotopay_acitvity: minimumOrderAmount <= 0}")
              span.gotopay_button_style(v-if="minimumOrderAmount > 0") 还差¥{{minimumOrderAmount}}起送
              router-link(v-else :to="{path:'/confirmOrder', query:{geohash, shopId}}") 去结算
          .cart_food_list( v-show="showCartList && cartFoodList.length")
            div
              h4 购物车
              .clearCart(@click="clearCart")
                img
                span.empty 清空
            .cart_food_details
              ul
                li(v-for="(item, index) in cartFoodList" :key="index")
                  .cart_list_num
                    p.ellipsis {{item.name}}
                    p.ellipsis {{item.specs}}
                  .cart_list_price
                    span ￥
                    span {{item.price}}
                  .cart_list_control
                    span(@click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)")
                      img
                    span.cart_num {{item.num}}
                    img.cart_add(@click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)")
          .screen_cover(v-show="showCartList && cartFoodList.length" @click="toggleCartList")
        // 评价
        section.rating_container(v-show="changeShowType =='rating'")
          div(v-load-more="loaderMoreRating" type="2")
    // 规格 弹框
    section
      transition(name="")
        .cover(v-if="showSpecs" @click="showChooseList")
      transition(name="")
        .specs_list(v-if="showSpecs")
          h4.ellipsis {{choosedFoods.name}}
          .specs_details
            h5 {{choosedFoods.specifications[0].name}}
            ul
              li(v-for="(item, i) in choosedFoods.specifications[0].values" @click="chooseSpecs(i)" :class="{specs_activity: i == specsIndex}") {{item}}
          .spec_add
            .spec_price
              span ￥
              span {{choosedFoods.specfoods[specsIndex].price}}
            .spec_addto(@click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)") 加入购物车
    // 减少 规格商品 数量 提示
    transition(name="fade")
      p.show_delete_tip(v-if="showDeleteTip") 多规格商品只能去购物车删除
    // (单个或多个)下落圆点 抛物线运动
    // 通过 appear 特性设置节点在 初始 渲染的过渡
    transition(appear @before-appear="beforeEnter" @after-appear="afterEnter" v-for="(item,index) in showMoveDot" :key="index")
      span.dotNum(v-if="item") 1
    // 加载中 ...
    transition(name="loading")
      loading(v-show="showLoading")

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
// import BScroll from 'better-scroll'


export default {
  name: 'Shop',
  data () {
    return {
      geohash: '', 
      back: require('@/assets/img/icon_back.png'),
      go: require('@/assets/img/icon_more.png'),
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
      totalNum: 0,
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
      windowHeight: null                            //屏幕的高度
    }
  },
  computed: {
    ...mapState([
      'latitude', 'longitude','cartList'
    ])
  },
  mixins: [loadMore, getImgPath],
  components: {
    loading,
    buyCart
  },
  created() {
    this.geohash = this.$route.query.geohash;
    this.shopId = this.$route.query.id;
    this.fetchData();
  },
  mounted () {
    // this.fetchData();
    this.windowHeight = window.innerHeight;
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
      let timer = null;
      clearTimeout(timer);
      timer = setTimeout(() => {
        clearTimeout(timer);
        this.showDeleteTip = false;
      }, 3000);
      // clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      //     clearTimeout(this.timer);
      //     this.showDeleteTip = false;
      // }, 3000);
    },
    //显示下落圆球(初始位置)
    showMoveDotFun (showMoveDot, elLeft, elBottom) {
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot ];
      this.elLeft = elLeft;
      this.elBottom = elBottom;
      console.log('elLeft = ' + this.elLeft)
      console.log('elBottom = ' + this.elBottom)
    },
    // 监听圆点是否进入购物车
    listenInCart () {
      // animationstart - CSS 动画开始后触发
      // animationend 事件在 CSS 动画完成后触发。
    },
    // ------------------------- 子组件事件触发，调用的方法  End
    // 下落圆点  运动
    beforeEnter(el) {
      el.style.transform = `translate3d(0, ${37 + this.elBottom - this.windowHeight}px, 0)`;
      el.children[0].style.opacity = 0;
      el.children[0].style.transform = `translate3d(${this.elLeft -30}px, 0, 0)`;
    },
    afterEnter(el) {
      el.style.transform = `translate3d(0, 0, 0)`;
      el.children[0].style.opacity = 1;
      el.children[0].style.transform = `translate3d(0, 0, 0)`;

      el.style.transition ='transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
      el.children[0].style.transition = 'transform .55s linear';
      // map不会改变原始数组,返回一个新数组
      this.showMoveDot = this.showMoveDot.map( item => false);

      el.children[0].addEventListener('transitionend', () => {
        this.listenInCart();
      });
      el.children[0].addEventListener('webkitAnimationEnd', () => {
        this.listenInCart();
      });
    },
    /**
    * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
    */
    initCategoryNum(){

    },
    // 清空购物车
    clearCart () {},
    removeOutCart (category_id, item_id, food_id, name, price, specs) {},
    addToCart (category_id, item_id, food_id, name, price, specs) {},
    toggleCartList () {},
    loaderMoreRating () {},
    // changeShowType(type) {

    // },
    chooseMenu (index) {},
    showTitleDetail (index) {},
    
  }
}
</script>


