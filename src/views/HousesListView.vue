<template>
  <div class="houses-page">
    <!-- Table wrapper in navbar style -->
    <div class="table-wrapper">
      <div class="header">
        <h1>Houses</h1>
        <RouterLink to="/houses/new" class="btn-new">+ New Listing</RouterLink>
      </div>

      <!-- Filters -->
      <div v-if="houses.length > 0" class="filter-section">
        <h3 class="filter-title">🔍 Filters</h3>

        <div class="filter-grid">
          <!-- Price Filters -->
          <div class="filter-row">
            <label class="filter-label">Price (€)</label>
            <div class="filter-inputs-wrapper">
              <div class="filter-inputs">
                <input
                  v-model="filters.minPrice"
                  type="number"
                  min="0"
                  placeholder="Min"
                  class="filter-input"
                  @input="handleFilterInput"
                />
                <span class="filter-separator">-</span>
                <input
                  v-model="filters.maxPrice"
                  type="number"
                  min="0"
                  placeholder="Max"
                  class="filter-input"
                  @input="handleFilterInput"
                />
              </div>
              <span v-if="filterErrors.price" class="filter-error">{{ filterErrors.price }}</span>
            </div>
          </div>

          <!-- Size Filters -->
          <div class="filter-row">
            <label class="filter-label">Size (m²)</label>
            <div class="filter-inputs-wrapper">
              <div class="filter-inputs">
                <input
                  v-model="filters.minSize"
                  type="number"
                  min="0"
                  placeholder="Min"
                  class="filter-input"
                  @input="handleFilterInput"
                />
                <span class="filter-separator">-</span>
                <input
                  v-model="filters.maxSize"
                  type="number"
                  min="0"
                  placeholder="Max"
                  class="filter-input"
                  @input="handleFilterInput"
                />
              </div>
              <span v-if="filterErrors.size" class="filter-error">{{ filterErrors.size }}</span>
            </div>
          </div>

          <!-- Buttons  -->
          <div class="filter-actions">
            <button 
              @click="applyFilters" 
              class="btn-apply" 
              :disabled="hasFilterErrors"
              type="button"
            >
              Apply
            </button>
            <button 
              @click="handleReset" 
              class="btn-reset" 
              :disabled="!hasActiveFilters"
              type="button"
            >
              Reset
            </button>
          </div>
          <div v-if="hasFilterErrors" class="error-hint">
            Please fix the errors
          </div>
        </div>
      </div>

      <!-- Sort and Result Count -->
      <div v-if="houses.length > 0" class="sort-header">
        <div class="result-count">
          {{ filteredAndSortedHouses.length }} results found
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
      <div v-else-if="houses.length > 0" class="houses-grid">
        <HouseCard 
          v-for="house in filteredAndSortedHouses" 
          :key="house.id" 
          :house="house"
          @click="goToDetail(house.id)"
        />
      </div>

      <!-- Filtrelenmiş sonuç yok -->
      <div v-if="houses.length > 0 && filteredAndSortedHouses.length === 0" class="no-results">
        <p>😕 No results matching filters</p>
        <button @click="handleReset" class="btn-reset-inline">Clear Filters</button>
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
const houses = computed(() => fetchHousesStore.houses)
const sortBy = ref('newest') // Default: Newest listing
const showSortDropdown = ref(false)
const isLoading = computed(() => fetchHousesStore.isLoading)
const error = computed(() => fetchHousesStore.error)

// Filtre state
const filters = ref({
  minPrice: null,
  maxPrice: null,
  minSize: null,
  maxSize: null
})

const appliedFilters = ref({
  minPrice: null,
  maxPrice: null,
  minSize: null,
  maxSize: null
})

