
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
    ],
  },
  {
    path: '/posts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/posts/:id', component: () => import('pages/ViewTopic.vue'), props: (route) => ({ query: route.query.q }) },
      { path: '/posts/:id/edit', component: () => import('pages/Error404.vue') },
      { path: '/posts/create', component: () => import('pages/Error404.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
