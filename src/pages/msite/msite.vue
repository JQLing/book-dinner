<template lang="pug">
  .page.msite_page
    Head
      router-link(:to="{name:'Home'}") 搜索美食
      router-link(slot="msite-title" :to="{name:'Home'}") {{msiteTitle}}
    ul
      li(v-for="" :key="")
        .img()
        p {{}}
    .nearby
      .title
        .img()
        p 附近商家
      ul
        li(v-for="")
          .img()
          .con
            p
              span.brand 品牌
              span {{}}
              span {{}}
            .rate
            p
              span {{}}
              span {{}}
              span {{}}
              span.tiem {{}}

    

</template>
<style lang="scss" src="./msite.scss" scoped></style>

<script>
// import {cityGuess, hotcity, groupcity} from '@/service/api'
export default {
  name: 'Msite',
  data () {
    return {
      msiteTitle: ''

    }
  },
  mounted () {
    this.fetchData();
  },
  computed: {
  },
  methods: {
    fetchData() {
      
    }
  }
}
</script>


