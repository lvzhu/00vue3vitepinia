import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouterGuards } from './router-guards'

const routes = [
  {
    path: '/',
    meta: {
      title: '基层新时代'
    },
    redirect: '/information',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue'),
    children: [
      {
        path: 'information',
        name: 'information',
        meta: {
          title: '填写信息'
        },
        component: () => import(/* webpackChunkName: "informationView" */ '@/views/Home/InformationView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function setupRouter (app) {
  app.use(router)
  // 创建路由守卫
  createRouterGuards(router)
}
export default router
