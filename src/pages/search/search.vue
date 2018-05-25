<template lang="pug">
  .page.search_page
    Head
      router-link(:to="{name:'Msite'}") <
      router-link(slot="search") {{}}
    form.search
      input(type="search" v-model="searchVal" @input="checkInput" name="search" placeholder="请输入商家或美食名称")
      input(type="submit" value="提交" @click.prevent="searchTarget('')")
    section(v-if="history")
      h4.history 搜索历史
      ul
        li(v-for="" :key="")
    p.search_none(v-if="emptyResult") 很抱歉！无搜索结果
    foot

    

</template>
<style lang="scss" src="./search.scss" scoped></style>

<script>
export default {
  name: 'Search',
  data () {
    return {
      searchVal: '',
      history: false,
      emptyResult: true,
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    searchTarget() {
      this.emptyResult = true;
    },
    //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
    checkInput() {
      if(!searchVal) {
        this.history = true;     //显示历史记录
        this.emptyResult = false; //隐藏搜索为空提示
      }
    },
  }
}
</script>


