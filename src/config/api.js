// API Konfigürasyonu

// User/Auth API (with My Java Backend Rest API Project)
export const USER_API = {
  BASE_URL: 'http://localhost:8090',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    USERS: '/api/users',
    USER_BY_ID: (id) => `/api/users/${id}`
  }
}

// Houses API (Intern API)
export const HOUSES_API = {
  BASE_URL: 'https://api.intern.d-tt.nl',
  API_KEY: 'RM65sYmIyVqj8TNF1paEn_zwH0OeA2cv',
  ENDPOINTS: {
    HOUSES: '/api/houses',
    HOUSE_BY_ID: (id) => `/api/houses/${id}`,
    UPLOAD_IMAGE: (id) => `/api/houses/${id}/upload`,
    EDIT: (id) => `/api/houses/${id}`,
    DELETE: (id) => `/api/houses/${id}`
  }
}

// Google Maps API
export const GOOGLE_MAPS_API = {
  API_KEY: 'AIzaSyBODx0W8kvm0-bPYopmrHsmMpN41b1PvrI'
}
