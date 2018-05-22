<template lang="pug">
  .page.city_page
    head
      router-link(slot="changecity" :to="{name:'Home'}") 切换城市
    form
      input(v-model="address" type="search" name="city" placeholder="输入学校、商务楼、地址" required)
      input(@click="position" type="submit" name="submit" value="提交")
    ul(v-if="addressList.length")
      li(v-for="(item, index) in addressList" @click="goDetail(index)" :key="index")
        p {{item.name}}
        p {{item.address}}
    p(v-else) 无搜索结果！
    p(v-if="addressHistory.length") 搜索历史
    ul(v-if="addressHistory.length")
      li(v-for="(item, index) in addressHistory" :key="index")
        p {{item.name}}
        p {{item.address}}
      li(@click="clearAll") 清空所有
    

</template>
<style lang="scss" src="./city.scss" scoped></style>

<script>
// import {cityGuess, hotcity, groupcity} from '@/service/api'
export default {
  name: 'City',
  data () {
    return {
      address: '',             // 输入地址
      cityId: '',
      cityName: '',
      addressList: '',          // 搜索结果：地址列表
      addressHistory: []      // 历史搜索地址
      // isShow: false,            // 是否显示‘搜索历史’
      // hasResult: ''        //是否有 搜索结果

    }
  },
  mounted () {
    this.fetchData();
  },
  computed: {
  },
  methods: {
    fetchData() {
      this.cityId = this.$route.params.cityId;
      //获取当前所在城市
      currentcity(this.cityId).then(r => {
        this.cityName = r.name;
      });
      this.addressHistory = this.$storage.lsGet('addressHistory');
    },
    //点击提交
    position(){
      // 获取搜索地址列表
      if(this.address) {
        searchplace(this.cityId, this.address).then(r => {
          this.addressList = r;
          // this.hasResult = r.length ? true : false;
        });
      }
      
    },
    /**
     * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
     * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
     */
    goDetail(index) {
      let chooseAddress = this.addressList[index];
      let history = this.$storage.lsGet('addressHistory');
      if(history) {
        history.every((item, i) => {
          if(item.geohash == chooseAddress.geohash) {
            // return false跳出循环, return true继续循环
            return false;
          }
          if(item.geohash != chooseAddress.geohash && i == history.length-1) {
            this.addressHistory.push(chooseAddress)
          }
        });
      }
      this.$storage.lsSet('addressHistory', this.addressHistory);
      this.$router.push({
        name: 'Msite',
        query: {geohash: chooseAddress.geohash}
      })
    },
    clearAll() {
      this.$storage.lsRemove('addressHistory');
      this.fetchData();
    }
  }
}
</script>


