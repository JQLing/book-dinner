<template lang="pug">
  section
    ul
      router-link(:to="{name: Msite, query: {geohash}}" tag="li")
        img(:src="")
        span 外卖
      router-link(:to="{name: Search, parmas: {geohash}}" tag="li")
        img(:src="")
        span 搜索
      router-link(:to="{name: Order}" tag="li")
        img(:src="")
        span 订单
      router-link(:to="{name: Profile}" tag="li")
        img(:src="")
        span 我的 
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'FootGuide',
  data() {
    return {

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
</style>
