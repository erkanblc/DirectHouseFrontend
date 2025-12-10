<template>
  <div class="detail-page">
    <!-- Loading -->
    <div v-if="isLoading" class="table-wrapper">
      <div class="loading">Loading...</div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="table-wrapper">
      <div class="error-message">
        {{ error }}
        <RouterLink to="/houses" class="back-link">← Back to Houses</RouterLink>
      </div>
    </div>

    <!-- House Detail -->
    <div v-else-if="house" class="table-wrapper">
      <!-- Header with Back and Favorite Buttons -->
      <div class="header">
        <button @click="goBack" class="btn-back">← Back</button>
        <button 
          v-if="userStore.isLoggedIn"
          @click="toggleFavorite" 
          class="btn-favorite-detail"
          :class="{ active: isFavorite }"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          {{ isFavorite ? '★ In Favorites' : '☆ Add to Favorites' }}
        </button>
      </div>

      <!-- Image -->
      <div class="house-image-container">
        <img :src="house.image" :alt="house.location.street" class="house-image" />
      </div>

      <!-- Information -->
      <div class="house-content">
        <div class="house-header">
          <div>
            <h1 class="house-title">
              {{ house.location.street }} 
              {{ house.location.houseNumber }}
              <span v-if="house.location.houseNumberAddition">{{ house.location.houseNumberAddition }}</span>
            </h1>
            <p class="house-location">📍 {{ house.location.zip }} {{ house.location.city }}</p>
          </div>
          <div class="house-price">€{{ formatPrice(house.price) }}</div>
        </div>

        <!-- Features -->
        <div class="house-features">
          <div class="feature-item">
            <span class="feature-icon">📏</span>
            <div>
              <div class="feature-label">Size</div>
              <div class="feature-value">{{ house.size }} m²</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🛏️</span>
            <div>
              <div class="feature-label">Bedrooms</div>
              <div class="feature-value">{{ house.rooms.bedrooms }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🚿</span>
            <div>
              <div class="feature-label">Bathrooms</div>
              <div class="feature-value">{{ house.rooms.bathrooms }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🚗</span>
            <div>
              <div class="feature-label">Garage</div>
              <div class="feature-value">{{ house.hasGarage ? 'Yes' : 'No' }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏗️</span>
            <div>
              <div class="feature-label">Construction Year</div>
              <div class="feature-value">{{ house.constructionYear }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📅</span>
            <div>
              <div class="feature-label">Created</div>
              <div class="feature-value">{{ formatDate(house.createdAt) }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👤</span>
            <div>
              <div class="feature-label">Owner</div>
              <div class="feature-value">{{ house.madeByMe ? 'My Listing' : 'Other' }}</div>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🆔</span>
            <div>
              <div class="feature-label">Listing No</div>
              <div class="feature-value">#{{ house.id }}</div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="house-description">
          <h3>Description</h3>
          <p>{{ house.description }}</p>
        </div>

        <!-- Location -->
        <div class="house-location-map">
          <h3>📍 Location</h3>
          <div class="location-info">
            <p class="address-text">
              <strong>{{ fullAddress }}</strong>
            </p>
          </div>
          <div class="map-container">
            <iframe
              :src="mapEmbedUrl"
              width="100%"
              height="400"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a :href="mapLinkUrl" target="_blank" class="map-link">
            🗺️ Open in Google Maps
          </a>
        </div>

        <!-- Actions (Only for my listings) -->
        <div v-if="house.madeByMe" class="house-actions">
          <button @click="editHouse" class="btn-edit">✏️ Edit</button>
          <button @click="deleteHouse" class="btn-delete">🗑️ Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { HOUSES_API, GOOGLE_MAPS_API } from '@/config/api'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()
const historyStore = useHistoryStore()
const userStore = useUserStore()

const house = ref(null)
const isLoading = ref(false)
const error = ref('')

// Is favorite?
const isFavorite = computed(() => {
  if (!house.value) return false
  return favoritesStore.isFavorite(house.value.id)
})

// Add/remove favorite
function toggleFavorite() {
  if (house.value) {
    favoritesStore.toggleFavorite(house.value.id)
  }
}

// Full address
const fullAddress = computed(() => {
  if (!house.value) return ''
  
  const loc = house.value.location
  let addr = `${loc.street} ${loc.houseNumber}`
  if (loc.houseNumberAddition) addr += loc.houseNumberAddition
  addr += `, ${loc.zip} ${loc.city}`
  
  return addr
})

// Google Maps query
const mapQuery = computed(() => {
  if (!house.value) return ''
  
  const loc = house.value.location
  // Try with full address (street + number + postal code + city)
  let query = `${loc.street} ${loc.houseNumber}, ${loc.zip} ${loc.city}, Netherlands`
  
  return encodeURIComponent(query)
})

// Google Maps Embed URL (q parameter ile)
const mapEmbedUrl = computed(() => {
  if (!house.value) return ''
  return `https://www.google.com/maps?q=${mapQuery.value}&output=embed`
})

// Google Maps Link (open in new tab)
const mapLinkUrl = computed(() => {
  if (!house.value) return ''
  return `https://www.google.com/maps/search/?api=1&query=${mapQuery.value}`
})

async function fetchHouse() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.HOUSE_BY_ID(route.params.id)}`, {
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      }
    })

    if (response.ok) {
      const data = await response.json()
      house.value = data[0] // API returns an array
      
      // Add to history
      if (house.value && house.value.id) {
        historyStore.addToHistory(house.value.id)
      }
    } else {
      error.value = 'House not found'
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = 'Could not connect to the server'
  } finally {
    isLoading.value = false
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR').format(price)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function goBack() {
  router.push('/houses')
}

function editHouse() {
  router.push(`/houses/${route.params.id}/edit`)
}

async function deleteHouse() {
  if (!confirm('Are you sure you want to delete this house?')) return

  try {
    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.DELETE(route.params.id)}`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      }
    })

    if (response.ok) {
      router.push('/houses')
    } else {
      alert('Could not delete the house')
    }
  } catch (err) {
    console.error('Delete error:', err)
    alert('Could not connect to the server')
  }
}

