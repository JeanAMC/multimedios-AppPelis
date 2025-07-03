import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi, getUser, register as registerApi } from '@/services/auth'



interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)

  setAuthHeader(token.value)

    async function login(email: string, password: string) {
      const data = await loginApi(email, password);
      
      token.value = data.token;
      user.value = data.user;

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setAuthHeader(data.token);
    }


  async function logout() {
    try {
      await logoutApi()
    } catch (e) {
      console.warn('Error cerrando sesión, se limpiará igual.')
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    token.value = null
    user.value = null
    setAuthHeader(null)
  }

async function register(name: string, email: string, password: string, password_confirmation: string) {
  const data = await registerApi(name, email, password, password_confirmation);

  token.value = data.token;
  user.value = data.user;

  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));

  setAuthHeader(data.token);
}


  async function checkAuth() {
    if (token.value) {
      try {
        const data = await getUser()
        user.value = data
        localStorage.setItem('auth_user', JSON.stringify(data))
      } catch (e) {
        console.warn('token inválido, limpiando sesión')
        await logout()
      }
    }
  }


  checkAuth()

  return {
    user,
    token,
    login,
    logout,
    checkAuth, 
    register
  }
})

function setAuthHeader(token: string | null) {
  import('@/services/axios').then(({ default: api }) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  })
}
