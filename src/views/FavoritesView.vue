<template>
  <div class="favorites-page">
    <div class="table-wrapper">
      <div class="header">
        <h1>⭐ My Favorites</h1>
        <button 
          v-if="favoriteHouses.length > 0"
          @click="handleClearFavorites" 
          class="btn-clear"
        >
          Clear
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        Loading...
      </div>

      <!-- Favorite Houses -->
      <div v-else-if="favoriteHouses.length > 0" class="houses-grid">
        <HouseCard 
          v-for="house in favoriteHouses" 
          :key="house.id" 
          :house="house"
          @click="goToDetail(house.id)"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="icon">⭐</div>
        <h2>No favorites yet</h2>
        <p>Add your favorite houses to easily access them later</p>
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
import { useFavoritesStore } from '@/stores/favorites'
import { HOUSES_API } from '@/config/api'
import HouseCard from '@/components/HouseCard.vue'
import { useFetchHousesStore } from '@/stores/fetchHouses'

const fetchHousesStore = useFetchHousesStore()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const allHouses = computed(() => fetchHousesStore.houses)
const isLoading = computed(() => fetchHousesStore.isLoading)

// Favorite houses
const favoriteHouses = computed(() => {
  if (!allHouses.value.length) return []
  return allHouses.value.filter(house => favoritesStore.isFavorite(house.id))
})


function goToDetail(id) {
  router.push(`/houses/${id}`)
}

function handleClearFavorites() {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favoritesStore.clearFavorites()
  }
}

onMounted(() => {
  fetchHousesStore.fetchAllHouses()
})
</script>

<style scoped>
.favorites-page {
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

