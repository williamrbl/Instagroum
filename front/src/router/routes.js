const routes = [
  {
    path: "/",
    component: () => import("layouts/LayoutLogins.vue"),
    children: [
      { path: "/", component: () => import("src/pages/loginPage.vue") },
      {
        path: "/passwordForgotten",
        component: () => import("src/pages/passwordForgotten.vue"),
      },
      {
        path: "/createAccount",
        component: () => import("src/pages/createAccount.vue"),
      },
    ],
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/home", component: () => import("src/pages/HomePage.vue") },
      { path: "/camera", component: () => import("src/pages/CameraPage.vue") },
    ],
  },
  {
    path: "/credits",
    component: () => import("layouts/CreditsLayout.vue"),
    children: [
      { path: "/credits", component: () => import("src/pages/credits.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
