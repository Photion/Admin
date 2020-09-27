import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

import { ready } from '~/src/state/service';

Vue.use(Router);

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

export const routes: Array<RouteConfig> = [
  // Index
  createRoute('Index'),

  // Services
  createRoute('Services/Index'),
  createRoute('Services/Aws'),
  createRoute('Services/Gcp'),
  createRoute('Services/GoogleDrive'),
  createRoute('Services/Browser'),

  // Concepts
  createRoute('Concepts/Index'),
  createRoute('Concepts/_uuid'),
];

export const router = new Router({
  mode: 'history',
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
