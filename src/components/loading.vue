<template lang="pug">
.page
  .loading
    img(:src="load")
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      load: require('@/assets/img/loading.gif')
    }
  },
  computed: {
  },
  mixin: {
  },
  components: {
  },
  watch: {
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
<style lang="scss" scoped>
@import '../assets/css/mixin';
.loading{
  @include center;
}
img{
  width: 1.125rem;
  height: 1.125rem;
}
</style>


