import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/pages/layout'
import index from '@/pages/index'
import login from '@/pages/login'
import store from '../store'
Vue.use(Router)
// 1定义路由，每个路由应该映射一个组件

function requireAuth (to, from, next) {
  // next()
  console.log('======in requireAuth=======')
  console.log(store.state.user)
  if (store.state.user.status === 'login') {
    console.log('already login')
    next()
  } else {
    console.log('not login')
    next({
      path: '/login'
    })
  }
}
export default new Router({
  //2 vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。
  //如果不想要很丑的 hash，我们可以用路由的 history 模式，
  //这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: index,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      beforeEnter: requireAuth
    },
    {
      path: '/importExcel',
      name: 'excel',
      component: () => import('@/pages/uploadExcel'),
      beforeEnter: requireAuth
      // props: true
// hidden: true
    },
    {
      path: '/data',
      name: 'layout',
      component: layout,
      beforeEnter: requireAuth
    },

    {
      path: "/config",
      name: "config",
      component: () => import('@/components/editConfig'),
      beforeEnter: requireAuth
    },

    {
      path: "/alias",
      name: "alias",
      component: () => import('@/components/editAlias'),
      beforeEnter: requireAuth
    }

  ]
})
