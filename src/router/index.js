import Vue from "vue";
import VueRouter from "vue-router";

import Volumes from "../views/Volumes.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Volumes",
    component: Volumes,
  },
	{
    path: "/volume/:volumeId",
    name: "Volume",
    component: () => import('../views/Volume.vue'),
  },
	{
    path: "/volume/:volumeId/artigo/:articleId",
    name: "Article",
    component: () => import('../views/Article.vue'),
  },
	{
    path: "/artigo/:articleId/autor/:authorId",
    name: "Author",
    component: () => import('../views/Author.vue'),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
