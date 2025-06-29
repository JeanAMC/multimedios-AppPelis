<template>
  <div class="auth-container">
    <RegisterForm />
  </div>
</template>

<script lang="ts" setup>
import RegisterForm from '@/components/RegisterForm.vue'
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0c0c1b;
}
</style>
