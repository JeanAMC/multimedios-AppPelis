<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router'; // Aseguramos que RouterLink esté disponible
import { useTvShowsStore } from '../stores/tvShows';
import SearchBar from '../components/SearchBar.vue'; 

const showsStore = useTvShowsStore();

const recommendedMovies = computed(() => showsStore.recommendedMovies);
const popularShows = computed(() => showsStore.popularShows);

onMounted(() => {
  // Evitamos llamar a las funciones si ya tenemos datos para no recargar innecesariamente
  if (showsStore.recommendedMovies.length === 0) {
    showsStore.fetchPopularMovies();
  }
  if (showsStore.popularShows.length === 0) {
    showsStore.fetchPopularShows();
  }
});
</script>

<template>
  <main class="main-view-container">
    <SearchBar />

    <section class="recommended">
      <h2>Recommended Movies</h2>
      <div class="scroll-container">
        <div class="card-list horizontal-scroll">
          <RouterLink
            v-for="movie in recommendedMovies"
            :key="movie.id"
            :to="`/movie/${movie.id}`"
            class="card-link"
          >
            <article class="card">
              <img :src="movie.image_url ?? ''" :alt="movie.name ?? ''" />
              <p>{{ movie.name }}</p>
            </article>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="popular">
      <h2>Popular TV Series</h2>
      <div class="card-list horizontal-scroll">
        <RouterLink
          v-for="show in popularShows"
          :key="show.id"
          :to="`/series/${show.id}`"
          class="card-link"
        >
          <article class="card">
            <img :src="show.image_url ?? ''" :alt="show.name ?? ''" />
            <p>{{ show.name }}</p>
          </article>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>

.main-view-container {
  padding: 20px;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.scroll-container {
  overflow-x: auto;
  padding-bottom: 15px;
}
.card-list {
  display: flex;
  gap: 20px;
}
.card {
  flex: 0 0 150px;
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: scale(1.05);
  cursor: pointer;
}
.card img {
  width: 100%;
  height: 225px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #2c3e50;
}
.card p {
    margin-top: 8px;
    font-size: 0.9rem;
    white-space: normal;
}
</style>