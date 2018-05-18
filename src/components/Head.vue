<template lang="pug">
  header
    slot(name="login")
    slot(name="changecity")
    slot(name="search")
    slot(naem="edit")
    slot(name="msite-title")
    slot(name="changeLogin")

</template>
<script>
export default {
  name: Head,
  data () {
    return{

    }
  },
  mounted () {

  },
  methods: {

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
  
  
</style>

