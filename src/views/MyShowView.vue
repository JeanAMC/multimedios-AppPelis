<script setup lang="ts">
import { computed } from 'vue';
import { useUserListStore } from '../stores/userList';
import { RouterLink } from 'vue-router';
import type { Show } from '../stores/tvShows'; 
import SearchBar from '../components/SearchBar.vue'; 

const userListStore = useUserListStore();

// Usamos las propiedades computadas directamente desde la store
const watchlist = computed(() => userListStore.watchlist);
const watched = computed(() => userListStore.watched);
const favorites = computed(() => userListStore.favorites);
const watching = computed(() => userListStore.watching);

// Función para obtener la portada de las carpetas
const getFolderCover = (list: Show[], index: number): string => {
  if (list && list.length > index) {
    return list[index].image_url ?? '';
  }
  // Retorna una imagen transparente si no hay show para esa posición
  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
};
</script>

<template>
  <div class="myshows-container">
    <SearchBar /> <nav class="tabs">
      <button class="tab active">TV series</button>
      <button class="tab">Movies</button>
    </nav>

    <section class="lists-grid">
      <RouterLink to="/my-lists/watchlist" class="list-link">
        <div class="list-folder">
          <div class="thumbnail-grid">
            <img :src="getFolderCover(watchlist, 0)" alt="" />
            <img :src="getFolderCover(watchlist, 1)" alt="" />
            <img :src="getFolderCover(watchlist, 2)" alt="" />
            <img :src="getFolderCover(watchlist, 3)" alt="" />
          </div>
          <div class="folder-info">
            <span>👁️</span>
            <p>Watchlist</p>
            <span>{{ watchlist.length }}</span>
          </div>
        </div>
      </RouterLink>

      <RouterLink to="/my-lists/watched" class="list-link">
        <div class="list-folder">
          <div class="thumbnail-grid">
            <img :src="getFolderCover(watched, 0)" alt="" />
            <img :src="getFolderCover(watched, 1)" alt="" />
            <img :src="getFolderCover(watched, 2)" alt="" />
            <img :src="getFolderCover(watched, 3)" alt="" />
          </div>
          <div class="folder-info">
            <span>✅</span>
            <p>Watched</p>
            <span>{{ watched.length }}</span>
          </div>
        </div>
      </RouterLink>

      <RouterLink to="/my-lists/favorites" class="list-link">
        <div class="list-folder">
          <div class="thumbnail-grid">
            <img :src="getFolderCover(favorites, 0)" alt="" />
            <img :src="getFolderCover(favorites, 1)" alt="" />
            <img :src="getFolderCover(favorites, 2)" alt="" />
            <img :src="getFolderCover(favorites, 3)" alt="" />
          </div>
          <div class="folder-info">
            <span>⭐</span>
            <p>Favorites</p>
            <span>{{ favorites.length }}</span>
          </div>
        </div>
      </RouterLink>
    </section>

    <section class="watching-section">
      <div class="watching-header">
        <h2>Watching</h2>
        <button>⋮</button>
      </div>
      <div class="watching-list">
        <article v-for="show in watching" :key="show.id" class="watching-item">
          <img :src="show.image_url" :alt="show.name" class="watching-poster" />
          <div class="watching-info">
            <h3>{{ show.name }}</h3>
            <p class="episode-details" v-if="show.progress">
              s0{{ show.progress.season }}e0{{ show.progress.episode }}
            </p>
            <div class="progress-bar" v-if="show.progress">
              <div class="progress" :style="{ width: (show.progress.episode / show.progress.totalEpisodes) * 100 + '%' }"></div>
            </div>
            <div class="progress-text" v-if="show.progress">
              <span>{{ show.progress.episode }}/{{ show.progress.totalEpisodes }}</span>
              <span>{{ show.progress.totalEpisodes - show.progress.episode }} left</span>
            </div>
            <div class="watching-actions">
              <button class="watched-button">Watched</button>
              <RouterLink :to="`/series/${show.id}`" class="summary-link">Summary</RouterLink>
            </div>
          </div>
        </article>
         <div v-if="watching.length === 0" class="empty-list-message">
          <p>No estás viendo ninguna serie ahora mismo.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilos existentes (no necesitan cambios) */
.list-link {
  text-decoration: none;
  color: inherit;
}
.myshows-container {
  background-color: #1F1D2B;
  padding: 15px;
  color: white;
  min-height: 100vh;
}
.tabs {
  display: flex;
  background-color: #333140;
  border-radius: 25px;
  padding: 4px;
  margin-bottom: 20px;
}
.tab {
  flex: 1;
  padding: 8px;
  border: none;
  background-color: transparent;
  color: #aaa;
  font-weight: bold;
  border-radius: 20px;
  cursor: pointer;
}
.tab.active {
  background-color: #4A475C;
  color: white;
}
.lists-grid {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 25px;
}
.list-folder {
  background-color: #252836;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 160px;
  height: 100%;
  transition: background-color 0.2s;
}
.list-folder:hover {
  background-color: #333140;
}
.thumbnail-grid {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  height: 140px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
}
.thumbnail-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #333140;
}
.folder-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}
.folder-info p {
  margin: 0;
  font-weight: bold;
  flex-grow: 1;
}
.watching-section .watching-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.watching-header h2 {
  margin: 0;
}
.watching-header button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}
.watching-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.watching-item {
  display: flex;
  gap: 15px;
  background-color: #252836;
  padding: 12px;
  border-radius: 16px;
}
.watching-poster {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.watching-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.watching-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}
.episode-details {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0 0 10px;
}
.progress-bar {
  background-color: #1F1D2B;
  border-radius: 10px;
  height: 6px;
  overflow: hidden;
}
.progress {
  background-color: #8A72DB;
  height: 100%;
}
.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #aaa;
  margin: 4px 0 10px;
}
.watching-actions {
  display: flex;
  gap: 15px;
  margin-top: auto;
}
.watched-button {
  flex-grow: 1;
  background-color: #8A72DB;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-weight: bold;
}
.summary-link {
  flex-grow: 1;
  background-color: #333140;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  font-weight: bold;
}
.empty-list-message {
  background-color: #252836;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  color: #aaa;
}
</style>