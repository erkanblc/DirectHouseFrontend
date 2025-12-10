<template>
  <header class="navbar">
    <nav class="nav-container">

      <!-- Left Group: Logo + Menu -->
      <div class="left-group">
        <RouterLink to="/" class="logo-link">
          <img :src="logo" class="logo-img" alt="DirectHouse Logo" />
        </RouterLink>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/houses" class="nav-link">Houses</RouterLink>
        <RouterLink to="/my-houses" class="nav-link">My Houses</RouterLink>
        <RouterLink to="/houses/new" class="nav-link">New Listing</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
      </div>

      <!-- Right Group: Search + User -->
      <div class="right-group">
        <form @submit.prevent="handleSearch" class="search-group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search houses... (min 3 characters)" 
            class="search-input"
            minlength="3"
          />
          <button type="submit" class="search-btn">Search</button>
        </form>

        <!-- Not logged in: Login Button -->
        <RouterLink v-if="!userStore.isLoggedIn" to="/login" class="login-btn">
          Login
        </RouterLink>

        <!-- Logged in: User Avatar -->
        <div v-else class="user-menu">
          <button class="user-avatar" @click="toggleDropdown">
            {{ userStore.userInitial }}
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showDropdown" class="dropdown-menu">
            <div class="dropdown-header">
              <span class="dropdown-username">{{ userStore.user.username }}</span>
              <span class="dropdown-email">{{ userStore.user.email }}</span>
              <span class="dropdown-role" :class="{ 'role-admin': userStore.isAdmin }">
                {{ userStore.roleName }}
              </span>
            </div>
            <hr class="dropdown-divider" />
            <RouterLink to="/profile" class="dropdown-item" @click="showDropdown = false">
              👤 Edit Profile
            </RouterLink>
            <RouterLink to="/favorites" class="dropdown-item" @click="showDropdown = false">
              ⭐ My Favorites
            </RouterLink>
            <RouterLink to="/history" class="dropdown-item" @click="showDropdown = false">
              🕒 History
            </RouterLink>
            <button class="dropdown-item logout-item" @click="handleLogout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Search
const searchQuery = ref('')

// Dropdown state
const showDropdown = ref(false)

// Load user when the page is mounted
onMounted(() => {
  userStore.loadUser()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const userMenu = document.querySelector('.user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    showDropdown.value = false
  }
}

// Toggle dropdown
function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

// Search
function handleSearch() {
  const query = searchQuery.value.trim()
  
  if (!query) {
    return
  }
  
  if (query.length < 3) {
    alert('Please enter at least 3 characters to search')
    return
  }
  
  router.push({
    name: 'search',
    query: { q: query }
  })
  searchQuery.value = ''
}

// Logout
function handleLogout() {
  userStore.logout()
  showDropdown.value = false
  router.push('/')
}
</script>

<style>
/* ---------- NAVBAR DESIGN ---------- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
  padding: 10px 0;
}

/* Centered wide container */
.nav-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 20px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

/* ---------- LEFT GROUP (logo + menu) ---------- */
.left-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-link {
  text-decoration: none;
}

.logo-img {
  height: 35px;
  display: block;
}

/* Menu styles */
.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding-bottom: 4px;
  transition: 0.25s ease;
}

.nav-link:hover {
  color: #1976d2;
}

/* Active page */
.nav-link.router-link-exact-active {
  color: #1976d2 !important;
  text-decoration: underline !important;
}

/* ---------- RIGHT GROUP ---------- */
.right-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ---------- SEARCH SECTION ---------- */
.search-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  padding: 8px 12px;
  width: 180px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.search-btn {
  padding: 8px 14px;
  border: none;
  background: #ffb400;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.search-btn:hover {
  background: #e0a000;
}

/* ---------- LOGIN BUTTON ---------- */
.login-btn {
  padding: 8px 20px;
  border: none;
  background: #ffb400;
  color: #fff !important;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.login-btn:hover {
  background: #e0a000;
}

/* ---------- USER MENU ---------- */
.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #ffb400;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  background: #e0a000;
  box-shadow: 0 4px 12px rgba(255, 180, 0, 0.4);
}

/* ---------- DROPDOWN Menu ---------- */
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  min-width: 220px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1001;
  animation: dropdownFade 0.2s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-username {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.dropdown-email {
  font-size: 13px;
  color: #888;
}

.dropdown-role {
  display: inline-block;
  margin-top: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  text-transform: uppercase;
}

.dropdown-role.role-admin {
  background: #fff3e0;
  color: #f57c00;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #333 !important;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  transition: background 0.2s ease;
  box-sizing: border-box;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.logout-item:hover {
  background: #fff0f0;
  color: #e53935 !important;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 10px 12px;
  }

  .logo-link {
    font-size: 16px;
  }

  .logo-img {
    height: 35px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-link {
    font-size: 13px;
    padding: 6px 10px;
  }

  .right-group {
    gap: 8px;
  }

  .search-form {
    display: none; /* Hide search on mobile */
  }

  .search-input {
    max-width: 150px;
    padding: 6px 10px;
    font-size: 13px;
  }

  .search-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .login-btn {
    padding: 6px 16px;
    font-size: 13px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .dropdown-menu {
    min-width: 200px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 70px;
  }

  .nav-container {
    flex-wrap: wrap;
    padding: 8px 10px;
  }

  .logo-link {
    font-size: 14px;
  }

  .logo-img {
    height: 30px;
  }

  .nav-links {
    display: none; /* Hide navigation links on small mobile */
  }

  .right-group {
    margin-left: auto;
  }

  .login-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .dropdown-menu {
    min-width: 180px;
    right: -5px;
  }

  .dropdown-item {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
