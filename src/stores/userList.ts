import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Show } from './tvShows'

// Interfaz para un show que se está viendo y tiene progreso
export interface WatchingShow extends Show {
  progress: {
    season: number
    episode: number
    totalEpisodes: number
  }
}

// Función para obtener datos de localStorage de forma segura
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof localStorage === 'undefined') {
    return defaultValue;
  }
  const stored = localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;
  }
};

export const useUserListStore = defineStore('userList', () => {
  // --- STATE ---
  // Las listas se inicializan con datos de localStorage o como objetos vacíos
  const watchlist = ref<Record<number, Show>>(getFromStorage('user_watchlist', {}));
  const favorites = ref<Record<number, Show>>(getFromStorage('user_favorites', {}));
  const watched = ref<Record<number, Show>>(getFromStorage('user_watched', {}));
  const watching = ref<Record<number, WatchingShow>>(getFromStorage('user_watching', {}));

  // --- GETTERS ---
  // Convierten los objetos a arrays para usarlos fácilmente en los v-for de Vue
  const watchlistArray = computed(() => Object.values(watchlist.value));
  const favoritesArray = computed(() => Object.values(favorites.value));
  const watchedArray = computed(() => Object.values(watched.value));
  const watchingArray = computed(() => Object.values(watching.value));

  // --- PERSISTENCIA ---
  // Observadores que guardan los cambios de cada lista en localStorage
  watch(watchlist, (val) => localStorage.setItem('user_watchlist', JSON.stringify(val)), { deep: true });
  watch(favorites, (val) => localStorage.setItem('user_favorites', JSON.stringify(val)), { deep: true });
  watch(watched, (val) => localStorage.setItem('user_watched', JSON.stringify(val)), { deep: true });
  watch(watching, (val) => localStorage.setItem('user_watching', JSON.stringify(val)), { deep: true });

  // --- ACTIONS ---
  // Funciones para manipular las listas

  function toggleWatchlist(show: Show) {
    if (watchlist.value[show.id]) {
      delete watchlist.value[show.id];
    } else {
      watchlist.value[show.id] = show;
      // Si se añade a watchlist, se quita de 'watched'
      if (watched.value[show.id]) delete watched.value[show.id];
    }
  }

  function toggleFavorites(show: Show) {
    if (favorites.value[show.id]) {
      delete favorites.value[show.id];
    } else {
      favorites.value[show.id] = show;
    }
  }

  function toggleWatched(show: Show) {
    if (watched.value[show.id]) {
      delete watched.value[show.id];
    } else {
      watched.value[show.id] = show;
      // Si se marca como visto, se quita de 'watchlist' y 'watching'
      if (watchlist.value[show.id]) delete watchlist.value[show.id];
      if (watching.value[show.id]) delete watching.value[show.id];
    }
  }
  
  function startWatching(show: Show, totalEpisodes: number = 10) {
      if(watching.value[show.id]) return;

      watching.value[show.id] = {
        ...show,
        progress: { season: 1, episode: 1, totalEpisodes: totalEpisodes }
      };

      // Si se empieza a ver, se quita de 'watchlist' y 'watched'
      if (watchlist.value[show.id]) delete watchlist.value[show.id];
      if (watched.value[show.id]) delete watched.value[show.id];
  }

  function updateEpisodeProgress(showId: number) {
    const show = watching.value[showId];
    if (show && show.progress.episode < show.progress.totalEpisodes) {
        show.progress.episode++;
    } else if (show) {
        // Si se completa el último episodio, se mueve a 'watched'
        toggleWatched(show);
    }
  }

  // --- RETURN ---
  // Se exponen todas las propiedades y funciones necesarias para los componentes
  return {
    // Arrays para mostrar en las vistas
    watchlist: watchlistArray,
    favorites: favoritesArray,
    watched: watchedArray,
    watching: watchingArray,
    
    // Acciones para manipular las listas
    toggleWatchlist,
    toggleFavorites,
    toggleWatched,
    startWatching,
    updateEpisodeProgress,
    
    // Funciones "helper" para saber el estado de un show
    isInWatchlist: (id: number) => !!watchlist.value[id],
    isInFavorites: (id: number) => !!favorites.value[id],
    isInWatched: (id: number) => !!watched.value[id],
    isWatching: (id: number) => !!watching.value[id],
  }
})