import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

export default createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes: [{
      name: "Home",
      path: "/",
      component: Home
   }, {
      name: "About",
      path: "/about",
      component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
   }, {
      name: "404 Not Found",
      path: "/:catchAll(.*)",
      component: () => import(/* webpackChunkName: "404" */ "../views/404.vue")
   }, {
      name: "Builder",
      path: "/builder",
      component: () => import(/* webpackChunkName: "builder" */ "../views/Builder.vue")
   }]
});
