import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Paint from "../views/Paint.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes: [
//     {
//       path: "/",
//       name: "home",
//       component: Home,
//     },
//     {
//       path: "/home",
//       name: "home",
//       component: Home,
//       meta: {
//         isAuth: true,
//       },
//     },
//     {
//       path: "/paint",
//       name: "paint",
//       component: Paint,
//       meta: {
//         isAuth: true,
//       },
//     },
//     {
//       path: "/login",
//       name: "login",
//       component: Login,
//       meta: {
//         isAuth: false,
//       },
//     },
//     {
//       path: "/register",
//       name: "register",
//       component: Register,
//       meta: {
//         isAuth: false,
//       },
//     },
//   ],
// });

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     next("/login");
//   }
//   const allowedPaths = ["/login", "/register"];
//   if (token && allowedPaths.includes(to.path)) {
//     next("/home");
//   }
//   next();
// });

// export default router;

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

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.isAuth)) {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/login");
    }
    const allowedPaths = ["/login", "/register"];
    if (token && allowedPaths.includes(to.path)) {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
