<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useUserListStore } from '../stores/userList';
import type { Show } from '../stores/tvShows';

const route = useRoute();
const router = useRouter();
const userListStore = useUserListStore();

// Obtenemos el nombre de la lista desde la URL (e.g., 'watchlist', 'watched')
const listName = computed(() => route.params.listName as string);

// Dependiendo del nombre de la lista, obtenemos el array correspondiente de la store
const items = computed((): Show[] => {
  switch (listName.value) {
    case 'watchlist':
      return userListStore.watchlist;
    case 'watched':
      return userListStore.watched;
    case 'favorites':
      return userListStore.favorites;
    default:
      return [];
  }
});

// Genera un título dinámico para la página
const pageTitle = computed(() => {
  if (!listName.value) return 'Mi Lista';
  return `Mi ${listName.value.charAt(0).toUpperCase() + listName.value.slice(1)}`;
});
</script>

<template>
  <div class="list-view-container">
    <div class="header">
      <button @click="router.back()" class="back-button">← Volver</button>
      <h1>{{ pageTitle }}</h1>
    </div>

    <div v-if="items.length > 0" class="items-grid">
      <RouterLink
        v-for="item in items"
        :key="item.id"
        :to="`/${item.type}/${item.id}`"
        class="item-card"
      >
        <img :src="item.image_url ?? ''" :alt="item.name" class="poster">
        <p>{{ item.name }}</p>
      </RouterLink>
    </div>

    <div v-else class="empty-list">
      <p>Aún no has añadido nada a esta lista.</p>
    </div>
  </div>
</template>

<style scoped>
.list-view-container {
  padding: 20px;
  color: white;
}
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.back-button {
  background: #252836;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}
.header h1 {
  margin: 0;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
.item-card {
  background-color: #252836;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
}
.item-card:hover {
  transform: scale(1.05);
}
.poster {
  width: 100%;
  height: 240px;
  object-fit: cover;
  background-color: #333;
}
.item-card p {
  margin: 0;
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.empty-list {
  text-align: center;
  margin-top: 50px;
  color: #888;
}
</style>