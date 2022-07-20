//tabBar 徽标

// 当页面展示的时候，主动获取store中de total值
// 最后将total中的值映射到 徽标中

import {
  mapGetters
} from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters(['total']),
  },
  watch: {
    // 监听 total 值的变化
    total() {
      // 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
      this.setBadge()
    },
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      if (this.total === 0) return
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
      })
    },
  },
}
