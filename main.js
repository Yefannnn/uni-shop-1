import App from './App'

// 导入 store 实例对象
import store from '@/store/store.js'

// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
// 请求根路径
$http.baseUrl = "https://www.uinav.com"
// uni 顶级对象
uni.$http = $http

// 请求拦截器
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中~'
  })
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my/') !== -1) {
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: store.state.m_user.token,
    }
  }
}

// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading()
}


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  // 挂载store对象
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
