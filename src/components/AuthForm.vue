<template>
  <div class="auth-card">
    <h2 class="title">{{ title }}</h2>
    <form @submit.prevent="handleSubmit">
      <slot />
      <button class="submit-btn" type="submit">{{ buttonText }}</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  buttonText: string
  onSubmit: () => void
}>()

function handleSubmit() {
  console.log('submit capturado en AuthForm')
  props.onSubmit()
}
</script>


<style scoped>
.auth-card {
  background: #161626;
  padding: 2rem;
  border-radius: 1rem;
  color: #f0f0f0;
  width: 100%;
  max-width: 400px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00bfff;
}
.submit-btn {
  margin-top: 1rem;
  width: 100%;
  background: #ff69b4;
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
