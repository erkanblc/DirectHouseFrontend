<!-- 📍 📏 🛏️ 🚿 🚗 🏗️ 🗺️ ⭐ ★ ☆ 🔍 🏠 🕒 👤 ← 
Emojis used
-->


<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import { useUserStore } from './stores/user'
import { useFavoritesStore } from './stores/favorites'
import { useHistoryStore } from './stores/history'

const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const historyStore = useHistoryStore()

onMounted(() => {
  // Load favorites and history from sessionStorage
  favoritesStore.loadFavorites()
  historyStore.loadHistory()
})
</script>

<style>
  #app{
    font-family: Arial, sans-serif;
  }
  .page-content {
  padding-top: 60px;   /* Navbar height */
  margin-top: 10px;    /* space */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}
</style>

<template>
  <div id="app">
    <NavBar />

    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

