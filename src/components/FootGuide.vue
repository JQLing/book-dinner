<template lang="pug">
  footer
    ul.menu
      router-link(:to="{name: 'Msite', query: {geohash}}" tag="li")
        img(:src="order")
        p 外卖
      router-link(:to="{name: 'Search', parmas: {geohash}}" tag="li")
        img(:src="order")
        p 搜索
      router-link(:to="{name: 'Order'}" tag="li")
        img(:src="order")
        p 订单
      router-link(:to="{name: 'Profile'}" tag="li")
        img(:src="order")
        p 我的 
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'FootGuide',
  data() {
    return {
      order: require('@/assets/img/icon_avatar.png')
    }
  },
  computed: {
    ...mapState([
      'geohash'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import '../assets/css/mixin';
footer{
  position: fixed;
  left: 0;
  bottom: 0;
  @include wh(100%, 2.5rem);
  border-top: 2px solid $bc;
  @include sc(0.45rem, #666);
  background: #fff;
}
.menu li{
  float: left;
  width: 25%;
  text-align: center;
}
.menu img{
  @include wh(.8rem, .8rem);
  margin-top: .3rem;
}
</style>
