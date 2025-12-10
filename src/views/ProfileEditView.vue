<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar-large">
          {{ userStore.userInitial }}
        </div>
        <h1>Edit Profile</h1>
        <p>Update your account information</p>
        <span class="user-role-badge" :class="{ 'admin-badge': userStore.isAdmin }">
          {{ userStore.roleName }}
        </span>
      </div>

      <form @submit.prevent="handleUpdate" class="profile-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="form.username" 
            type="text" 
            placeholder="Your username" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            placeholder="Your email address" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Password (Optional)</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="Enter to change password" 
          />
          <small class="field-hint">Password must be entered to make changes</small>
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-buttons">
          <button type="button" class="btn-cancel" @click="goBack" :disabled="isLoading">
            Cancel
          </button>
          <button type="submit" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>

      <div class="profile-footer">
        <button class="btn-logout" @click="handleLogout">
          🚪 Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  password: ''
})

const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

onMounted(() => {
  // Redirect to login if not logged in
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // Load current user information to form
  form.value.username = userStore.user.username
  form.value.email = userStore.user.email || ''
})

// Clear forms when page changes
onUnmounted(() => {
  form.value = {
    username: '',
    email: '',
    password: ''
  }
  successMessage.value = ''
  errorMessage.value = ''
})

async function handleUpdate() {
  errorMessage.value = ''
  successMessage.value = ''

  // Validations
  if (!form.value.username || form.value.username.trim().length < 2) {
    errorMessage.value = 'Username must be at least 2 characters.'
    return
  }

  if (!form.value.email || !form.value.email.includes('@')) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  // If password is entered, it must be at least 4 characters
  if (form.value.password && form.value.password.length > 0 && form.value.password.length < 4) {
    errorMessage.value = 'Password must be at least 4 characters.'
    return
  }

  isLoading.value = true

  try {
    const result = await userStore.updateUser(
      form.value.username.trim(), 
      form.value.email.trim(),
      form.value.password
    )

    isLoading.value = false

    if (result.success) {
      successMessage.value = 'Profile updated successfully! ✓'
      
      // Clear password field
      form.value.password = ''
      
      // Sync form values with updated values
      form.value.username = userStore.user.username
      form.value.email = userStore.user.email
      
      // Hide message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.message || 'Update failed. Please try again.'
    }
  } catch (error) {
    isLoading.value = false
    errorMessage.value = 'An unexpected error occurred.'
    console.error('Update error:', error)
  }
}

function goBack() {
  // Clear form
  clearForm()
  router.back()
}

function handleLogout() {
  // Clear form
  clearForm()
  userStore.logout()
  router.push('/')
}

// Clear form
function clearForm() {
  form.value = {
    username: '',
    email: '',
    password: ''
  }
  successMessage.value = ''
  errorMessage.value = ''
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
  margin-top: -80px;
}

.profile-container {
  width: 100%;
  max-width: 450px;
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.profile-header {
  text-align: center;
  margin-bottom: 35px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ffb400;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(255, 180, 0, 0.4);
}

.profile-header h1 {
  margin: 0;
  font-size: 26px;
  color: #333;
  font-weight: 700;
}

.profile-header p {
  margin: 8px 0 0;
  color: #888;
  font-size: 15px;
}

.user-role-badge {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-role-badge.admin-badge {
  background: #fff3e0;
  color: #f57c00;
}

.profile-form {
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
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.error-message {
  background: #fff0f0;
  color: #e53935;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-cancel {
  flex: 1;
  padding: 14px;
  border: 2px solid #ddd;
  background: transparent;
  color: #666;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.btn-save {
  flex: 1;
  padding: 14px;
  border: none;
  background: #ffb400;
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 180, 0, 0.4);
}

.btn-save:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.btn-logout {
  padding: 12px 30px;
  border: 2px solid #e53935;
  background: transparent;
  color: #e53935;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #e53935;
  color: #fff;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .profile-container {
    max-width: 100%;
    padding: 30px 20px;
  }

  .avatar-large {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .profile-header h1 {
    font-size: 24px;
  }

  .profile-header p {
    font-size: 13px;
  }

  .profile-form {
    gap: 20px;
  }

  .form-group input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .form-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel, .btn-save {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 25px 16px;
  }

  .avatar-large {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .profile-header h1 {
    font-size: 22px;
  }

  .form-group input {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>

