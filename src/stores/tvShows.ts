import { defineStore } from 'pinia';

// --- Interfaces y Configuración ---
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
}

const apiKey: string | undefined = import.meta.env.VITE_THETVDB_API_KEY;
if (!apiKey) {
  throw new Error("La variable VITE_THETVDB_API_KEY no está definida en tu archivo .env.local");
}

const baseUrl = 'https://api4.thetvdb.com/v4';
const imageBaseUrl = 'https://artworks.thetvdb.com';

function normalizeApiResponse(apiData: any[], itemType: 'movie' | 'series' | string): Show[] {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item: any) => {
    const imagePath = item.image || item.poster || item.image_url || null;
    return {
      id: item.id,
      name: item.name,
      type: item.type || itemType, 
      overview: item.overview ?? null,
      image_url: imagePath ? `${imageBaseUrl}${imagePath}` : null,
    };
  });
}

function normalizeDetailResponse(item: any): ShowDetails {
  if (item.characters) {
    item.characters = item.characters.map((actor: any) => ({
      ...actor,
      image: actor.image ? `${imageBaseUrl}${actor.image}` : null,
    }));
  }
  if (item.artworks) {
    item.artworks = item.artworks.map((art: any) => ({
      ...art,
      image: art.image ? `${imageBaseUrl}${art.image}` : null,
    }));
  }
  return item;
}

// --- Definición del Store ---
export const useTvShowsStore = defineStore('tvShows', {
  state: (): TvShowsState => ({
    token: null,
    shows: [],
    recommendedMovies: [],
    popularShows: [],
    isAuthenticating: false,
    selectedShow: null,
    notifications: [],
  }),

  // **AQUÍ ESTÁ LA CORRECCIÓN: TODAS LAS ACCIONES JUNTAS**
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
    
    async searchShows(query: string) {
      try {
        const response = await this.fetchFromApi(`/search?query=${encodeURIComponent(query)}`);
        this.shows = normalizeApiResponse(response.data, '');
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        this.shows = [];
      }
    },
    
    async fetchDetails(id: string, type: 'movie' | 'series') {
      this.selectedShow = null;
      try {
        const endpoint = type === 'series' ? `/series/${id}/extended` : `/movies/${id}`;
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