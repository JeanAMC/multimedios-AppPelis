<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTvShowsStore } from '../stores/tvShows';
import AddToListModal from '../components/AddToListModal.vue';
import VideoPlayerModal from '../components/VideoPlayerModal.vue';

const route = useRoute();
const showsStore = useTvShowsStore();
const show = computed(() => showsStore.selectedShow);

// Estado para controlar la visibilidad de los modales
const isAddModalVisible = ref(false);
const trailerToPlay = ref<string | null>(null);

// Carga los detalles del show cuando el componente se monta
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
    <div class="backdrop" :style="{ backgroundImage: `url(${show.image_url})` }"></div>
    
    <div class="content">
      <h1 class="title">{{ show.name }}</h1>
      <p v-if="show.overview" class="overview">{{ show.overview }}</p>

      <div class="main-actions">
        <button class="manage-button" @click="isAddModalVisible = true">
          ➕ Añadir a una lista
        </button>
      </div>

      <section v-if="show.characters?.length" class="section">
        <h2 class="section-title">Reparto</h2>
        <div class="horizontal-scroll">
          <div v-for="actor in show.characters" :key="actor.id" class="cast-card">
            <img :src="actor.image ?? ''" :alt="actor.name" class="cast-img" />
            <p class="cast-name">{{ actor.name }}</p>
          </div>
        </div>
      </section>

      <section v-if="show.trailers && show.trailers.length > 0" class="section">
        <h2 class="section-title">Trailers</h2>
        <div class="horizontal-scroll">
          <div 
            v-for="trailer in show.trailers" 
            :key="trailer.id" 
            class="trailer-card" 
            @click="trailerToPlay = trailer.videoId"
          >
            <img :src="`https://i.ytimg.com/vi/${trailer.videoId}/hqdefault.jpg`" :alt="trailer.name" class="trailer-img">
            <div class="play-icon">▶</div>
            <p class="trailer-name">{{ trailer.name }}</p>
          </div>
        </div>
      </section>

      <section v-if="show.artworks?.length" class="section">
        <h2 class="section-title">Imágenes</h2>
        <div class="horizontal-scroll artworks">
          <img v-for="art in show.artworks" :key="art.id" :src="art.image" class="art-img" />
        </div>
      </section>

      <section v-if="show.nextAired" class="section">
        <h2 class="section-title">Próximo Episodio</h2>
        <p class="next-ep">{{ show.nextAired.airDate }} - {{ show.nextAired.name }}</p>
      </section>

      <section v-if="show.seasons?.length" class="section">
        <h2 class="section-title">Temporadas</h2>
        <ul class="seasons-list">
          <li v-for="season in show.seasons" :key="season.id">
            Temporada {{ season.number }} — {{ season.episodes_count }} episodios
          </li>
        </ul>
      </section>
    </div>
  </div>

  <div v-else>
    <p class="loading">Cargando...</p>
  </div>

  <AddToListModal
    v-if="isAddModalVisible && show"
    :show="show"
    @close="isAddModalVisible = false"
  />
  <VideoPlayerModal
    v-if="trailerToPlay"
    :video-id="trailerToPlay"
    @close="trailerToPlay = null"
  />
</template>

<style scoped>
/* Estilos generales y del layout */
.details-container {
  position: relative;
  color: white;
  padding-bottom: 50px;
  background-color: #121212;
}
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40vh;
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #121212 10%, rgba(18, 18, 18, 0.5) 100%);
}
.content {
  position: relative;
  z-index: 2;
  padding: 30vh 20px 0;
  max-width: 1200px;
  margin: 0 auto;
}
.title {
  font-size: 2.5rem;
  margin: 0;
  text-align: center;
}
.overview {
  max-width: 700px;
  margin: 20px auto 30px;
  color: #e0e0e0;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
}
.main-actions {
    display: flex;
    justify-content: center;
    margin: 20px 0 40px;
}
.manage-button {
  background-color: #8A72DB;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}
.manage-button:hover {
    transform: scale(1.05);
}

/* Estilos para las secciones de contenido */
.section {
  margin-top: 40px;
}
.section-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #ffdd57;
}

/* --- CAMBIO APLICADO AQUÍ --- */
.horizontal-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  /* Oculta la barra de scroll en Firefox */
  scrollbar-width: none;
  /* Oculta la barra de scroll en IE y Edge */
  -ms-overflow-style: none;
}
/* Oculta la barra de scroll en navegadores Webkit (Chrome, Safari, etc.) */
.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

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
.artworks {
  gap: 10px;
}
.art-img {
  width: 200px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}
.next-ep {
  font-size: 1rem;
  color: #bbb;
}
.seasons-list {
  list-style: none;
  padding: 0;
}
.seasons-list li {
  margin: 6px 0;
  color: #aaa;
  background-color: #1f1f1f;
  padding: 10px;
  border-radius: 6px;
}
.loading {
  padding: 40px;
  text-align: center;
  font-size: 1.3rem;
  color: #ccc;
}

/* Estilos para los cards de Trailer */
.trailer-card {
  position: relative;
  flex: 0 0 250px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background-color: #1f1f1f;
  transition: transform 0.2s ease-in-out;
}
.trailer-card:hover {
  transform: scale(1.03);
}
.trailer-card .trailer-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.trailer-card .play-icon {
  position: absolute;
  top: 70px; /* Centrado verticalmente en la imagen */
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
}
.trailer-name {
  padding: 10px;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>