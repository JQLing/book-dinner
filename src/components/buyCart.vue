<template lang="pug">
  .addCart
    // 点击 “规格”（- 6 选规格）
    section.choose_spec(v-if="foods.specifications.length")
      span.disable_btn(v-if="" @click="showReduceTip") -
      span.num(v-if="") 6
      span.spec_btn(@click="showChooseList(foods)") 选规格
    // 点击 “+”（- 6 +）
    section.choose_add(v-else)
      span.reduce_btn(v-if="" @click="") -
      span.num(v-if="") 66
      span.add_btn(@click="") +
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
  props: ['shopId', 'foods'],
  computed: {
    ...mapMutations([
      'ADD_CART', 'REDUCE_CART'
    ])
  },
  mounted () {},
  methods: {
    // 点击‘规格’ 左侧的 ‘-’，触发'showReduceTip'事件（父组件，显示 多规格商品只能去购物车删除 弹框）
    showReduceTip() {
      this.$emit('showReduceTip');
    },
    // 点击‘规格’, 触发'showChooseList'事件（父组件，显示 规格弹框） 
    showChooseList(foods) {
      this.$emit('showChooseList');
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
.spec_btn{
  padding: .1rem .2rem;
  border: 0.025rem solid $blue;
  border-radius: 0.2rem;
  @include sc(0.55rem, #fff);
  background-color: $blue;
}
.reduce_btn{
  @include wh(0.9rem, 0.9rem);
  padding: 0.1rem 0.2rem;
  border: 0.025rem solid $blue;
  border-radius: 50%;
  background: #fff;
  @include sc(0.65rem, $blue);
}
.add_btn{
  @include wh(0.9rem, 0.9rem);
  padding: 0.1rem 0.2rem;
  border-radius: 50%;
  background: $blue;
  @include sc(0.65rem, #fff);
}
.num{
  min-width: 1rem;
  margin: 0 0.5rem;
  text-align: center;
  font-family: Helvetica Neue,Tahoma;
  @include sc(0.65rem, #666);
}
</style>

