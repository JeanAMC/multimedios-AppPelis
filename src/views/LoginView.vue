<template>
  <div class="auth-container">
    <LoginForm />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue'
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
