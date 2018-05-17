<template lang="pug">
  .page.home_page
    Head
      span(slot="login" @click="reload") ele
    nav
      .position
        span 当前定位城市：
        span 定位不准时，请在城市列表中选择
      router-link.location(:to="{name: ''}")
        span 上海
        i.icon.arrow_right
    section.hot_city
      h4 热门城市
      ul
        router-link(v-for="item in hotcity" :to="{name: ''}" tag="li" :key="")
    section.sorted_city
      ul
        li(v-for="" :key="")
          h4 {{}}
          ul
            router-link(v-for="" tag="li" :key="")


</template>
<style lang="scss" src="./home.scss" scoped></style>
<script>
// import Head from '@/components/Head'
export default {
  name: 'Home',
  data () {
    return {

    }
  },
  beforeMount () {

  },
  mounted () {

  },
  methods: {
    fetchData() {}
  }
}
</script>


