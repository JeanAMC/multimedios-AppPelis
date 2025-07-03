import api from './axios'

export async function addFavorite(showId: number, showName: string) {
  const response = await api.post('/api/favorites', {
    show_id: showId,
    show_name: showName,
  })
  return response.data
}

export async function removeFavorite(showId: number) {
  const response = await api.delete(`/api/favorites/${showId}`)
  return response.data
}

export async function getFavorites() {
  const response = await api.get('/api/favorites')
  return response.data
}
