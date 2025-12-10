<template>
  <div class="history-page">
    <div class="table-wrapper">
      <div class="header">
        <h1>🕒 History</h1>
        <button 
          v-if="historyHouses.length > 0"
          @click="handleClearHistory" 
          class="btn-clear"
        >
          Clear
        </button>
      </div>

      <!-- Description -->
      <p v-if="historyHouses.length > 0" class="info-text">
        Last 3 viewed houses
      </p>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        Loading...
      </div>

      <!-- History Houses -->
      <div v-else-if="historyHouses.length > 0" class="houses-grid">
        <HouseCard 
          v-for="house in historyHouses" 
          :key="house.id" 
          :house="house"
          @click="goToDetail(house.id)"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="icon">🕒</div>
        <h2>No viewing history yet</h2>
        <p>Your last 3 viewed houses will appear here</p>
        <RouterLink to="/houses" class="btn-browse">
          Browse Houses
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { HOUSES_API } from '@/config/api'
import HouseCard from '@/components/HouseCard.vue'

const router = useRouter()
const historyStore = useHistoryStore()

const allHouses = ref([])
const isLoading = ref(true)

// Viewed houses (max 3, ordered)
const historyHouses = computed(() => {
  if (!allHouses.value.length) return []
  
  const houses = []
  for (const id of historyStore.historyIds) {
    const house = allHouses.value.find(h => h.id === id)
    if (house) {
      houses.push(house)
    }
  }
  return houses
})

// Fetch houses from API
async function fetchHouses() {
  try {
    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.HOUSES}`, {
      headers: { 'X-Api-Key': HOUSES_API.API_KEY }
    })
    if (response.ok) {
      allHouses.value = await response.json()
    }
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    isLoading.value = false
  }
}

function goToDetail(id) {
  router.push(`/houses/${id}`)
}

function handleClearHistory() {
  if (confirm('Are you sure you want to clear history?')) {
    historyStore.clearHistory()
  }
}

onMounted(() => {
  fetchHouses()
})
</script>

<style scoped>
.history-page {
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
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.info-text {
  margin: 0 0 20px 0;
  padding: 12px;
  background: #f9f9f9;
  border-left: 4px solid #ffb400;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #888;
}

.btn-clear {
  padding: 10px 20px;
  background: #fff;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #e53935;
  color: white;
}

.houses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state .icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h2 {
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.empty-state p {
  margin: 0 0 32px 0;
  font-size: 16px;
  color: #888;
}

.btn-browse {
  display: inline-block;
  padding: 12px 24px;
  background: #ffb400;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-browse:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 180, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 16px 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header h1 {
    font-size: 24px;
  }

  .btn-clear {
    width: 100%;
  }

  .info-text {
    font-size: 13px;
  }

  .houses-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .empty-state {
    padding: 60px 16px;
  }

  .empty-state h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 12px 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .houses-grid {
    gap: 12px;
  }

  .empty-state {
    padding: 40px 12px;
  }

  .empty-state .icon {
    font-size: 60px;
  }

  .empty-state h2 {
    font-size: 20px;
  }

  .btn-browse {
    width: 100%;
  }
}
</style>

