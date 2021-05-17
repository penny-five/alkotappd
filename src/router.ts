import * as VueRouter from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'store-search',
    path: '/',
    component: () => import('./pages/store-search.vue')
  },
  {
    name: 'store',
    path: '/store/:id/:slug',
    component: () => import('./pages/store.vue')
  }
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});
