<template>
  <div class="search-page">
    <div class="table-wrapper">
      <div class="header">
        <h1>Search Results</h1>
        <button @click="goBack" class="btn-back">← Back</button>
      </div>

      <!-- Search Query -->
      <div class="search-info">
        <p>Searching for: <strong>"{{ searchQuery }}"</strong></p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        Searching...
      </div>

      <!-- Results -->
      <div v-else-if="searchResults.length > 0">
        <div class="result-count">
          {{ searchResults.length }} results found
        </div>
        
        <div class="houses-grid">
          <HouseCard 
            v-for="house in searchResults" 
            :key="house.id" 
            :house="house"
            @click="goToDetail(house.id)"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <p v-if="searchQuery.length < 3">⚠️ Please enter at least 3 characters to search</p>
        <template v-else>
          <p>😕 "{{ searchQuery }}" ---> No Results</p>
          <p class="hint">Try again</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HOUSES_API } from '@/config/api'
import HouseCard from '@/components/HouseCard.vue'
import { useFetchHousesStore } from '@/stores/fetchHouses'

const fetchHousesStore = useFetchHousesStore()
const route = useRoute()
const router = useRouter()

const houses = computed(() => fetchHousesStore.houses)
const isLoading = computed(() => fetchHousesStore.isLoading)
const searchQuery = ref(route.query.q || '')

// Watch for route query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery
    console.log('New search term:', newQuery)
  }
})

// Search results (unique)
const searchResults = computed(() => {
  if (!houses.value || houses.value.length === 0 || !searchQuery.value) {
    return []
  }

  const query = searchQuery.value.toLowerCase().trim()
  
  // Min 3 characters check
  if (query.length < 3) {
    return []
  }
  const uniqueResults = new Map()

  houses.value.forEach(house => {
    // City, Street, Zip kısımlarında ara
    const cityMatch = house.location.city.toLowerCase().includes(query)
    const streetMatch = house.location.street.toLowerCase().includes(query)
    const zipMatch = house.location.zip.toLowerCase().includes(query)

    // Add if available 
    if (cityMatch || streetMatch || zipMatch) {
      uniqueResults.set(house.id, house)
    }
  })

  return Array.from(uniqueResults.values())
})


function goToDetail(id) {
  router.push(`/houses/${id}`)
}

function goBack() {
  router.push('/houses')
}

onMounted(() => {
  fetchHousesStore.fetchAllHouses()
})
</script>

<style scoped>
.search-page {
  width: 100%;
  padding: 20px 0;
}

.table-wrapper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.btn-back {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #f5f5f5;
}

.search-info {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-info p {
  margin: 0;
  font-size: 15px;
  color: #666;
}

.search-info strong {
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #888;
}

.result-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.houses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results p {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #666;
}

.no-results .hint {
  font-size: 14px;
  color: #999;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 16px 12px;
  }

  .header h1 {
    font-size: 24px;
  }

  .search-info {
    font-size: 14px;
  }

  .result-count {
    font-size: 14px;
  }

  .houses-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .no-results {
    padding: 60px 16px;
  }

  .no-results p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 12px 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .search-info {
    font-size: 13px;
  }

  .result-count {
    font-size: 13px;
  }

  .houses-grid {
    gap: 12px;
  }

  .no-results {
    padding: 40px 12px;
  }

  .no-results p {
    font-size: 14px;
  }
}
</style>

