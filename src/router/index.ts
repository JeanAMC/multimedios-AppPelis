import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import MyShowView from '@/views/MyShowView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DetallesView from '@/views/DetallesView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import SearchView from '../views/SearchView.vue'; 
import UserListView from '../views/UserListView.vue';
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },

    {
      path: '/',
      name: 'main',
      component: () => import('../layouts/MovieLayout.vue'),
       meta: { requiresAuth: true },
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
          path: 'search',
          name: 'Search',
          component: SearchView,

        },
        {
          path: 'my-lists/:listName', 
          name: 'UserList',
          component: UserListView,

        },
        {
         path: 'NotificationsView',
         name: 'NotificationsView',
         component: NotificationsView,

      },
      ],
    },
    
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})



router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.token) {
    return next('/login')
  }
  next()
})

export default router