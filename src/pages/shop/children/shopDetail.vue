<template lang="pug">
  .page.shopDetail_page
    head-top(head-title="商家详情" go-back="true")
    .activities
      h2 活动与属性
      ul.act_attribute
        li(v-for="item in shopDetail.activities" :key='item.id')
          span(:style='{background: "#" + item.icon_color}') {{item.icon_name}}
          span {{item.description}}(APP专享)
      ul.act_attribute
        li(v-for="item in shopDetail.supports" :key='item.id')
          span(:style='{background: "#" + item.icon_color}') {{item.icon_name}}
          span {{item.description}}(APP专享)
    .safe
      h2 食品监督安全公示
        router-link(to="/shop/shopDetail/shopSafe") 企业认证详情
          img(:src="go")
      .check
        img.check_pic(v-if="shopDetail.status == 1")
        img.check_pic(v-else)
        .check_des
          p 监督检查结果： 
            span(v-if="shopDetail.status == 1") 良好
            span(v-else) 差
          p 检查日期：
            span {{shopDetail.identification.identificate_date && shopDetail.identification.identificate_date.split('T')[0]}}
      .info
        h2 商家信息
        .info_list
          p {{shopDetail.name}}
          p 地址：{{shopDetail.address}}
          p 营业时间：[{{shopDetail.opening_hours[0]}}]
          p 营业执照
            img(:src="go")
          p 餐饮服务许可证
            img(:src="go")

</template>
<script>
import {mapState} from 'vuex';
export default {
  name: 'ShopDetail',
  data() {
    return {
      go: require('@/assets/img/icon_more.png')
    }
  },
  computed: {
    ...mapState([
      'shopDetail'
    ])
  },
  mounted() {},
  methods: {

  }
}
</script>
<style lang="sass" scoped>

</style>
