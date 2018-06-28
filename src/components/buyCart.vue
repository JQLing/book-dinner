<template lang="pug">
  .addCart
    // 点击 “规格”   （- 6 选规格）
    section.choose_spec(v-if="food.specifications.length")
      transition(name="showReduce")
        span.disable_btn(v-if="foodNum" @click="showReduceTip") -
      transition(name="fade")
        span.num_now(v-if="foodNum") {{foodNum}}
      span.spec_btn(@click="showChooseList(food)") 选规格
    // 点击 “+”      （- 6 +）
    section.choose_add(v-else)
      transition(name="showReduce")
        span.reduce_btn(v-if="foodNum" @click="removeOutCart(food.category_id, food.item_id, food.specfoods[0].food_id, food.specfoods[0].name, food.specfoods[0].price, '', food.specfoods[0].packing_fee, food.specfoods[0].sku_id, food.specfoods[0].stock)") -
      transition(name="fade")
        span.num_now(v-if="foodNum") {{foodNum}}
      span.add_btn(@touchstart="addToCart(food.category_id, food.item_id, food.specfoods[0].food_id, food.specfoods[0].name, food.specfoods[0].price, '', food.specfoods[0].packing_fee, food.specfoods[0].sku_id, food.specfoods[0].stock, $event)") +
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'buyCart',
  data () {
    return {
      showMoveDot: []     //控制下落的小圆点显示隐藏
    }
  },
  props: ['shopId', 'food'],
  computed: {
    ...mapState([
      'cartList'
    ]),
    // 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
    shopCart: function() {
      // Object.assign方法用于对象的合并，将源对象（ source ）的所有可枚举属性，复制到目标对象（ target ）。
      // 如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。
      // Object.assign(obj, undefined) === obj // true  
      return Object.assign({}, this.cartList[this.shopId]);
    },
    foodNum: function() {
      let category_id = this.food.category_id;
      let item_id = this.food.item_id;

      if(this.shopCart && this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
        let num = 0;
        // Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（ enumerable ）属性的键名。
        // Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（ enumerable ）属性的键值。
        // Object.entries方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（ enumerable ）属性的键值对数组。
        Object.values(this.shopCart[category_id][item_id]).forEach((food_id) => {
          num += food_id.num;
        });
          return num;
      } else {
        return 0;
      }
    }
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'ADD_CART', 'REDUCE_CART'
    ]),
    // 点击‘规格’ 左侧的 ‘-’，触发'showReduceTip'事件（父组件，显示 多规格商品只能去购物车删除 弹框）
    showReduceTip() {
      this.$emit('showReduceTip');
    },
    // 点击‘规格’, 触发'showChooseList'事件（父组件，显示 规格弹框） 
    showChooseList(food) {
      this.$emit('showChooseList', food);
    },
    //点击 ‘ + ’ 下落圆球 抛物线运动
    addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event) {
      this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
      this.showMoveDot.push(true);
      
      // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口左上角的位置。
      let elLeft = event.target.getBoundingClientRect().left;
      let elBottom = event.target.getBoundingClientRect().bottom;
      this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
    },
    // 点击 ‘ + ’ 左侧的‘ - ’
    removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
      if(this.foodNum > 0) {
        this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
.showReduce-enter-active, .showReduce-leave-active{
  transition: all .3s;
}
.showReduce-enter, .showReduce-leave-to{
  opacity: 0;
  transform: translateX(1rem);
}
.fade-enter-active, .fade-leave-active{
  transition: all .3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.spec_btn{
  padding: .1rem .2rem;
  border: 0.025rem solid $blue;
  border-radius: 0.2rem;
  @include sc(0.55rem, #fff);
  background-color: $blue;
}
// .reduce_btn{
//   @include wh(0.9rem, 0.9rem);
//   padding: 0.1rem 0.3rem;
//   border: 0.025rem solid $blue;
//   border-radius: 50%;
//   background: #fff;
//   @include sc(0.65rem, $blue);
// }
// .add_btn{
//   @include wh(0.9rem, 0.9rem);
//   padding: 0.1rem 0.3rem;
//   border-radius: 50%;
//   background: $blue;
//   @include sc(0.65rem, #fff);
// }
// .num_now{
//   min-width: 1rem;
//   margin: 0 0.5rem;
//   text-align: center;
//   font-family: Helvetica Neue,Tahoma;
//   @include sc(0.65rem, #666);
// }
</style>

