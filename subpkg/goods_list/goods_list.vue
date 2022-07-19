<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
        <!-- 放入小组件 -->
        <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量，用来实现分页
        total: 0,
        // 默认的空图片
        defaultPic: 'https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF',
        // 是否正在请求数据
        isloading: false
      };
    },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      // 因为所有跳转到这个组件的路由当中都携带了query参数和cid
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    methods: {
      // 根据关键词和cid获取商品列表
      async getGoodsList(cb) {
        this.isloading = true
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 出错了
        if (res.meta.status !== 200) return uni.$showMsg()
        // 成功获取
        // 为数据赋值
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        this.isloading = false
        // 如果有回调函数就执行，没有就拉到，主要就是用来关下拉刷新的
        cb && cb()
      },
      // 触底页码加1 重新加载
      onReachBottom() {
        // 判断是否还有下一页数据
        if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
        if (this.isloading) return
        // 让页码值自增 +1
        this.queryObj.pagenum += 1
        // 重新获取列表数据
        this.getGoodsList()
      },
      // 下拉刷新的事件
      onPullDownRefresh() {
        // 1. 重置关键数据
        this.queryObj.pagenum = 1
        this.total = 0
        this.isloading = false
        this.goodsList = []

        // 2. 重新发起请求
        this.getGoodsList(() => uni.stopPullDownRefresh())
      },
      gotoDetail(item) {
        // 跳转商品详情页
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id =' + item.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
