import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


import layout from '@/pages/layout'

import index from '@/pages/index'

Vue.use(Router)
// 1定义路由，每个路由应该映射一个组件
export default new Router({
  //2 vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。
  //如果不想要很丑的 hash，我们可以用路由的 history 模式，
  //这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },

    { path: '/excel',  component: () => import('@/pages/uploadExcel'), hidden: true },
    {
      path:'/data',
      name: 'layout',
      component: layout
    }

  ]
})
