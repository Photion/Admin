import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { ready } from '~/src/state/service';

interface RouteOptions {
  alias?: string;
}

export const createRoute = (name: string, options: RouteOptions = {}) => {
  const component = () => import(/* webpackChunkName: "[request]" */ `./pages/${name}.vue`);

  return {
    name,
    component,
    path: `/${name}`.toLowerCase().replace(/_/g, ':').replace('index', ''),
    ...options,
  };
};

export const routes: Array<RouteRecordRaw> = [
  // Index
  createRoute('Index'),

  // Services
  createRoute('Services/Index'),
  createRoute('Services/Aws'),
  createRoute('Services/Gcp'),
  createRoute('Services/GoogleDrive'),
  createRoute('Services/Browser'),

  // Folders
  createRoute('Folders/Index'),
  createRoute('Folders/_uuid'),
];

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next();
  }

  if (!ready.value) {
    if (!to.path.startsWith('/services')) {
      return next('/services');
    }
  }
  next();
});
