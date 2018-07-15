import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


import layout from '@/pages/layout'
import index from '@/pages/index'

Vue.use(Router)
// 1定义路由，每个路由应该映射一个组件
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path:'/data',
      name: 'layout',
      component: layout
    }
  ]
})
