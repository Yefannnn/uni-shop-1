import Vue from 'vue'
import Vuex from 'vuex'
// 注册vuex
Vue.use(Vuex)

// 1. 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 导入用户的 vuex 模块
import moduleUser from './user.js'

// 导出一个store对象
export default new Vuex.Store({
  modules: {
    m_cart: moduleCart,
    // 挂载用户的 vuex 模块，访问路径为 m_user
    m_user: moduleUser,
  },
  getters: {
    // 创建全局购物车数量total的快捷访问
    total(state) {
      let count = 0
      state.m_cart.cart.forEach(item => {
        if (item) {
          count += Number(item.goods_count)
        }
      })
      return count
    },
    // 全局可用的address
    // 收货详细地址的计算属性
    addstr(state) {
      if (!state.m_user.address.provinceName) return ''

      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.m_user.address.provinceName + state.m_user.address.cityName + state.m_user.address.countyName +
        state.m_user.address
        .detailInfo
    }
  }
})