onMounted(() => {
  fetchHouse()
})
</script>

<style scoped>
.detail-page {
  width: 100%;
  padding: 20px 0;
}

/* Table wrapper styled like navbar container */
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
  gap: 16px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
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

.back-link {
  display: inline-block;
  margin-top: 12px;
  color: #1976d2;
  text-decoration: none;
}

.btn-back {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #f5f5f5;
}

.btn-favorite-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid #e5e5e5;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-favorite-detail:hover {
  border-color: #ffb400;
  color: #ffb400;
}

.btn-favorite-detail.active {
  background: #ffb400;
  border-color: #ffb400;
  color: white;
}

.btn-favorite-detail.active:hover {
  background: #e0a000;
  border-color: #e0a000;
}

.house-image-container {
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
  margin-top: -20px;
  margin-bottom: 20px;
  height: 400px;
  max-height: 400px;
  overflow: hidden;
  position: relative;
}

.house-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.house-content {
  padding: 0;
}

.house-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
}

.house-title {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.house-location {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.house-price {
  font-size: 28px;
  font-weight: 700;
  color: #ffb400;
}

.house-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  font-size: 24px;
}

.feature-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.feature-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.house-description {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.house-description h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.house-description p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.house-location-map {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.house-location-map h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.location-info {
  margin-bottom: 16px;
}

.address-text {
  margin: 0;
  font-size: 15px;
  color: #555;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #ffb400;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.map-container iframe {
  display: block;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  color: #1976d2;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 2px solid #e5e5e5;
}

.map-link:hover {
  border-color: #1976d2;
  background: #e3f2fd;
}

.house-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #ffb400;
  color: white;
}

.btn-edit:hover {
  background: #e0a000;
  transform: translateY(-2px);
}

.btn-delete {
  background: #fff0f0;
  color: #e53935;
}

.btn-delete:hover {
  background: #e53935;
  color: white;
  transform: translateY(-2px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 16px 12px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }

  .btn-back, .btn-favorite-detail {
    width: 100%;
    justify-content: center;
  }

  .house-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .house-title {
    font-size: 22px;
  }

  .house-location {
    font-size: 14px;
  }

  .house-price {
    font-size: 26px;
  }

  .house-features {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .feature-item {
    padding: 10px;
  }

  .feature-icon {
    font-size: 20px;
  }

  .feature-label {
    font-size: 11px;
  }

  .feature-value {
    font-size: 14px;
  }

  .house-description h3,
  .house-location-map h3 {
    font-size: 18px;
  }

  .house-actions {
    flex-direction: column;
  }

  .btn-edit, .btn-delete {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 12px 10px;
  }

  .btn-back, .btn-favorite-detail {
    padding: 8px 16px;
    font-size: 14px;
  }

  .house-title {
    font-size: 20px;
  }

  .house-price {
    font-size: 24px;
  }

  .house-features {
    grid-template-columns: 1fr;
  }

  .feature-label {
    font-size: 10px;
  }

  .feature-value {
    font-size: 13px;
  }

  .house-description h3,
  .house-location-map h3 {
    font-size: 16px;
  }

  .house-description p {
    font-size: 13px;
  }
}
</style>