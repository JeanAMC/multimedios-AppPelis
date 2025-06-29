<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTvShowsStore } from '../stores/tvShows';

const route = useRoute();
const showsStore = useTvShowsStore();

const show = computed(() => showsStore.selectedShow);

onMounted(() => {
  const showId = route.params.id as string;
  // Determinamos el tipo basado en la URL
  const type = route.path.includes('/movie/') ? 'movie' : 'series';
  
  if (showId) {
    // Llamamos a la nueva acción con el ID y el tipo
    showsStore.fetchDetails(showId, type);
  }
});
</script>

<template>
  <div v-if="show" class="detail-view">
    <h1>{{ show.name }}</h1>
    <p v-if="show.overview">{{ show.overview }}</p>

    <template v-if="show.type === 'series'">
      <section v-if="show.nextAired">
        <h2>Next Episode</h2>
        <p>
          <strong>{{ show.nextAired.name }}</strong> - {{ show.nextAired.airDate }}
        </p>
      </section>
      
      <section v-if="show.seasons && show.seasons.length > 0">
        <h2>Seasons</h2>
        <ul>
          <li v-for="season in show.seasons" :key="season.id">
            Season {{ season.number }} ({{ season.episodes_count }} episodes)
          </li>
        </ul>
      </section>
    </template>

    <template v-if="show.type === 'movie'">
      <section v-if="show.runtime">
        <h2>Runtime</h2>
        <p>{{ show.runtime }} minutes</p>
      </section>
    </template>

    <section v-if="show.characters && show.characters.length > 0">
      <h2>Cast</h2>
      <div class="cast-list">
        <div v-for="actor in show.characters" :key="actor.id" class="cast-member">
          <img v-if="actor.image" :src="actor.image" :alt="actor.name" class="cast-img" />
          <div>
            <strong>{{ actor.name }}</strong>
            <span v-if="actor.role">as {{ actor.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="show.artworks && show.artworks.length > 0">
      <h2>Images</h2>
      <div class="artworks-list">
        <img
          v-for="art in show.artworks"
          :key="art.id"
          :src="art.image"
          alt="Artwork"
          class="artwork-img"
        />
      </div>
    </section>

  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.cast-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.cast-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}
.cast-img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.artworks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}
.artwork-img {
  width: 200px;
 height: auto;
  border-radius: 8px;
}
</style>