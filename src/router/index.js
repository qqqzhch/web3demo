import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/vault'
  },
  {
    path: "/vault",
    component: () => import("@/views/vault/index.vue"),
    children: [
      {
        path: "",
        name: "balance",
        component: () => import("@/views/vault/balance/index.vue"),
      },
      {
        path: "balance",
        name: "balance",
        component: () => import("@/views/vault/balance/index.vue"),
      },
      {
        path: "create",
        name: "create",
        component: () => import("@/views/vault/create/index.vue"),
      },
    ]
  },

  {
    path: "/stabilityPool",
    name: "stabilityPool",
    component: () => import("@/views/stabilityPool/index.vue"),
  },
  {
    path: "/babelPool",
    name: "babelPool",
    component: () => import("@/views/babelPool/index.vue"),
  },
  {
    path: "/lpPool",
    name: "lpPool",
    component: () => import("@/views/lpPool/index.vue"),
  },


  {
    path: "/playground",
    name: "playground",
    component: () => import("@/views/playground/index.vue"),
  },
  {
    path: "/buildrtest",
    name: "buildrtest",
    component: () => import("@/views/playground/buildr.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
