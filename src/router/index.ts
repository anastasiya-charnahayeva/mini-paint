import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Paint from "../views/Paint.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

import { onAuthStateChanged } from "firebase/auth";
import { fbAuth } from "../firebase/index";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/paint",
    name: "paint",
    component: Paint,
    meta: {
      isAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      isAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      isAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const user = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(fbAuth, (currentUser) => {
      resolve(currentUser);
    });
  });
};

router.beforeEach(async (to, from, next) => {
  const res = await user();
  const allowedPaths = ["/login", "/register"];
  if (to.matched.some((route) => route.meta.isAuth)) {
    !res ? next("/login") : next();
    ("/");
  } else {
    res && allowedPaths.includes(to.path) ? next("/") : next();
  }
});

export default router;
