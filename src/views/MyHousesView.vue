<template>
  <div class="houses-page">
    <!-- Table wrapper in navbar style -->
    <div class="table-wrapper">
      <div class="header">
        <h1>My Houses</h1>
        <RouterLink to="/houses/new" class="btn-new">+ New Listing</RouterLink>
      </div>

      <!-- Sort and Result Count -->
      <div v-if="myHouses.length > 0" class="sort-header">
        <div class="result-count">
          {{ sortedHouses.length }} listing{{ sortedHouses.length === 1 ? '' : 's' }} found
        </div>
        
        <!-- Sort Dropdown -->
        <div class="sort-dropdown">
          <button 
            @click="showSortDropdown = !showSortDropdown"
            class="sort-button"
          >
            <span>Sort: {{ selectedSortLabel }}</span>
            <span class="arrow" :class="{ open: showSortDropdown }">▼</span>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showSortDropdown" class="sort-menu">
            <label 
              v-for="option in sortOptions" 
              :key="option.value"
              class="sort-option"
              @click="sortBy = option.value; showSortDropdown = false"
            >
              <input 
                type="radio" 
                :value="option.value" 
                v-model="sortBy"
                class="sort-radio"
              />
              <span class="sort-text">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Loading  -->
      <div v-if="isLoading" class="loading">
        Loading ...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- House Cards -->
      <div v-else-if="myHouses.length > 0" class="houses-grid">
        <HouseCard 
          v-for="house in sortedHouses" 
          :key="house.id" 
          :house="house"
          @click="goToDetail(house.id)"
        />
      </div>

      <!-- No listings yet -->
      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>You don't have any listings yet</h3>
        <p>Start by creating your first listing</p>
        <RouterLink to="/houses/new" class="btn-create">+ Create Listing</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { HOUSES_API } from '@/config/api'
import HouseCard from '@/components/HouseCard.vue'
import { useFetchHousesStore } from '@/stores/fetchHouses'

const fetchHousesStore = useFetchHousesStore()
const router = useRouter()
const allHouses = computed(() => fetchHousesStore.houses)
const sortBy = ref('newest') // Default: Newest listing
const showSortDropdown = ref(false)
const isLoading = computed(() => fetchHousesStore.isLoading)
const error = computed(() => fetchHousesStore.error)

// Only my houses (madeByMe: true)
const myHouses = computed(() => {
  if (!allHouses.value || allHouses.value.length === 0) return []
  return allHouses.value.filter(house => house.madeByMe === true)
})

// Sort options
const sortOptions = [
  { value: 'price-low', label: 'Lowest price' },
  { value: 'price-high', label: 'Highest price' },
  { value: 'newest', label: 'Newest listing (publication date)' },
  { value: 'oldest', label: 'Oldest listing' },
  { value: 'rooms-most', label: 'Most rooms' },
  { value: 'rooms-least', label: 'Least rooms' },
  { value: 'size-large', label: 'Largest size' },
  { value: 'size-small', label: 'Smallest size' }
]

// Selected sort label
const selectedSortLabel = computed(() => {
  const option = sortOptions.find(opt => opt.value === sortBy.value)
  return option ? option.label : 'Sort'
})

// Sorted houses
const sortedHouses = computed(() => {
  if (!myHouses.value || myHouses.value.length === 0) return []
  
  const sorted = [...myHouses.value].sort((a, b) => {
    switch (sortBy.value) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'rooms-most':
        return (b.rooms.bedrooms + b.rooms.bathrooms) - (a.rooms.bedrooms + a.rooms.bathrooms)
      case 'rooms-least':
        return (a.rooms.bedrooms + a.rooms.bathrooms) - (b.rooms.bedrooms + b.rooms.bathrooms)
      case 'size-large':
        return b.size - a.size
      case 'size-small':
        return a.size - b.size
      default:
        return 0
    }
  })
  
  return sorted
})


function goToDetail(id) {
  router.push(`/houses/${id}`)
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const dropdown = document.querySelector('.sort-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showSortDropdown.value = false
  }
}

onMounted(() => {
  fetchHousesStore.fetchAllHouses()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.houses-page {
  width: 100%;
  padding: 20px 0;
}

/* Table wrapper in navbar style */
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
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.btn-new {
  padding: 12px 24px;
  background: #ffb400;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-new:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 180, 0, 0.3);
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #888;
}

.error-message {
  background: #fff0f0;
  color: #e53935;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;
}

.result-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* Dropdown Container */
.sort-dropdown {
  position: relative;
}

/* Dropdown Button */
.sort-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 280px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-button:hover {
  border-color: #ffb400;
}

.arrow {
  font-size: 10px;
  color: #888;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.sort-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
  animation: dropdownSlide 0.2s ease;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.sort-option:last-child {
  border-bottom: none;
}

.sort-option:hover {
  background: #f8f9fa;
}

.sort-radio {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ffb400;
}

.sort-text {
  font-size: 14px;
  color: #555;
  user-select: none;
  flex: 1;
}

.sort-option:has(.sort-radio:checked) {
  background: #fff8e1;
}

.sort-option:has(.sort-radio:checked) .sort-text {
  font-weight: 600;
  color: #333;
}

.houses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.empty-state p {
  margin: 0 0 24px 0;
  color: #888;
  font-size: 16px;
}

.btn-create {
  display: inline-block;
  padding: 12px 24px;
  background: #ffb400;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-create:hover {
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
    margin-bottom: 20px;
  }

  .header h1 {
    font-size: 24px;
  }

  .btn-new {
    width: 100%;
    justify-content: center;
  }

  .sort-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-button {
    width: 100%;
    justify-content: space-between;
  }
  
  .sort-menu {
    left: 0;
    right: 0;
    width: 100%;
  }

  .houses-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .result-count {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 12px 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .btn-new {
    padding: 8px 16px;
    font-size: 13px;
  }

  .result-count {
    font-size: 13px;
  }

  .sort-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .houses-grid {
    gap: 12px;
  }

  .empty-state {
    padding: 60px 16px;
  }

  .btn-create {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>

