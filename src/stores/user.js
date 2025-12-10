import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { USER_API } from '@/config/api'
import { useFavoritesStore } from './favorites'
import { useHistoryStore } from './history'

const API_BASE = USER_API.BASE_URL

// Role constants
const ROLES = {
  ADMIN: 1,
  USER: 2
}

export const useUserStore = defineStore('user', () => {
  // User information
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)

  // Role checks
  const isAdmin = computed(() => user.value && user.value.role === ROLES.ADMIN)
  const isUser = computed(() => user.value && user.value.role === ROLES.USER)
  
  // Role name
  const roleName = computed(() => {
    if (!user.value) return ''
    return user.value.role === ROLES.ADMIN ? 'Admin' : 'User'
  })

  // User initial (first letter)
  const userInitial = computed(() => {
    if (user.value && user.value.username) {
      return user.value.username.charAt(0).toUpperCase()
    }
    return ''
  })

  // Login - with API
  /*async function login(username, password) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const data = await response.json()
        user.value = {
          id: data.id,
          username: data.username,
          email: data.email || '',
          role: data.role
        }
        // Save to SessionStorage (when browser is closed, it is deleted)
        sessionStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      } else {
        const error = await response.text()
        return { success: false, message: error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Could not connect to server' }
    }
  }*/


  // Update user information - with API
  /*async function updateUser(newUsername, newEmail, newPassword = '') {
    if (!user.value || !user.value.id) {
      return { success: false, message: 'User not found' }
    }

    try {
      // Create Backend User model
      const requestBody = {
        id: user.value.id,
        username: newUsername,
        email: newEmail,
        role: user.value.role
      }

      // If password is entered, add it; otherwise backend will keep existing password
      if (newPassword && newPassword.length > 0) {
        requestBody.password = newPassword
      }

      console.log('Update request to:', `${API_BASE}/api/users/${user.value.id}`)
      console.log('Request body:', requestBody)

      const response = await fetch(`${API_BASE}/api/users/${user.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Update successful, response:', data)
        
        // Process backend response (UserLoginResponse or User)
        user.value = {
          id: data.id,
          username: data.username,
          email: data.email || '',
          role: data.role
        }
        
        sessionStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      } else {
        const errorText = await response.text()
        console.error('Update failed:', response.status, errorText)
        
        let errorMessage = 'Update failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorJson.error || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        
        return { success: false, message: errorMessage }
      }
    } catch (error) {
      console.error('Update error:', error)
      return { success: false, message: 'Could not connect to server. Please check your internet connection.' }
    }
  }*/

  // Fetch user information from API
  /*async function fetchUser(id) {
    try {
      const response = await fetch(`${API_BASE}/api/users/${id}`)
      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        return { success: false, message: 'User not found' }
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      return { success: false, message: 'Could not connect to server' }
    }
  }*/

    async function login(username, password) {
      if (username === 'admin' && password === 'admin') {
        user.value = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: ROLES.ADMIN
        }
        sessionStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      }
      return { success: false, message: 'Invalid credentials' }
    }
    
    async function updateUser(newUsername, newEmail, newPassword = '') {
      if (!user.value) return { success: false, message: 'User not found' }
      user.value = {
        ...user.value,
        username: newUsername,
        email: newEmail
      }
      sessionStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    }
    
    async function fetchUser() {
      if (user.value) return { success: true, data: user.value }
      return { success: false, message: 'Not available (offline mode)' }
    }

  // Logout
  function logout() {
    user.value = null
    sessionStorage.removeItem('user')
    
    // Clear favorites and history
    const favoritesStore = useFavoritesStore()
    const historyStore = useHistoryStore()
    favoritesStore.clearFavorites()
    historyStore.clearHistory()
    
    console.log('Logged out, favorites and history cleared')
  }

  // Load user from sessionStorage on page load
  function loadUser() {
    const savedUser = sessionStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return { 
    user, 
    isLoggedIn,
    isAdmin,
    isUser,
    roleName,
    userInitial, 
    login, 
    updateUser,
    fetchUser,
    logout, 
    loadUser,
    ROLES
  }
})

