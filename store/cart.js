// cart --- store
export default {
  namespaced: true,
  state: {
    // 默认先尝试从本地读取数据，有数据就用，没数据就来个空数组
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  },
  mutations: {
    // state 数据库  good 商品信息，将提交过来的信息更新到数据库中
    addToCart(state, goods) {
      // 如果找到对应的商品就会返回对应的商品详情，如果没有对应的商品，就会返回undefinded
      const findResult = state.cart.find(x => x.goods_id === goods.goods._id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        // 如果购物车有这个商品，那就直接更新数据就好
        findResult.goods_count++
      }
    },
    // 更新商品状态
    updateGoodsState(state, goods) {
      // 根据提交的goods，检查store中对应的数据
      const goodsObj = state.cart.find(item => item.goods_id === goods.goods_id)
      // 找到对应的Obj
      if (goodsObj) {
        // 将提交的goods状态提交到goodsObj
        goodsObj['goods_state'] = goods['goods_state']
        // 将状态同步存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    removeGoodsById(state, goods_id) {
      // 拿到cart中对应的商品并删除
      state.cart.filter(item => item.good_id !== goods_id)
      // 将购物车中的数据转存到本地
      this.commit('m_cart/saveToStorage')

    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新商品的状态
    updateAllGoodsState(state, newState) {
      state.cart = state.cart.map(item => item.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  actions: {},
  getters: {
    // 统计购物车里面商品总数
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((pre, curr) => pre += curr.goods_count, 0)
    },
    // 计算购物车被选中的商品总价
    checkedGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((sum, item) => sum += (item.goods_count * item
          .goods_price), 0)
        .toFixed(2)
    }
  }
}
