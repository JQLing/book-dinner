<template lang="pug">
  .page.msite_page
    Head
      router-link(slot="search" :to="{name:'Search'}") 搜索美食
      router-link(slot="msite-title" :to="{name:'Home'}") {{msiteTitle}}
    nav
      .swiper-container
        .swiper-wrapper
          .swiper-slide(v-for="(item, index) in foodClass" :key="index")
            router-link(:to="")
              //- li(v-for="(item, index) in foodClass" :key="index")
                .img(:src="item.image_url")
                p {{item.title}}
        .swiper-pagination
    //- .nearby
    //-   .title
    //-     .img()
    //-     p 附近商家
    //-   ul
    //-     li(v-for="")
    //-       .img()
    //-       .con
    //-         p
    //-           span.brand 品牌
    //-           span {{}}
    //-           span {{}}
    //-         .rate
    //-         p
    //-           span {{}}
    //-           span {{}}
    //-           span {{}}
    //-           span.tiem {{}}

    

</template>
<style lang="scss" src="./food.scss" scoped></style>

<script>
// import {cityGuess, hotcity, groupcity} from '@/service/api'
import '@/assets/css/swiper.min.css'
import '@/assets/js/swiper.min.js'
export default {
  name: 'Food',
  data () {
    return {
      geohash: '',
      msiteTitle: '',
      foodClass: [],
      shopList: []
    }
  },
  mounted () {
    this.fetchData();
  },
  computed: {
  },
  methods: {
    fetchData() {
      this.geohash = this.$route.geohash;
      this.$storage.msiteAddress(this.geohash).then(r => {
        this.msiteTitle = r.name;
      });
      // 食品分类 列表
      this.$storage.msiteFoodTypes(this.geohash).then(r => {
        this.foodClass = r;
      });
      // 商家 列表

    }
  }
}
</script>


