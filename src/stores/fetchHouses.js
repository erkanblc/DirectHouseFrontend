import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HOUSES_API } from '@/config/api'

export const useFetchHousesStore = defineStore('fetchHouses', () => {
  const houses = ref([])
  const isLoading = ref(false)
  const error = ref('')

  async function fetchAllHouses(params = {}) {
    isLoading.value = true
    error.value = ''

    const qs = new URLSearchParams(params).toString()
    const url = `${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.HOUSES}${qs ? `?${qs}` : ''}`

    try {
      const response = await fetch(url, {
        headers: { 'X-Api-Key': HOUSES_API.API_KEY }
      })
      if (!response.ok) throw new Error('Failed to fetch houses')
      houses.value = await response.json()
    } catch (e) {
      error.value = e.message || 'Fetch error'
    } finally {
      isLoading.value = false
    }
  }

  return { houses, isLoading, error, fetchAllHouses }
})