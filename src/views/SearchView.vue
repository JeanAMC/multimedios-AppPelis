<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTvShowsStore } from '../stores/tvShows';
import { RouterLink } from 'vue-router';

const route = useRoute();
const showsStore = useTvShowsStore();

// Obtenemos los resultados de la búsqueda desde la store
const searchResults = computed(() => showsStore.searchResults);
const query = computed(() => route.query.q as string || '');

// Función para ejecutar la búsqueda
const performSearch = (searchQuery: string) => {
  if (searchQuery) {
    showsStore.searchAll(searchQuery);
  }
};

watch(() => route.query.q, (newQuery) => {
  performSearch(newQuery as string);
}, { immediate: true }); 
</script>

<template>
  <div class="search-view">
    <h1>Resultados para: "{{ query }}"</h1>
    
    <div v-if="searchResults.length > 0" class="results-grid">
      <RouterLink
        v-for="show in searchResults"
        :key="show.id"
        :to="`/${show.type}/${show.id}`"
        class="result-card"
      >
        <img :src="show.image_url ?? 'https://via.placeholder.com/180x270.png?text=No+Image'" :alt="show.name" class="poster">
        <div class="card-info">
          <h3>{{ show.name }}</h3>
          <span class="show-type">{{ show.type }}</span>
        </div>
      </RouterLink>
    </div>
    
    </div>
</template>

<style scoped>
.search-view {
  padding: 20px;
  color: white;
}
.search-view h1 {
  margin-bottom: 30px;
  font-weight: 300;
}
.search-view h1 span {
  font-weight: 700;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
.result-card {
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease-in-out;
}
.result-card:hover {
  transform: scale(1.05);
}
.poster {
  width: 100%;
  height: 240px;
  object-fit: cover;
  background-color: #333;
}
.card-info {
  padding: 10px;
}
.card-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.show-type {
  background-color: #8A72DB;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  text-transform: capitalize;
}
.no-results {
  text-align: center;
  margin-top: 50px;
  color: #888;
}
</style>