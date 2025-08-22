import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: () => import("../views/LoginView.vue") },
  { path: "/register", component: () => import("../views/RegisterView.vue") },
  {
    path: "/dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.token) auth.loadStateFromStorage();

  if (to.meta.requiresAuth && !auth.token) {
    return { path: "/login" };
  }
});

export default router;
