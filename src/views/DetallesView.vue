<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTvShowsStore } from '../stores/tvShows';

const route = useRoute();
const showsStore = useTvShowsStore();

const show = computed(() => showsStore.selectedShow);

onMounted(() => {
  const showId = route.params.id as string;
  const type = route.path.includes('/movie/') ? 'movie' : 'series';
  if (showId) {
    showsStore.fetchDetails(showId, type);
  }
});
</script>

<template>
  <div v-if="show" class="details-container">
    <!-- Header -->
    <h1 class="title">{{ show.name }}</h1>
    <p v-if="show.overview" class="overview">{{ show.overview }}</p>

    <!-- Cast -->
    <section v-if="show.characters?.length" class="section">
      <h2 class="section-title">Cast</h2>
      <div class="horizontal-scroll">
        <div v-for="actor in show.characters" :key="actor.id" class="cast-card">
          <img :src="actor.image" :alt="actor.name" class="cast-img" />
          <p class="cast-name">{{ actor.name }}</p>
        </div>
      </div>
    </section>

    <!-- Trailer (mocked with main image) -->
    <section v-if="show.image_url" class="section">
      <h2 class="section-title">Trailers</h2>
      <div class="trailer">
        <img :src="show.image_url" :alt="show.name" class="trailer-img" />
        <div class="play-icon">▶</div>
      </div>
    </section>

    <!-- Images / Artworks -->
    <section v-if="show.artworks?.length" class="section">
      <h2 class="section-title">Images</h2>
      <div class="horizontal-scroll artworks">
        <img v-for="art in show.artworks" :key="art.id" :src="art.image" class="art-img" />
      </div>
    </section>

    <!-- Next Episode -->
    <section v-if="show.nextAired" class="section">
      <h2 class="section-title">Next Episode</h2>
      <p class="next-ep">{{ show.nextAired.airDate }} - {{ show.nextAired.name }}</p>
    </section>

    <!-- Seasons -->
    <section v-if="show.seasons?.length" class="section">
      <h2 class="section-title">Seasons</h2>
      <ul class="seasons-list">
        <li v-for="season in show.seasons" :key="season.id">
          Season {{ season.number }} — {{ season.episodes_count }} episodes
        </li>
      </ul>
    </section>
  </div>

  <div v-else>
    <p class="loading">Loading...</p>
  </div>
</template>

<style scoped>
/* Asegura que ocupe toda la pantalla y sea scrollable si excede */
:root {
  --bg-color: #121212;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
}

.details-container {
  min-height: 100vh;
  padding: 20px;
  color: white;
  max-width: 1200px;
  margin: auto;
  box-sizing: border-box;
}

/* Títulos y textos */
.title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.overview {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #ccc;
}

.section {
  margin-top: 40px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #ffdd57;
}

/* Scroll horizontal para listas */
.horizontal-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
}

/* Cast cards */
.cast-card {
  flex: 0 0 auto;
  text-align: center;
  width: 100px;
}

.cast-img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 5px;
}

.cast-name {
  font-size: 0.85rem;
}

/* Trailer */
.trailer {
  position: relative;
  width: 100%;
  max-width: 700px;
}

.trailer-img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  top: 40%;
  left: 45%;
  font-size: 3rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  padding: 10px 15px;
}

/* Artworks */
.artworks {
  gap: 10px;
}

.art-img {
  width: 200px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

/* Next episode */
.next-ep {
  font-size: 1rem;
  color: #bbb;
}

/* Seasons */
.seasons-list {
  list-style: none;
  padding: 0;
}

.seasons-list li {
  margin: 6px 0;
  color: #aaa;
}

/* Loading */
.loading {
  padding: 40px;
  text-align: center;
  font-size: 1.3rem;
  color: #ccc;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .cast-card {
    width: 80px;
  }

  .cast-img {
    width: 70px;
    height: 90px;
  }

  .art-img {
    width: 150px;
  }

  .trailer {
    max-width: 100%;
  }

  .play-icon {
    font-size: 2rem;
    left: 40%;
    top: 40%;
  }
}
</style>
