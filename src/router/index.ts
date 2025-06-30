import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import MyShowView from '@/views/MyShowView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DetallesView from '@/views/DetallesView.vue'
import NotificationsView from '@/views/NotificationsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas (sin layout)
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    // Rutas protegidas o que usan MovieLayout
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
        {
          path: 'movie/:id',
          name: 'MovieDetails',
          component: DetallesView,
        },
        {
          path: 'series/:id',
          name: 'SeriesDetails',
          component: DetallesView,
        },
        {
         path: 'NotificationsView',
         name: 'NotificationsView',
         component: NotificationsView,
      },
      ],
    },
    // Redirección por defecto a login
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

export default router