<template lang="pug">
  div
    transition(name="router-fade" mode="out-in")
      keepAlive
        router-view(v-if="$route.meta.keepAlive")
    transition(name="router-fade" mode="out-in")
      router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './assets/css/common';
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
  .router-fade-enter, .router-fade-leave {
    opacity: 0;
  }
  .router-fade-enter-active, .router-fade-leave-active {
    // opacity: 1;
    transition: opacity .3s
  }
</style>
