<template lang="pug">
  .page.food_page
    headTop(:head-title="title" goBack="true")
    ul.menus
      li
        .menu_list(@click="chooseType('food')")
          span {{title}}
          img(:src="arrow" v-if="!show1")
          img(:src="arrow_active" v-else="show1")
        .category(v-if="show1")
          ul.category_list
            li(v-for="(item, index) in category" :key="index")
              .category_item(@click="chooseCategory(index, item.id)" :class="{active: item.id == restaurant_category_id}")
                div.category_box
                  img.icon_category(:src="getImgPath(item.image_url)")
                  span {{item.name}}
                div.more_box
                  span.count {{item.count}}
                  img.more(:src="more")
          ul.category_list_sub
            li(v-for="(val, i) in category_sub" @click="selectCategory(val.id, val.name)" :class="{selectActive: val.id == restaurant_category_id}" :key="i" )
              span {{val.name}}
              span {{val.count}}
      li
        .menu_list(@click="chooseType('sort')")
          span 排序
          img(:src="arrow" v-if="!show2")
          img(:src="arrow_active" v-else="show2")
        ul.sort(v-if="show2" @click="chooseSort")
          // li(v-for="(item, index) in sortList" @click="selectSort(item.val)" :key="index")
          li(v-for="(item, index) in sortList" :key="index")
            p(:data="item.val") {{item.con}}
      li
        .menu_list(@click="chooseType('select')")
          span 筛选
          img(:src="arrow" v-if="!show3")
          img(:src="arrow_active" v-else="show3")
        .delivery(v-if="show3")
          h4 配送方式
          ul.delivery_ways
            li(v-for="(item, index) in delivery" @click="selectDeliveryMode(index, item.id)" :class="{on: act == index}" :key="index") {{item.text}}
            li( @click="selectDeliveryMode(1, 111)" :class="{on: act == 1}" ) 美团专送
          h4 商家属性（可以多选）
          ul.supports
            li(v-for="(item, index) in support" @click="selectSupportIds(index, item.id)" :class="{on: support[index].status}"  :key="index")
              span.support_text(v-show="!support[index].status" :style="{color: '#'+item.icon_color, borderColor: '#'+item.icon_color}") {{item.icon_name}}
              span {{item.name}}
          .btns
            .clearAll(@click="clearSelect") 清空
            .sure(@click="confirmSelectFun") 
              span 确定
              span(v-show="num") ( {{num}} )
    shop-list.shopBox(v-if="latitude" :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :sortByType="sortByType" :restaurantCategoryIds="restaurant_category_ids" :deliveryMode="delivery_mode" :supportIds="support_ids" :confirmSelect="confirmStatus")
    .cover(v-if="show1 || show2 || show3")

</template>
<style lang="scss" src="./food.scss" scoped></style>

