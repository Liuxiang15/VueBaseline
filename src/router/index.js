import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import home from '@/pages/home'
// import showjson from '@/pages/showjson'

import layout from '@/pages/layout'
// import uploadexcel from '@/pages/uploadExcel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout
    },
    // {
    //   path: '/excel',
    //   redirect: '/excel/import-excel',
    //   name: 'uploadExcel',
    //   component: uploadexcel,
    //   // component:layout,
    //   // children:[
    //   //   { path: 'import-excel', component: importExcel, name: 'importExcel', meta: { title: 'importExcel' }}
    //   // ]
    // },

    { path: '/excel',  component: () => import('@/pages/uploadExcel'), hidden: true },

  ]
})
