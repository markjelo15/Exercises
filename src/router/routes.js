const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", // Default route
        name: "list-users", // Default to list-users
        component: () => import("pages/ListUsers.vue"),
      },
      {
        path: "add-user/:id?",
        name: "add-user",
        component: () => import("pages/AddUser.vue"),
      },
    ],
  },
];

export default routes;
