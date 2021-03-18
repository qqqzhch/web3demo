import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/swap/swap.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/buildr/guide'
    // component: Home,
  },
  {
    path: "/playground",
    name: "playground",
    component: () => import("@/views/playground/index.vue"),
  },
  {
    path: "/exchange",
    // name: "exchange",
    component: () => import("@/views/swap/Menu.vue"),
    children: [
      {
        path: "",
        name: "swap",
        component: () => import("@/views/swap/swap.vue"),
      },
      {
        path: "pool",
        name: "pool",
        component: () => import("@/views/swap/liquidityPool.vue"),
      },
      {
        path: "history",
        name: "history",
        component: () => import("@/views/swap/history.vue")
      },
    ]
  },
  {
    path: "/earn",
    // name: "earn",
    component: () => import("@/views/earn/index.vue"),
    children: [
      {
        path: "",
        name: "rewardMine",
        component: () => import("@/views/earn/rewardMine/index.vue"),
      },
      {
        path: "myMine",
        name: "myMine",
        component: () => import("@/views/earn/myMine/index.vue"),
      },
      {
        path: "history",
        name: "earn-history",
        component: () => import("@/views/earn/history/index.vue")
      },
    ]
  },

  {
    path: "/buildr",
    // name: "buildr",
    component: () => import("@/views/buildr/index.vue"),
    children: [
      {
        path: "",
        name: "balance",
        component: () => import("@/views/buildr/balance/index.vue"),
      },
      {
        path: "balance",
        name: "balance",
        component: () => import("@/views/buildr/balance/index.vue"),
      },
      {
        path: "create",
        name: "create",
        component: () => import("@/views/buildr/create/index.vue"),
      },
      {
        path: "history",
        name: "history",
        component: () => import("@/views/buildr/history/index.vue")
      },
      {
        path: "guide",
        name: "guide",
        component: () => import("@/views/buildr/guide/index.vue")
      },
    ]
  },
  {
    path: "/buildrtest",
    name: "buildrtest",
    component: () => import("@/views/playground/buildr.vue"),
  }
];

const router = new VueRouter({
  routes,
});

export default router;
