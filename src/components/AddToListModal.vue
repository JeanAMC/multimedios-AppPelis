<script setup lang="ts">
import { useUserListStore } from '../stores/userList'
import type { Show } from '../stores/tvShows'

const props = defineProps<{
  show: Show
}>()

const emit = defineEmits(['close'])

const userListStore = useUserListStore()

function handleWatchlist() {
  userListStore.toggleWatchlist(props.show)
  emit('close')
}

function handleFavorites() {
  userListStore.toggleFavorites(props.show)
  emit('close')
}

function handleWatched() {
  userListStore.toggleWatched(props.show)
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      
      <img :src="show.image_url || undefined" :alt="show.name" class="modal-poster">
      <h2>{{ show.name }}</h2>
      <p>Añadir a una de tus listas:</p>
      
      <div class="modal-actions">
        <button @click="handleWatchlist">
          {{ userListStore.isInWatchlist(show.id) ? '✅ En Watchlist' : '👁️ Watchlist' }}
        </button>
        <button @click="handleWatched">
          {{ userListStore.isInWatched(show.id) ? '✅ Visto' : '✅ Marcar como Visto' }}
        </button>
        <button @click="handleFavorites">
          {{ userListStore.isInFavorites(show.id) ? '⭐ En Favoritos' : '⭐ Favoritos' }}
        </button>
      </div>
      
      <button class="close-button" @click="emit('close')">Cancelar</button>
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #2b2b2b;
  padding: 25px;
  border-radius: 16px;
  width: 90%;
  max-width: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}
.modal-content h2 {
  margin: 0 0 10px;
}
.modal-content p {
  color: #ccc;
  margin-top: 0;
}
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin: 15px 0;
}
.modal-actions button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4A475C;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.modal-actions button:hover {
  background-color: #8A72DB;
}
.close-button {
  margin-top: 10px;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
}
</style>

<script lang="ts">
export default {}
</script>