<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Welcome</h1>
        <p>Login to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="form.username" 
            type="text" 
            placeholder="Enter your username" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password" 
            required 
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="register-text">Don't have an account?</p>
        <RouterLink to="/register" class="register-link">Create New Account</RouterLink>
      </div>

      <div class="back-footer">
        <RouterLink to="/" class="back-link">← Back to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

// Clear form when page changes
onUnmounted(() => {
  form.value = {
    username: '',
    password: ''
  }
  errorMessage.value = ''
})

async function handleLogin() {
  errorMessage.value = ''
  
  if (form.value.username.length < 2) {
    errorMessage.value = 'Username must be at least 2 characters.'
    return
  }

  if (form.value.password.length < 3) {
    errorMessage.value = 'Password must be at least 3 characters.'
    return
  }

  isLoading.value = true

  const result = await userStore.login(form.value.username, form.value.password)
  
  isLoading.value = false

  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -80px;
}

.login-page::before {
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

.login-container {
  width: 100%;
  max-width: 420px;
  background: #fff;
  position: relative;
  z-index: 10;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

.login-header p {
  margin: 8px 0 0;
  color: #888;
  font-size: 15px;
}

.login-form {
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

.error-message {
  background: #fff0f0;
  color: #e53935;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.btn-login {
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

.btn-login:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 180, 0, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.register-text {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #ffb400;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #e0a000;
  text-decoration: underline;
}

.back-footer {
  margin-top: 20px;
  text-align: center;
}

.back-link {
  color: #888;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #ffb400;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .login-page {
    padding: 10px;
  }

  .login-page::before {
    max-width: 100%;
  }

  .login-container {
    max-width: 100%;
    padding: 30px 20px;
    border-radius: 15px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .form-group input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .btn-login {
    padding: 12px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 25px 16px;
  }

  .login-header h1 {
    font-size: 22px;
  }

  .login-form {
    gap: 16px;
  }

  .form-group input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .btn-login {
    padding: 11px;
    font-size: 14px;
  }
}
</style>

