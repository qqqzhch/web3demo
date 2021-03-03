import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/swap/swap.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/playground",
    name: "playground",
    component: () => import("@/views/playground/index.vue"),
  },
  {
    path: "/history",
    name: "history",
    component: () => import("@/views/swap/history.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
