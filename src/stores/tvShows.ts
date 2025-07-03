import { defineStore } from 'pinia';

export interface Show {
  id: number;
  name: string;
  type: 'series' | 'movie' | 'person' | 'episode';
  overview: string | null;
  image_url: string | null;
}

export interface Actor {
  id: number;
  name: string;
  image: string | null;
  role: string;
}

export interface Season {
  id: number;
  number: number;
  episodes_count: number;
}

export interface ShowDetails extends Show {
  characters?: Actor[];
  seasons?: Season[];
  artworks?: { id: number; image: string }[];
  nextAired?: { airDate: string; name: string };
  runtime?: number;
  trailers?: { id: number; name: string; url: string; runtime: number; videoId: string }[];
}

export interface Update {
  id: number;
  recordType: 'series' | 'movie' | 'episode';
  recordId: number;
  method: string;
  timestamp: number;
}

export interface TvShowsState {
  token: string | null;
  shows: Show[];
  recommendedMovies: Show[];
  popularShows: Show[];
  isAuthenticating: boolean;
  selectedShow: ShowDetails | null;
  notifications: Update[];
  searchResults: Show[];
}

const apiKey: string | undefined = import.meta.env.VITE_THETVDB_API_KEY;
if (!apiKey) {
  throw new Error("La variable VITE_THETVDB_API_KEY no está definida en tu archivo .env.local");
}

const baseUrl = 'https://api4.thetvdb.com/v4';
const imageBaseUrl = 'https://artworks.thetvdb.com';


// --- FUNCIONES HELPER ---

function isAbsoluteUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function prependIfRelative(url: string | null): string | null {
  if (!url) return null;
  return isAbsoluteUrl(url) ? url : `${imageBaseUrl}${url}`;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function normalizeApiResponse(apiData: any[], itemType?: 'movie' | 'series'): Show[] {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map((item: any) => {
    const record = item.record || item.series || item.movie || item;
    const imagePath = record.image || record.poster || record.image_url || null;
    
    let cleanId = record.id;
    if (typeof cleanId === 'string' && cleanId.includes('-')) {
      cleanId = cleanId.split('-').pop(); 
    }

    return {
      id: parseInt(cleanId, 10),
      name: record.name,
      type: record.type === 'series' || item.series ? 'series' : 'movie',
      overview: record.overview ?? null,
      image_url: prependIfRelative(imagePath),
    };
  });
}

function normalizeDetailResponse(item: any): ShowDetails {
  item.image_url = prependIfRelative(item.image || item.poster || item.image_url || null);

  if (item.characters) {
    item.characters = item.characters.map((actor: any) => ({
      ...actor,
      image: prependIfRelative(actor.image),
    }));
  }

  if (item.artworks) {
    item.artworks = item.artworks.map((art: any) => ({
      ...art,
      image: prependIfRelative(art.image),
    }));
  }

  if (item.trailers) {
    item.trailers = item.trailers
      .map((trailer: any) => {
        const videoId = extractYouTubeId(trailer.url);
        if (videoId) {
          return { ...trailer, videoId };
        }
        return null;
      })
      .filter((trailer: any) => trailer !== null);
  }

  if (item.seasons) {
    item.seasons = item.seasons.map((season: any) => ({
      ...season,
      episodes_count: season.episodeCount 
    }));
  }

  return item;
}

export const useTvShowsStore = defineStore('tvShows', {
  state: (): TvShowsState => ({
    token: null,
    shows: [],
    recommendedMovies: [],
    popularShows: [],
    isAuthenticating: false,
    selectedShow: null,
    notifications: [],
    searchResults: [],
  }),

  actions: {
    async fetchToken(): Promise<string | null> {
      if (this.token) return this.token;
      if (this.isAuthenticating) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.fetchToken();
      }
      this.isAuthenticating = true;
      try {
        const response = await fetch(`${baseUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apikey: apiKey }),
        });
        if (!response.ok) throw new Error('No se pudo obtener el token.');
        const data = await response.json();
        this.token = data.data.token;
        return this.token;
      } catch (error) {
        console.error('Error de autenticación:', error);
        this.token = null;
        return null;
      } finally {
        this.isAuthenticating = false;
      }
    },

    async fetchFromApi(endpoint: string) {
      const token = await this.fetchToken();
      if (!token) throw new Error('Autenticación fallida. El token es nulo.');
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'No se pudo leer el cuerpo del error.' }));
        console.error('Cuerpo del error de la API:', errorBody);
        throw new Error(`La petición a ${endpoint} falló con status ${response.status}`);
      }
      return response.json();
    },

    async fetchPopularMovies() {
      try {
        const response = await this.fetchFromApi('/movies');
        this.recommendedMovies = normalizeApiResponse(response.data, 'movie');
      } catch (error) {
        console.error("Error obteniendo películas:", error);
        this.recommendedMovies = [];
      }
    },

    async fetchPopularShows() {
      try {
        const response = await this.fetchFromApi('/series');
        this.popularShows = normalizeApiResponse(response.data, 'series');
      } catch (error) {
        console.error("Error obteniendo series:", error);
        this.popularShows = [];
      }
    },

    async searchAll(query: string) {
      this.searchResults = [];
      if (!query || query.trim() === '') return;
      try {
        const response = await this.fetchFromApi(`/search?query=${encodeURIComponent(query)}`);
        this.searchResults = normalizeApiResponse(response.data, '');
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        this.searchResults = [];
      }
    },

    async fetchDetails(id: string, type: 'movie' | 'series') {
      this.selectedShow = null;
      try {
        const endpoint = type === 'series' ? `/series/${id}/extended` : `/movies/${id}/extended`; 
        const response = await this.fetchFromApi(endpoint);
  
        this.selectedShow = normalizeDetailResponse(response.data);
        if (this.selectedShow) {
          this.selectedShow.type = type;
        }
      } catch (error) {
        console.error(`Error obteniendo los detalles para ${type} ${id}:`, error);
        this.selectedShow = null;
      }
    },

    async checkForUpdates() {
      try {
        const lastCheckTimestamp = localStorage.getItem('lastUpdateCheck') || '0';
        const response = await this.fetchFromApi(`/updates?since=${lastCheckTimestamp}`);
        this.notifications = response.data.filter(
          (update: Update) => update.recordType === 'series' || update.recordType === 'movie'
        );
        const newTimestamp = Math.floor(Date.now() / 1000);
        localStorage.setItem('lastUpdateCheck', newTimestamp.toString());
      } catch (error) {
        console.error("Error obteniendo actualizaciones:", error);
      }
    },
  },
});