<template lang="pug">
  div
    transtion(name="router-fade" mode="out-in")
      router-view(v-if="")
    transition(name="router-fade" mode="out-in")
      router-view(v-if="")
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
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
