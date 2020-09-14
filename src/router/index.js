import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '../components/pages/login'
import Dashboard from '../components/Dashboard'
import Products from '../components/pages/Products'

Vue.use(Router);

export default new Router({
  routes: [
    // todo 這個小技巧:如果在網址後端隨便打路徑，頁面會呈現空白，因此加入這段讓這個行為可以從新導到登入頁面
    {
      path:'*',
      redirect:'/login'
    },
    // todo 正常頁面路徑
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true }
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }
        },
      ],
    },
  ]
})
