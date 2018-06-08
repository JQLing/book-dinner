<template lang="pug">
  .page.home_page
    headTop(signin-up="home")
      span.head_log(slot="logo" @click="reload") ele.me
    nav
      .position
        span 当前定位城市：
        span 定位不准时，请在城市列表中选择
      router-link.location(:to="{name: 'City', params: { cityId: guessCityId }}" tag="div")
        span {{guessCity}}
        img(:src="next")
    .hot_city
      h4 热门城市
      ul.hot_city_list.clear(v-if="hotCity.length")
        router-link.ellipsis.fl(v-for="item in hotCity" :to="{name: 'City', params: { cityId: item.id }}" tag="li" :key="item.id") {{item.name}}
    section.group_city
      ul.group_city_list
        li(v-for="(val, key, index) in sortGroupCity" :key="key")
          h4 {{key}}
            span(v-if="!index") （按字母排序）
          ul.city_list.clear(v-if="val.length")
            router-link.ellipsis.fl(v-for="item in val"  :to="{name:'City', params: { cityId: item.id }}" tag="li" :key="item.id") {{item.name}}
         
          
</template>
<style lang="scss" src="./home.scss" scoped></style>

<script>
// 接口
import {cityGuess, hotcity, groupcity} from '@/service/api'

export default {
  name: 'Home',
  data () {
    return {
      guessCity: '',       //当前城市
      guessCityId: '',    //当前城市id
      hotCity: [],       //热门城市列表
      next: require('@/assets/img/icon_more.png'),
      groupCity: {}     //所有城市列表
    }
  },
  mounted () {
    this.fetchData();
  },
  computed: {
    //将获取的数据按照A-Z字母开头排序
    sortGroupCity() {
      let sortObj = {};
      for(var i = 65; i < 90; i++) {
        if(this.groupCity[String.fromCharCode(i)]) {
          sortObj[String.fromCharCode(i)] = this.groupCity[String.fromCharCode(i)];
        }
      }
      return sortObj;
    }
  },
  methods: {
    fetchData() {
      // 获取当前城市
      cityGuess().then(r => {
        this.guessCity = r.name;
        this.guessCityId = r.id;
      });
      //获取热门城市
      hotcity().then(r => {
        this.hotCity = r;
      });
      //获取所有城市
      groupcity().then(r => {
          this.groupCity = r;
      })
    },
    //点击图标刷新页面
    reload(){
      window.location.reload();
    }
  }
}
</script>


