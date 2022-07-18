<template>
  <view class="nav-list">
    <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
      <image :src="item.image_src" class="nav-img"></image>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 1. 分类导航的数据列表
        navList: [],
      };
    },
    onLoad() {
      // 2. 在 onLoad 中调用获取数据的方法
      this.getNavList()
    },
    methods: {
      // 获取分类列表的数据
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求出错，提示用户
        if (res.meta.status !== 200) return uni.$showMsg()
        // 将请求回来的数据转存到data中
        this.navList = res.message
      },
      navClickHandler(item) {
        // 如果是点击了分类，那就切换到tarbar--分类栏
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }
</style>
