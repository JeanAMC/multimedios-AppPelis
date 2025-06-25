import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import MyShowView from '@/views/MyShowView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../layouts/MovieLayout.vue'),
      children: [
        {
          path: 'MainView',
          name: 'MainView',
          component: MainView,
        },
        {
          path: 'MyShowView',
          name: 'MyShowView',
          component: MyShowView,
        },
      ]
    },
  ],
})

export default router
