<template lang="pug">
  header
    //- 左
    slot(name="logo")
    img.back(v-if="goBack" @click="$router.go(-1)" :src="back")
    slot(name="search")
    //- 中
    h2.title(v-if="headTitle") {{headTitle}}     
    slot(name="msite-title")       
    slot(naem="edit")
    //- 右
    .isLogin(v-if="signinUp")
      img.user_avatar(v-if="userInfo" )
      p(v-else)
        router-link(:to="{name: ''}") 登录
        span |
        router-link(:to="{name: ''}") 注册
    slot(name="changecity")
    slot(name="changeLogin")

</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'Head',
  data () {
    return{
      back: require('@/assets/img/icon_back.png')
    }
  },
  props: ['signinUp', 'headTitle', 'goBack'],
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    this.getUserInfo();
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
header{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  background: $blue;
  @include wh(100%, 1.95rem);
}
.back{
  @include ct;
  left: 0.4rem;
  img{
    @include wh(0.8rem, 0.8rem);
  }
}
.title{
  @include center;
  @include sc(0.65rem,#fff);
}
.isLogin{
  @include ct;
  right: 0.4rem;
  @include sc(0.65rem,#fff);
  a{
    color: #fff;
  }
  span{
    margin: 0 0.3rem 0;
    color: #fff;
  }
}
  
</style>

