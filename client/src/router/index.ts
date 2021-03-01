import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [{
   name: 'Home',
   path: '/',
   component: Home
}, {
   name: 'About',
   path: '/about',
   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
}]

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes
})

export default router
