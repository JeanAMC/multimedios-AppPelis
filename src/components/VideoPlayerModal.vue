<script setup lang="ts">
defineProps<{
  videoId: string;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="video-container">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <button @click="emit('close')" class="close-button">X</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.video-container {
  position: relative;
  width: 90%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
}

.video-container iframe {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: -35px;
  right: -15px;
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
}
</style>