<template lang="pug">
  .page.msite_page
    Head
      router-link(slot="search" :to="{name:'Search'}") 搜索美食
      router-link(slot="msite-title" :to="{name:'Home'}") {{msiteTitle}}
    nav
      .swiper-container(v-if="foodClass.length")
        .swiper-wrapper
          .swiper-slide(v-for="(item, index) in foodClass" :key="index")
            router-link(v-for="val in item" :key="val.id" :to="{name: Food, query: {geohash, title: val.title, restaurant_category_id: getCategoryId(val.link)}}")
              figure
                img(:src="imgBaseUrl + val.image_url")
                figcaption {{val.title}}
        .swiper-pagination
      img(v-else :src="")
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
    .shop_list
    

    

</template>
<style lang="scss" src="./profile.scss" scoped></style>

<script>
// import {cityGuess, hotcity, groupcity} from '@/service/api'
import '@/assets/css/swiper.min.css'
import '@/assets/js/swiper.min.js'
import {imgBaseUrl} from '/config/env'

export default {
  name: 'Profile',
  data () {
    return {
      geohash: '',
      msiteTitle: '',
      foodClass: [],
      shopList: []
    }
  },
  components: {

  },
  computed: {

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
      // 导航 食品分类 列表 and 初始化swiper
      this.$storage.msiteFoodTypes(this.geohash).then(r => {
        let arr = [...r];     // 返回一个新的数组
        for(let i=0,j=0; i< arr.length; i+= 8,j++){
          this.foodClass[j] = arr.splice(0, 8); // 返回新数组，包含被删除的项
        }

      }).then(() => {
        new Swiper ('.swiper-container', {
          // loop: true,
          pagination: '.swiper-pagination'
        });
      });
      // 商家 列表

    },
    getCategoryId(link) {}
  }
}
</script>


