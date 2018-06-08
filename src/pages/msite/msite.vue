<template lang="pug">
  .page.msite_page
    headTop(signin-up="true")
      router-link.search_icon(slot="search" :to="{name:'Search'}")
        img.search_pic(:src="searchPic")
      router-link.ellipsis.title(slot="msite-title" :to="{name:'Home'}") {{msiteTitle}}
    nav
      .swiper-container(v-if="foodClass")
        .swiper-wrapper
          .swiper-slide(v-for="(item, index) in foodClass" :key="index")
            router-link(v-for="val in item" :key="val.id" :to="{name: 'Food', query: {geohash: geohash, title: val.title, restaurant_category_id: getCategoryId(val.link)}}" tag="div")
              figure.fl
                img(:src="imgBaseUrl + val.image_url")
                figcaption {{val.title}}
        .swiper-pagination
      //- img(v-else :src="")
      //- geohash=31.321,121.47597
    .shop
      .tit
        //- img(:src="")
        span 附近商家
      shop-list(v-if="hasGetData" :geohash = "geohash")
    foot
</template>
<style lang="scss" src="./msite.scss" scoped></style>

<script>
import {mapMutations} from 'vuex'
import '@/assets/css/swiper.min.css'
// import '@/assets/js/swiper.min.js'
import Swiper from 'swiper';
// import {imgBaseUrl} from '@/assets/js/env'
import {cityGuess, msiteAddress, msiteFoodTypes} from '@/service/api'
import shopList from '@/components/shopList'

export default {
  name: 'Msite',
  data () {
    return {
      geohash: '',                    // city页面传递过来的地址geohash
      msiteTitle: '请选择地址...',    // msite页面头部标题
      searchPic: require('@/assets/img/icon_search.png'),
      foodClass: [],                // 食品分类列表  
      imgBaseUrl: 'https://fuss10.elemecdn.com',   //图片域名地址
      hasGetData: false                //是否已经获取地理位置数据，成功之后再获取商铺列表信息
    }
  },
  components: {
    shopList
  },
  computed: {
  },
  async beforeMount () {
    if(this.$route.query.geohash) {
      this.geohash = this.$route.query.geohash;
    }else {
      const r = await cityGuess();
      this.geohash = r.latitude + ',' + r.longitude;
    }
    //保存geohash到vuex
    this.SAVE_GEOHASH(this.geohash);
    //获取位置
    msiteAddress(this.geohash).then(r => {
      this.msiteTitle = r.name;
      // 记录当前经度纬度
      // this.RECORD_ADDRESS(r.latitude, r.longitude);
      this.RECORD_ADDRESS(r);
      this.hasGetData = true;
    });
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    ...mapMutations([
      'SAVE_GEOHASH', 'RECORD_ADDRESS'
    ]),
    fetchData() {
      // 导航 食品分类 列表 and 初始化swiper
      msiteFoodTypes(this.geohash).then(r => {
        let arr = [...r];     // 返回一个新的数组
        for(let i=0,j=0; i<= arr.length; i+= 8,j++){
          this.foodClass[j] = arr.splice(0, 8);     // 返回新数组，包含被删除的项
        }
      }).then(() => {
        let mySwiper = new Swiper ('.swiper-container', {
          // loop: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          hashnav:true,
          observer:true,           //修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,   //修改swiper的父元素时，自动初始化swiper
          onSlideChangeEnd: function(swiper){
            swiper.update();
          }
        });
      });
    },
    // 解码url地址，求restaurant_category_id值
    getCategoryId(url) {
      let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
      if(/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id;
      }else {
        return '';
      }
    }
  }
}
</script>


