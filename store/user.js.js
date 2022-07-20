export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    // 先尝试从本地读取信息address，读取不到的话就{}
    // 读取本地信息 getStorageSync('属性')  
    // 设置本地信息  setStorageSync ('需要设置的属性名'，对应的值)
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),

  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 将address同时保存到本地
      this.saveAddressToStorage()
    },
    // 1. 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
  },

  // 数据包装器
  getters: {},
}
