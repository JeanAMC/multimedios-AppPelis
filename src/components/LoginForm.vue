<template>
  <div class="app-title">AppPelis</div>
  <div class="login-form">
    <h2 class="form-title">Iniciar sesión</h2>
    <AuthForm title="" buttonText="Entrar" :onSubmit="onSubmit">
      <input v-model="email" placeholder="Email" type="email" class="input" required />
      <input v-model="password" placeholder="Contraseña" type="password" class="input" required />
    </AuthForm>
    <div class="register-link">
      ¿No tienes cuenta?
      <RouterLink to="/register">Regístrate</RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthForm from '@/components/AuthForm.vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const onSubmit = () => {
  authStore.login(email.value, password.value)
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.form-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #00bfff;
  text-align: center;
}
.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  background: #222;
  color: #fff;
}
.register-link {
  margin-top: 1rem;
  text-align: center;
  color: #ccc;
  font-size: 1rem;
}
.register-link a {
  color: #ff69b4;
  text-decoration: underline;
  margin-left: 0.3rem;
  transition: color 0.2s;
}
.register-link a:hover {
  color: #00bfff;
}
.app-title {
  position: absolute;
  top: 24px;
  left: 32px;
  font-size: 2rem;
  font-weight: bold;
  color: #ff69b4;
  letter-spacing: 2px;
  z-index: 10;
}
</style>