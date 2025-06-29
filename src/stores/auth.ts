import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  function login(email: string, password: string) {
    console.log('Login con:', email, password)
    user.value = { email }
  }

  function register(email: string, password: string) {
    console.log('Registro con:', email, password)
    user.value = { email }
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    login,
    register,
    logout,
  }
})
