<template>
  <div class="home-page">
    <div class="home-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">🏠 DirectHouse</h1>
          <p class="hero-subtitle">The easiest way to find your dream home</p>
          <p class="hero-description">
            Discover the perfect property among thousands of house listings. 
            Search, filter and step into your dream home.
          </p>
          
          <div class="hero-actions">
            <RouterLink to="/houses" class="btn-primary">
              <span class="btn-icon">🔍</span>
              Browse Houses
            </RouterLink>
            <RouterLink to="/houses/new" class="btn-secondary">
              <span class="btn-icon">➕</span>
              Create Listing
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <h2 class="section-title">Why DirectHouse?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find your desired house easily with advanced filtering and sorting features</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Detailed Info</h3>
            <p>Access detailed information including price, size, room count and more for each listing</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Quick Listing</h3>
            <p>Create and publish your own listing in minutes</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Secure Platform</h3>
            <p>Search for houses or create listings on a user-friendly and secure platform</p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-number">{{ isLoading ? '...' : totalHouses }}</div>
          <div class="stat-label">Active Listings</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ isLoading ? '...' : totalCities }}</div>
          <div class="stat-label">Different Cities</div>
        </div>

        <div class="stat-item">
          <div class="stat-number">500+</div>
          <div class="stat-label">Happy Users</div>
        </div>
      </div>

      <!-- Houses List Section -->
      <div class="houses-section">
        <div class="houses-header">
          <h2 class="section-title">All Houses</h2>
          <RouterLink to="/houses" class="btn-view-all">
            View All →
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="loading-houses">
          <div class="loading-spinner">Loading houses...</div>
        </div>

        <!-- House List -->
        <div v-else-if="houses.length > 0" class="houses-grid">
          <HouseCard 
            v-for="house in latestHouses" 
            :key="house.id" 
            :house="house"
            @click="goToDetail(house.id)"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="empty-houses">
          <p>No house listings available yet.</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <h2>Get Started Now</h2>
        <p>Browse thousands of house listings and find the one that suits you best</p>
        <RouterLink to="/houses" class="btn-cta">
          View Houses
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { HOUSES_API } from '@/config/api'
import HouseCard from '@/components/HouseCard.vue'
import { useFetchHousesStore } from '@/stores/fetchHouses'

const fetchHousesStore = useFetchHousesStore()
const router = useRouter()
const houses = computed(() => fetchHousesStore.houses)
const isLoading = computed(() => fetchHousesStore.isLoading)

// Total number of listings
const totalHouses = computed(() => houses.value.length)

// Number of unique cities
const totalCities = computed(() => {
  if (!houses.value.length) return 0
  const cities = new Set(houses.value.map(h => h.location?.city?.toLowerCase()))
  cities.delete(undefined)
  return cities.size
})

// Latest 3 listings
const latestHouses = computed(() => {
  if (!houses.value.length) return []
  return [...houses.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR').format(price)
}

// Go to detail page
function goToDetail(id) {
  router.push(`/houses/${id}`)
}


onMounted(() => {
  fetchHousesStore.fetchAllHouses()
})
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: calc(100vh - 60px);
  
}

.home-container {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto 0 auto;
  padding: 30px 24px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #f8f9fa;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 80px 0;
  margin-bottom: 60px;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  margin: 0 0 20px 0;
  font-size: 56px;
  font-weight: 800;
  color: #333;
  letter-spacing: -1px;
}

.hero-subtitle {
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 600;
  color: #555;
}

.hero-description {
  margin: 0 0 40px 0;
  font-size: 18px;
  line-height: 1.8;
  color: #666;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ffb400;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 180, 0, 0.3);
}

.btn-primary:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 180, 0, 0.4);
}

.btn-secondary {
  background: white;
  color: #555;
  border: 2px solid #e5e5e5;
}

.btn-secondary:hover {
  border-color: #ffb400;
  color: #ffb400;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 20px;
}

/* Features Section */
.features-section {
  margin-bottom: 80px;
}

.section-title {
  text-align: center;
  margin: 0 0 48px 0;
  font-size: 36px;
  font-weight: 700;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #ffb400;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.feature-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #666;
}

/* Stats Section */
.stats-section {
  display: flex;
  justify-content: space-around;
  gap: 32px;
  padding: 48px 32px;
  margin-bottom: 80px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 42px;
  font-weight: 800;
  color: #ffb400;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* Houses List Section */
.houses-section {
  margin-bottom: 80px;
  padding: 32px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.houses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.btn-view-all {
  padding: 12px 24px;
  background: #ffb400;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background: #e0a000;
  transform: translateY(-2px);
}

.loading-houses {
  text-align: center;
  padding: 60px;
}

.loading-spinner {
  font-size: 18px;
  color: #888;
}

.houses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-houses {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 64px 32px;
  background: linear-gradient(135deg, #ffb400 0%, #ff9800 100%);
  border-radius: 16px;
  color: white;
}

.cta-section h2 {
  margin: 0 0 16px 0;
  font-size: 36px;
  font-weight: 700;
}

.cta-section p {
  margin: 0 0 32px 0;
  font-size: 18px;
  opacity: 0.95;
}

.btn-cta {
  display: inline-block;
  padding: 16px 40px;
  background: white;
  color: #ffb400;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }

  .hero-subtitle {
    font-size: 22px;
  }

  .hero-description {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    flex-direction: column;
    gap: 24px;
  }

  .cta-section h2 {
    font-size: 28px;
  }

  .cta-section p {
    font-size: 16px;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-section {
    flex-direction: column;
    gap: 24px;
  }

  .section-title {
    font-size: 24px;
  }

  .houses-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 16px;
  }

  .hero-content h1 {
    font-size: 26px;
  }

  .hero-content p {
    font-size: 14px;
  }

  .btn-primary, .btn-secondary {
    padding: 12px 20px;
    font-size: 14px;
  }

  .section-title {
    font-size: 20px;
  }

  .stat-number {
    font-size: 32px;
  }

  .stat-label {
    font-size: 13px;
  }

  .feature-card h3 {
    font-size: 18px;
  }

  .cta-section h2 {
    font-size: 24px;
  }

  .cta-section p {
    font-size: 14px;
  }
}
</style>

