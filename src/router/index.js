import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import home from '@/pages/home'
// import showjson from '@/pages/showjson'

import layout from '@/pages/layout'
import importExcel from '@/pages/importExcel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout
    },
    {
      path: '/import-excel',
      name: 'importExcel',
      // component: importExcel,
      component: () => import('@/pages/importExcel')
    }
  ]
})
