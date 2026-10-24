import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from '@usevibejs/ui/router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vibe') },
  {
    path: '/docs',
    name: 'introduction',
    component: () => import('./pages/DocPage.vibe'),
    props: { page: 'docs/introduction' },
  },
  {
    path: '/docs/components/:name',
    name: 'component',
    component: () => import('./pages/DocPage.vibe'),
    props: (to) => ({ page: `components/${to.params.name}` }),
  },
  {
    path: '/docs/:slug',
    name: 'guide',
    component: () => import('./pages/DocPage.vibe'),
    props: (to) => ({ page: `docs/${to.params.slug}` }),
  },
  { path: '/:path*', name: 'not-found', component: () => import('./pages/NotFound.vibe') },
];

export const router: Router = createRouter({ history: createWebHistory(), routes });
