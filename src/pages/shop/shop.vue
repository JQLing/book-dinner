<template lang="pug">
  .page.shop_page
    head
      router-link(slot="search" :to="{name:'Search'}") 搜索美食
      router-link(slot="msite-title" :to="{name:'Home'}") {{msiteTitle}}

</template>
<style lang="scss" src="./shop.scss" scoped></style>

<script>
// import {mapMutations} from 'vuex'
// import '@/assets/css/swiper.min.css'
// import '@/assets/js/swiper.min.js'
// // import {imgBaseUrl} from '/config/env'
// import shopList from '@/components/shopList'

export default {
  name: 'Shop',
  data () {
    return {
      // geohash: '',                    // city页面传递过来的地址geohash
      // msiteTitle: '请选择地址...',    // msite页面头部标题
      // foodClass: [],                // 食品分类列表  
      // imgBaseUrl: 'https://fuss10.elemecdn.com',   //图片域名地址
      // hasGetData: false  //是否已经获取地理位置数据，成功之后再获取商铺列表信息
    }
  },
  components: {
    // shopList
  },
  async beforeMount () {
    // if(this.$route.query.geohash) {
    //   this.geohash = this.$route.query.geohash;
    // }else {
    //   const r = await cityGuess();
    //   this.geohash = r.latitude + ',' + r.longitude;
    // }
    // //保存geohash到vuex
    // this.SAVE_GEOHASH(this.geohash);
    // //获取位置
    // msiteAddress(this.geohash).then(r => {
    //   this.msiteTitle = r.name;
    //   // 记录当前经度纬度
    //   // this.RECORD_ADDRESS(r.latitude, r.longitude);
    //   this.RECORD_ADDRESS(r);
    //   this.hasGetData = ture;
    // });
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    // ...mapMutation([
    //   'SAVE_GEOHASH', 'RECORD_ADDRESS'
    // ]),
    fetchData() {
      // 导航 食品分类 列表 and 初始化swiper
      // msiteFoodTypes(this.geohash).then(r => {
      //   let arr = [...r];     // 返回一个新的数组
      //   for(let i=0,j=0; i< arr.length; i+= 8,j++){
      //     this.foodClass[j] = arr.splice(0, 8); // 返回新数组，包含被删除的项
      //   }

      // }).then(() => {
      //   new Swiper ('.swiper-container', {
      //     // loop: true,
      //     pagination: '.swiper-pagination'
      //   });
      // });
    },
    // 解码url地址，求restaurant_category_id值
    // getCategoryId(url) {
      // let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
      // if(/restaurant_category_id/gi.test(urlData)) {
      //   return JSON.parse(urlData).restaurant_category_id.id;
      // }else {
      //   return '';
      // }
    // }
  }
}
</script>


