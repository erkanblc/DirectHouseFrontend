<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>Create New Account</h1>
        <p>Create your account and get started</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username  *</label>
          <input 
            id="username"
            v-model="form.username" 
            type="text" 
            placeholder="Enter your username"
            minlength="2"
            required 
          />
          <small class="field-hint">Minimum 2 characters</small>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            placeholder="Enter your email" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Password  *</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            minlength="4"
            required 
          />
          <small class="field-hint">Minimum 4 characters</small>
        </div>

        <div class="form-group">
          <label for="passwordConfirm">Confirm Password *</label>
          <input 
            id="passwordConfirm"
            v-model="form.passwordConfirm" 
            type="password" 
            placeholder="Re-enter your password"
            minlength="4"
            required 
          />
          <small class="field-hint">Must match the password above</small>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Registering...' : 'Kayıt Ol' }}
        </button>
      </form>

      <div class="register-footer">
        <p>Already have an account?</p>
        <RouterLink to="/login" class="login-link">Login</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
//import { USER_API } from '@/config/api'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Clear form when page changes
onUnmounted(() => {
  form.value = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
  errorMessage.value = ''
  successMessage.value = ''
})

/* With Backend function
async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validasyon
  if (form.value.username.length < 2) {
    errorMessage.value = 'Username must be at least 2 characters.'
    return
  }

  if (!form.value.email.includes('@')) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  if (form.value.password.length < 4) {
    errorMessage.value = 'Password must be at least 4 characters.'
    return
  }

  if (!form.value.passwordConfirm || form.value.passwordConfirm.length === 0) {
    errorMessage.value = 'Please re-enter your password.'
    return
  }

  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = 'Password and confirmation do not match! Please check again.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(`${USER_API.BASE_URL}${USER_API.ENDPOINTS.USERS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        role: 2 // Default role: USER
      })
    })

    isLoading.value = false

    if (response.ok) {
      successMessage.value = 'Registration successful! Redirecting to login...'
      
      // Redirect to the login page after 1.5 seconds
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      const error = await response.text()
      errorMessage.value = error || 'Could not connect to server.'
    }
  } catch (error) {
    isLoading.value = false
    console.error('Register error:', error)
    errorMessage.value = 'Could not connect to the server.'
  }
}
*/

/* === NEW BACKEND-FREE (LOCAL) FUNCTION === */
async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validations
  if (form.value.username.length < 2) {
    errorMessage.value = 'Username must be at least 2 characters.'
    return
  }

  if (!form.value.email.includes('@')) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  if (form.value.password.length < 4) {
    errorMessage.value = 'Password must be at least 4 characters.'
    return
  }

  if (!form.value.passwordConfirm || form.value.passwordConfirm.length === 0) {
    errorMessage.value = 'Please re-enter your password.'
    return
  }

  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = 'Password and confirmation do not match! Please check again.'
    return
  }

  isLoading.value = true

  try {
    // No API request anymore — only logging the data locally
    console.log('Mock register data:', { ...form.value })

    // Small fake delay
    setTimeout(() => {
      isLoading.value = false
      successMessage.value = 'Registration successful! Redirecting to login...'
      
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }, 500)
  } catch (error) {
    isLoading.value = false
    console.error('Register error (mock):', error)
    errorMessage.value = 'An unexpected error occurred.'
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -80px;
}

.register-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1100px;
  height: 100vh;
  background: #f5f5f5;
  z-index: 0;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin: 20px auto 0 auto;
  padding: 30px 24px;
}

.register-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 450px;
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.register-header {
  text-align: center;
  margin-bottom: 35px;
}

.register-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

.register-header p {
  margin: 8px 0 0;
  color: #888;
  font-size: 15px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffb400;
  box-shadow: 0 0 0 3px rgba(255, 180, 0, 0.1);
}

.field-hint {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: -4px;
}

.error-message {
  background: #fff0f0;
  color: #e53935;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.btn-register {
  padding: 14px;
  border: none;
  background: #ffb400;
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-register:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 180, 0, 0.4);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  margin-top: 30px;
  text-align: center;
}

.register-footer p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #ffb400;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #e0a000;
  text-decoration: underline;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .register-page {
    padding: 10px;
  }

  .register-page::before {
    max-width: 100%;
  }

  .register-container {
    max-width: 100%;
    padding: 30px 20px;
    border-radius: 15px;
  }

  .register-header h1 {
    font-size: 24px;
  }

  .register-header p {
    font-size: 14px;
  }

  .form-group input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .btn-register {
    padding: 12px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 25px 16px;
  }

  .register-header h1 {
    font-size: 22px;
  }

  .register-form {
    gap: 16px;
  }

  .form-group input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .btn-register {
    padding: 11px;
    font-size: 14px;
  }
}
</style>

