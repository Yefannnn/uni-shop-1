<template>
  <view v-if="goods_info.goods_name">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>

    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box ">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body goods-detail-container">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
      <!-- 商品详情信息 -->
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
      <!-- 商品导航组件 -->
      <view class="goods_nav">
        <!-- fill 控制右侧按钮的样式 -->
        <!-- options 左侧按钮的配置项 -->
        <!-- buttonGroup 右侧按钮的配置项 -->
        <!-- click 左侧按钮的点击事件处理函数 -->
        <!-- buttonClick 右侧按钮的点击事件处理函数 -->
        <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
          @buttonClick="buttonClick" />
      </view>
    </view>
  </view>
</template>

<script>
  // 从 vuex 中按需导出 mapState 辅助方法
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      // 将m_cart模块中的cart数据映射到组件中，这里面可以访问到关于购物车详情
      ...mapState('m_cart', ['cart']),
      ...mapGetters(['total'])
    },
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: this.total
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      // console.log(options);
      // options中有需要查找的id 项
      // 获取商品 Id
      const goods_id = Number(options.goods_id)
      // 调用请求商品详情数据的方法
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 定义请求商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 商品详情的底部出现空隙，完全是因为img的默认边距，于是拿到数据之后先将所有的img添加上style样式，这样渲染的时候img就带上了style节点属性
        // 苹果设备可能会识别不了webp格式，所以需要全部换成jpg
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
          .replace(/webp/g, 'jpg')
        // 为 data 中的数据赋值
        this.goods_info = res.message
      },
      // 实现轮播图的预览效果
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: i,
          // 所有图片 url 地址的数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      onClick(e) {
        // e => index ： nav对应数据在数组中的位置  content ： nav对应的数据
        // console.log(e);
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      async buttonClick(e) {
        // console.log(e);
        // 通过e.content.text判断出点击是哪一个按钮
        if (e.content.text === '加入购物车') {
          const goods = {
            goods_id: this.goods_info.goods_id, // 商品的Id
            goods_name: this.goods_info.goods_name, // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
            goods_state: true // 商品的勾选状态
          }
          // 将数据提交到store中
          await this.addToCart(goods)
          // 购物车中的数据一份存store 一份存 本地
          await this.saveToStorage()
        }
      },
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart', 'saveToStorage']),
      onShow() {
        // 在页面刚展示的时候，设置数字徽标
        this.setBadge()
      },
      // 这是徽标
      setBadge() {
        uni.setTabBarBadge({
          index: 2, // 索引
          text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
        })
      }
    },
    watch: {
      // 通过监听total数据的变化，来动态改变购物车上面的徽标
      total: {
        handler(newval) {
          this.options.forEach(item => {
            if (item.text === '购物车') {
              item.info === newval
            }
          })
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域的样式
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      // 收藏区域
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    // 运费
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }

  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }

  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
