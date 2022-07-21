<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <!-- getuserinfo 打开方式，需要用户的授权 -->
    <!-- 默认开始监听了同名的事件，只要用户点击确定或者取消，就会触发这个事件回调函数 -->
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo']),
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取用户信息的回调函数
      getUserInfo(e) {
        // 判断是否获取用户信息成功
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')

        // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        // 将用户的信息存入 store  updateUserInfo  
        this.updateUserInfo(e.detail.userInfo)
        // 获取登录成功后的 Token 字符串
        this.getToken(e.detail)
      },
      // 登录方法
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')
        // 2. 更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
        // 登录成功之后重定向
        this.navigateBack()
      },
      // 登录成功重定向
      navigateBack() {
        // 判断是否有重定向信息
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 有信息，就跳转
          uni.switchTab({
            url: this.redirectInfo.from,
            complete() {
              // 不管跳转成功与否，都直接置空
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>


<!-- 
      重定向的原理
      小程序在使用编程时导航跳转的时候，只要跳转成功就会执行success的回调函数，执行回调函数的时候需要对重定向的信息进行转存到store中。这样任何一个页面跳转到登录页面都能实现重定向，只需要在登录页也主动获取store中的重定向信息，如果能获取到就跳转（每次不管是否跳转成功，都要将重定向信息置空，不然可能每次登录成功的时候都会重定向）
 
 -->