<script>
import {mapState, mapMutations} from 'vuex'
import shopList from '@/components/shopList'
import {getImgPath} from '@/components/mixin'
import {msiteAddress, foodCategory, foodDelivery, foodActivity} from '@/service/api'
// import { react } from 'babel-types';
export default {
  name: 'Food',
  data () {
    return {
      title: '',
      geohash: '',
      show1: false,
      show2: false,
      show3: false,
      arrow: require('@/assets/img/icon_arrow_down.png'),
      arrow_active: require('@/assets/img/icon_arrow_top.png'),
      more: require('@/assets/img/icon_more.png'),
      category: [],                      // category分类左侧数据
      category_sub: [],                  // category分类右侧数据
      sortList: [
        {
          val: 1,
          con: '智能排序'
        },
        {
          val: 2,
          con: '距离最近'
        },
        {
          val: 3,
          con: '销量最高'
        },
        {
          val: 4,
          con: '起送价最低'
        },
        {
          val: 5,
          con: '配送速度最快'
        },
        {
          val: 6,
          con: '评分最高'
        },
      ],
      delivery: [],                          // 配送方式
      support: [],                            // 商家支持属性
      act: -1,
      num: '',
      restaurant_category_id: '',             // 食品类型id值
      sortByType: null,                       // 根据何种方式排序
      restaurant_category_ids: '',            //食品-右侧的id
      delivery_mode: null,                    // “筛选”选中的 配送方式
      support_ids: [],                       // “筛选”选中的 商铺属性
      confirmStatus: false,                 // “确认” 选择
    }
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mixins: [getImgPath],
  components: {
    shopList
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    ...mapMutations([
    	'RECORD_ADDRESS'
    ]),
    async fetchData() {
      this.title = this.$route.query.title;
      this.geohash = this.$route.query.geohash;
      this.restaurant_category_id = this.$route.query.restaurant_category_id;
      //防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
      if (!this.latitude) {
        let r = await msiteAddress(this.geohash);
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(r);
      }
      foodCategory(this.latitude, this.longitude).then(r => {
        this.category = r;
        for(var i=0; i< this.category.length; i++) {
          if(this.category[i].id == this.restaurant_category_id) {
            this.category_sub = this.category[i].sub_categories;
          }
        }
      });
      foodDelivery(this.latitude, this.longitude).then(r => {
        this.delivery = r;
      });
      foodActivity(this.latitude, this.longitude).then(r => {
        this.support = r;
      });
    },
    // 点击顶部三个选项，展示不同的列表，选中当前选项进行展示，同时收回其他选项
    chooseType(type) {
      if(type == 'food') {
        this.show1 = !this.show1;
        this.show2 = false;
        this.show3 = false;
      }
      if(type == 'sort') {
        this.show1 = false;
        this.show2 = !this.show2;
        this.show3 = false;
      }
      if(type == 'select') {
        this.show1 = false;
        this.show2 = false;
        this.show3 = !this.show3;
      }
    },
    //选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
    chooseCategory(index, id){
      this.category_sub = this.category[index].sub_categories;
      this.restaurant_category_id = id;
    },
    //选中Category右侧列表的某个选项时，重新获取数据并渲染
    selectCategory(id, name) {
      this.title = name;
      this.restaurant_category_ids = id;
      this.show1 = false;
    },
    //选中"排序"
    chooseSort(event) {
      let node;
      if(event.target.nodeName.toUpperCase() == 'P') {
        node = event.target;
      } else {
        node = event.target.children[0];
      }
      this.sortByType = node.getAttribute('data');
      this.show2 = false;
    },
    // selectSort(id) {
    //   this.sortByType = id;
    // },
    //选中"筛选-配送方式"
    selectDeliveryMode(index, id){
      if(this.act == index && this.delivery_mode) {
        this.act = -1;
        this.delivery_mode = null;
        this.num --;
      } else if (this.act != index && this.delivery_mode) {
        this.act = index;
        this.delivery_mode = id;
      } else if (this.act != index && !this.delivery_mode) {
        this.act = index;
        this.delivery_mode = id;
        this.num ++;
      }
    },
    //选中"筛选-商家属性"
    selectSupportIds(index, id) {
      this.support[index].status = !this.support[index].status;
      // 判断是否选中，若选中，则将id放入数组中，若取消，从数组中删除id
      if(this.support[index].status) {
        this.support_ids.push(id);
        this.num ++;
      } else {
        for(let i = 0; i< this.support_ids.length; i++) {
          if(this.support_ids[i] == id) {
            this.support_ids.splice(i, 1);
            this.num --;
          }
        }
      }
    },
    //"筛选-清空"
    clearSelect() {
      this.num = 0;
      this.act = -1;
      this.delivery_mode = null;
      for(let i=0; i< this.support.length; i++) {
        this.support[i].status = '';
        this.support_ids = [];
      }
    },
    //"筛选-确认"
    confirmSelectFun() {
      this.confirmStatus = !this.confirmStatus;
      this.show3 = false;
    }
  }
}
</script>