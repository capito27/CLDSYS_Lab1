import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Profile from '@/views/Profile.vue'

export default {
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {requiresAuth: true}
    },
    {
      path: '/adminPanel',
      name: 'about',
      component : AdminPanel,
      meta: {requiresAuth: true, requiresAdmin : true},
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {requiresAuth: false}
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {requiresAuth: true}
    }
  ]
}
