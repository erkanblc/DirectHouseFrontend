import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import HomeView from '@/views/HomeView.vue'
import HousesListView from '@/views/HousesListView.vue'
import MyHousesView from '@/views/MyHousesView.vue'
import HouseDetailView from '@/views/HouseDetailView.vue'
import NewHouseView from '@/views/NewHouseView.vue'
import EditHouseView from '@/views/EditHouseView.vue'
import SearchResultsView from '@/views/SearchResultsView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import HistoryView from '@/views/HistoryView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/houses', name: 'houses', component: HousesListView },
  { path: '/my-houses', name: 'my-houses', component: MyHousesView, meta: { requiresAuth: true } },
  { path: '/houses/new', name: 'new-house', component: NewHouseView, meta: { requiresAuth: true } },
  { path: '/houses/search', name: 'search', component: SearchResultsView },
  { path: '/houses/:id', name: 'house-detail', component: HouseDetailView },
  { path: '/houses/:id/edit', name: 'edit-house', component: EditHouseView, meta: { requiresAuth: true } },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileEditView, meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favorites', component: FavoritesView, meta: { requiresAuth: true } },
  { path: '/history', name: 'history', component: HistoryView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard - Authentication check
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Load user when page loads
  if (!userStore.user) {
    userStore.loadUser()
  }
  
  // Pages requiring authentication
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    console.log('Authentication required, redirecting to login page')
    next('/login')
  } else {
    next()
  }
})

export default router
