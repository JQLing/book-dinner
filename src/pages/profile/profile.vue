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
    

    

</template>
<style lang="scss" src="./profile.scss" scoped></style>

<script>

export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  components: {

  },
  computed: {

  },
  mounted () {
    this.fetchData();
  },
  methods: {
    fetchData() {

    }
  }
}
</script>


