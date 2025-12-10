<template>
  <div class="house-card">
    <!-- Image -->
    <div class="house-card-image">
      <img :src="house.image" :alt="house.location.street" />
    </div>
    
    <!-- Content -->
    <div class="house-card-content">
      <!-- Address -->
      <h3 class="house-address">
        {{ house.location.street }} {{ house.location.houseNumber }}
        <span v-if="house.location.houseNumberAddition">{{ house.location.houseNumberAddition }}</span>
      </h3>
      
      <!-- Location -->
      <p class="house-location">📍 {{ house.location.zip }} {{ house.location.city }}</p>
      
      <!-- Info (Size, Bedrooms, Bathrooms) -->
      <div class="house-info">
        <div class="info-item">
          <span class="info-icon">📏</span>
          <span>{{ house.size }} m²</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🛏️</span>
          <span>{{ house.rooms.bedrooms }} beds</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🚿</span>
          <span>{{ house.rooms.bathrooms }} baths</span>
        </div>
      </div>

      <!-- Price -->
      <div class="house-price">€{{ formatPrice(house.price) }}</div>
      
      <!-- Buttons -->
      <div class="house-footer">
        <button 
          @click.stop="toggleFavorite" 
          class="btn-favorite"
          :class="{ active: isFavorite, disabled: !isLoggedIn }"
          :disabled="!isLoggedIn"
          :title="!isLoggedIn ? 'Please login' : (isFavorite ? 'Remove from favorites' : 'Add to favorites')"
        >
          {{ isFavorite ? '★' : '☆' }}
        </button>
        <button @click="$emit('click')" class="btn-detail">Detail</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  house: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavoritesStore()
const userStore = useUserStore()

// Is user logged in?
const isLoggedIn = computed(() => userStore.isLoggedIn)

// Is it favorite?
const isFavorite = computed(() => favoritesStore.isFavorite(props.house.id))

// Toggle favorite
function toggleFavorite() {
  if (!isLoggedIn.value) return // If not logged in, do nothing
  favoritesStore.toggleFavorite(props.house.id)
}

function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR').format(price)
}
</script>

<style scoped>
/* House Card */
.house-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.house-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.house-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.house-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.house-card:hover .house-card-image img {
  transform: scale(1.05);
}

.house-card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.house-address {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
}

.house-location {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.house-info {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.info-icon {
  font-size: 16px;
}

.house-price {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 700;
  color: #ffb400;
}

.house-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  gap: 8px;
  margin-top: auto;
}

.btn-favorite {
  padding: 8px 12px;
  border: 2px solid #e5e5e5;
  background: white;
  color: #ccc;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.btn-favorite:hover:not(.disabled) {
  border-color: #ffb400;
  color: #ffb400;
  transform: scale(1.1);
}

.btn-favorite.active {
  background: #ffb400;
  border-color: #ffb400;
  color: white;
}

.btn-favorite.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-favorite.disabled:hover {
  transform: none;
}

.btn-detail {
  padding: 8px 20px;
  border: none;
  background: #ffb400;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detail:hover {
  background: #e0a000;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 180, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .house-card {
    border-radius: 6px;
  }

  .house-image {
    height: 180px;
  }

  .house-info {
    padding: 12px;
  }

  .house-city {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .house-price {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .house-size {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .btn-favorite {
    padding: 6px 10px;
    font-size: 18px;
  }

  .btn-detail {
    padding: 6px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .house-image {
    height: 160px;
  }

  .house-info {
    padding: 10px;
  }

  .house-city {
    font-size: 13px;
  }

  .house-price {
    font-size: 18px;
  }

  .house-size {
    font-size: 13px;
  }

  .house-footer {
    gap: 6px;
  }

  .btn-favorite {
    padding: 5px 8px;
    font-size: 16px;
  }

  .btn-detail {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>