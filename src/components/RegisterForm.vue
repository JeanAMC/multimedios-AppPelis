<template>
  <div class="app-title">AppPelis</div>
  <div class="register-form">
    <h2 class="form-title">Registrarse</h2>
    <AuthForm title="" buttonText="Crear cuenta" :onSubmit="onSubmit">
      <input v-model="name" placeholder="Nombre" type="text" class="input" required />
      <input v-model="email" placeholder="Email" type="email" class="input" required />
      <input v-model="password" placeholder="Contraseña" type="password" class="input" required />
      <input v-model="confirmPassword" placeholder="Confirmar contraseña" type="password" class="input" required />
    </AuthForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthForm from '@/components/AuthForm.vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const authStore = useAuthStore()
const router = useRouter()

const onSubmit = async () => {
  if (!name.value) {
    alert('El nombre es obligatorio')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }
  try {
    await authStore.register(name.value, email.value, password.value, confirmPassword.value)
    router.push('/MainView')
  } catch (err) {
    alert('Error al registrar')
    console.error(err)
  }
}
</script>


<style scoped>
.register-form {
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