const filterErrors = ref({
  price: '',
  size: ''
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

// Are there any active filters?
const hasActiveFilters = computed(() => {
  return appliedFilters.value.minPrice !== null ||
         appliedFilters.value.maxPrice !== null ||
         appliedFilters.value.minSize !== null ||
         appliedFilters.value.maxSize !== null
})

// Are there any filter errors?
const hasFilterErrors = computed(() => {
  const hasError = !!(filterErrors.value.price || filterErrors.value.size)
  return hasError
})

// Filtered houses
const filteredHouses = computed(() => {
  if (!houses.value || houses.value.length === 0) return []
  
  let result = [...houses.value]
  
  // Price filter
  const minPrice = appliedFilters.value.minPrice ?? 0
  const maxPrice = appliedFilters.value.maxPrice ?? Infinity
  result = result.filter(house => house.price >= minPrice && house.price <= maxPrice)
  
  // Size filter
  const minSize = appliedFilters.value.minSize ?? 0
  const maxSize = appliedFilters.value.maxSize ?? Infinity
  result = result.filter(house => house.size >= minSize && house.size <= maxSize)
  
  return result
})

// Filtered and sorted houses
const filteredAndSortedHouses = computed(() => {
  if (!filteredHouses.value || filteredHouses.value.length === 0) return []
  
  const sorted = [...filteredHouses.value].sort((a, b) => {
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

// Handle input changes
function handleFilterInput() {
  // Convert empty strings or invalid values to null
  const minPriceVal = filters.value.minPrice
  if (minPriceVal === '' || minPriceVal === null || minPriceVal === undefined) {
    filters.value.minPrice = null
  } else {
    const num = Number(minPriceVal)
    filters.value.minPrice = isNaN(num) ? null : num
  }
  
  const maxPriceVal = filters.value.maxPrice
  if (maxPriceVal === '' || maxPriceVal === null || maxPriceVal === undefined) {
    filters.value.maxPrice = null
  } else {
    const num = Number(maxPriceVal)
    filters.value.maxPrice = isNaN(num) ? null : num
  }
  
  const minSizeVal = filters.value.minSize
  if (minSizeVal === '' || minSizeVal === null || minSizeVal === undefined) {
    filters.value.minSize = null
  } else {
    const num = Number(minSizeVal)
    filters.value.minSize = isNaN(num) ? null : num
  }
  
  const maxSizeVal = filters.value.maxSize
  if (maxSizeVal === '' || maxSizeVal === null || maxSizeVal === undefined) {
    filters.value.maxSize = null
  } else {
    const num = Number(maxSizeVal)
    filters.value.maxSize = isNaN(num) ? null : num
  }
  
  validateFilters()
}

// Filter validation
function validateFilters() {
  filterErrors.value.price = ''
  filterErrors.value.size = ''
  
  // Price validation
  if (filters.value.minPrice !== null && filters.value.minPrice !== undefined && filters.value.minPrice < 0) {
    filterErrors.value.price = 'Min price cannot be less than 0'
  }
  if (filters.value.maxPrice !== null && filters.value.maxPrice !== undefined && filters.value.maxPrice < 0) {
    filterErrors.value.price = 'Max price cannot be less than 0'
  }
  if (filters.value.minPrice !== null && filters.value.minPrice !== undefined && 
      filters.value.maxPrice !== null && filters.value.maxPrice !== undefined && 
      filters.value.maxPrice < filters.value.minPrice) {
    filterErrors.value.price = 'Max price cannot be less than min price'
  }
  
  // Size validation
  if (filters.value.minSize !== null && filters.value.minSize !== undefined && filters.value.minSize < 0) {
    filterErrors.value.size = 'Min size cannot be less than 0'
  }
  if (filters.value.maxSize !== null && filters.value.maxSize !== undefined && filters.value.maxSize < 0) {
    filterErrors.value.size = 'Max size cannot be less than 0'
  }
  if (filters.value.minSize !== null && filters.value.minSize !== undefined && 
      filters.value.maxSize !== null && filters.value.maxSize !== undefined && 
      filters.value.maxSize < filters.value.minSize) {
    filterErrors.value.size = 'Max size cannot be less than min size'
  }
}

// Apply filters
function applyFilters() {
  console.log('Apply button clicked')
  console.log('Current filters:', filters.value)
  
  validateFilters()
  
  if (hasFilterErrors.value) {
    console.log('Filter error exists, cannot apply')
    return
  }
  
  appliedFilters.value = { ...filters.value }
  console.log('✅ Filters applied:', appliedFilters.value)
  console.log('Filtered houses count:', filteredAndSortedHouses.value.length)
}

// Reset filters
function handleReset() {
  if (!hasActiveFilters.value) {
    return
  }
  
  if (confirm('Are you sure you want to clear all filters?')) {
    filters.value = {
      minPrice: null,
      maxPrice: null,
      minSize: null,
      maxSize: null
    }
    appliedFilters.value = {
      minPrice: null,
      maxPrice: null,
      minSize: null,
      maxSize: null
    }
    filterErrors.value = {
      price: '',
      size: ''
    }
    console.log('Filters cleared')
  }
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

/* NTable wrapper in navbar style */
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

.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* Filtre Section */
.filter-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.filter-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.filter-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: start;
  max-width: 600px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  padding-top: 10px;
}

.filter-inputs-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-input {
  width: 100px;
  padding: 8px 10px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #ffb400;
}

.filter-input::placeholder {
  color: #aaa;
}

.filter-separator {
  color: #999;
  font-weight: 500;
}

.filter-error {
  font-size: 12px;
  color: #e53935;
  margin-top: 4px;
}

.filter-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.btn-apply {
  padding: 10px 20px;
  background: #ffb400;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-apply:hover:not(:disabled) {
  background: #e0a000;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 180, 0, 0.3);
}

.btn-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #ccc;
}

.btn-reset {
  padding: 10px 20px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-reset:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.btn-reset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-hint {
  font-size: 12px;
  color: #e53935;
  margin-left: 12px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results p {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #666;
}

.btn-reset-inline {
  padding: 10px 20px;
  background: #ffb400;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset-inline:hover {
  background: #e0a000;
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

@media (max-width: 768px) {
  .sort-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .filter-label {
    padding-top: 0;
  }
  
  .filter-actions {
    align-items: stretch;
  }
  
  .btn-apply {
    width: 100%;
  }
  
  .sort-button {
    width: 100%;
  }
  
  .sort-menu {
    left: 0;
    right: 0;
    width: 100%;
  }
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

.empty-state p {
  margin-bottom: 20px;
  color: #888;
  font-size: 18px;
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

  .controls {
    flex-direction: column;
    gap: 12px;
  }

  .result-count {
    text-align: center;
  }

  .sort-dropdown {
    width: 100%;
  }

  .sort-button {
    width: 100%;
    justify-content: space-between;
  }

  .houses-grid {
    grid-template-columns: 1fr;
    gap: 16px;
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

  .sort-options {
    max-height: 250px;
  }

  .houses-grid {
    gap: 12px;
  }
}

</style>