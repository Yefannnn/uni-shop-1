<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <!-- 是否被选中是由商品当前的状态决定的 -->
      <!-- 是否显示radio是由夫组件决定 -->
      <radio v-if="showRadio" :checked="goods.goods_state" color="#C00000" @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{ProcessPrice(goods.goods_price)}}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    // 定义 props 属性，循环的过程中使用者传递goods商品的信息，使用者发请求拿数据，这个组件只负责渲染数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        defaul: {},
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
        default: false,
      },
      // 是否展示价格右侧的 NumberBox 组件
      showNum: {
        type: Boolean,
        default: false,
      },
    },
    onLoad() {
      console.log('goods', this.goods);
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      }
    },
    methods: {
      // 处理价格格式
      ProcessPrice(num) {
        return Number(num).toFixed(2)
      },
      // 用户点击radio的时候触发事件
      radioClickHandler() {
        // 触发父组件的自定义事件，并且将商品的id和状态发送给父组件，由父组件统一修改商品的状态
        this.$emit('radio-change', {
          // 商品的 Id
          goods_id: this.goods.goods_id,
          // 商品最新的勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      numChangeHandler(e) {
        // 这里可以拿到数量的最新值
        this.$emit('numChange', {
          goods_id: this.goods.goods_id,
          goods_count: +e
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

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

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

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
