import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Show } from './tvShows'

export interface WatchingShow extends Show {
  progress: {
    season: number
    episode: number
    totalEpisodes: number
  }
}

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
  const watchlist = ref<Record<number, Show>>(getFromStorage('user_watchlist', {}));
  const favorites = ref<Record<number, Show>>(getFromStorage('user_favorites', {}));
  const watched = ref<Record<number, Show>>(getFromStorage('user_watched', {}));
  
  const watching = ref<Record<number, WatchingShow>>(getFromStorage('user_watching', {
    '27436': {
      id: 27436,
      name: 'The Boys',
      type: 'series',
      overview: '',
      image_url: 'https://artworks.thetvdb.com/banners/v4/series/355413/posters/6296892334823.jpg',
      progress: { season: 2, episode: 4, totalEpisodes: 8 }
    },
    '121361': {
      id: 121361,
      name: 'Game of Thrones',
      type: 'series',
      overview: '',
      image_url: 'https://artworks.thetvdb.com/banners/posters/121361-4.jpg',
      progress: { season: 8, episode: 3, totalEpisodes: 6 }
    },
    '81189': {
      id: 81189,
      name: 'Breaking Bad',
      type: 'series',
      overview: '',
      image_url: 'https://artworks.thetvdb.com/banners/posters/81189-1.jpg',
      progress: { season: 5, episode: 10, totalEpisodes: 16 }
    }
  }));

  const watchlistArray = computed(() => Object.values(watchlist.value));
  const favoritesArray = computed(() => Object.values(favorites.value));
  const watchedArray = computed(() => Object.values(watched.value));
  const watchingArray = computed(() => Object.values(watching.value));

  watch(watchlist, (val) => localStorage.setItem('user_watchlist', JSON.stringify(val)), { deep: true });
  watch(favorites, (val) => localStorage.setItem('user_favorites', JSON.stringify(val)), { deep: true });
  watch(watched, (val) => localStorage.setItem('user_watched', JSON.stringify(val)), { deep: true });
  watch(watching, (val) => localStorage.setItem('user_watching', JSON.stringify(val)), { deep: true });

  function toggleWatchlist(show: Show) {
    if (watchlist.value[show.id]) {
      delete watchlist.value[show.id];
    } else {
      watchlist.value[show.id] = show;
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

      if (watchlist.value[show.id]) delete watchlist.value[show.id];
      if (watched.value[show.id]) delete watched.value[show.id];
  }

  function updateEpisodeProgress(showId: number) {
    const show = watching.value[showId];
    if (show && show.progress.episode < show.progress.totalEpisodes) {
        show.progress.episode++;
    } else if (show) {
        toggleWatched(show);
    }
  }

  return {
    watchlist: watchlistArray,
    favorites: favoritesArray,
    watched: watchedArray,
    watching: watchingArray,
    
    toggleWatchlist,
    toggleFavorites,
    toggleWatched,
    startWatching,
    updateEpisodeProgress,
    
    isInWatchlist: (id: number) => !!watchlist.value[id],
    isInFavorites: (id: number) => !!favorites.value[id],
    isInWatched: (id: number) => !!watched.value[id],
    isWatching: (id: number) => !!watching.value[id],
  }
})