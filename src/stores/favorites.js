import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref([])

  // Is favorite?
  function isFavorite(houseId) {
    return favoriteIds.value.includes(houseId)
  }

  // Toggle favorite
  function toggleFavorite(houseId) {
    const index = favoriteIds.value.indexOf(houseId)
    if (index > -1) {
      // Remove from favorites
      favoriteIds.value.splice(index, 1)
      console.log('Removed from favorites:', houseId)
    } else {
      // Add to favorites
      favoriteIds.value.push(houseId)
      console.log('Added to favorites:', houseId)
    }
    saveFavorites()
  }

  // Save to SessionStorage
  function saveFavorites() {
    sessionStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
  }

  // Load from SessionStorage
  function loadFavorites() {
    const saved = sessionStorage.getItem('favorites')
    if (saved) {
      favoriteIds.value = JSON.parse(saved)
    }
  }

  // Clear
  function clearFavorites() {
    favoriteIds.value = []
    sessionStorage.removeItem('favorites')
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    loadFavorites,
    clearFavorites
  }
})

