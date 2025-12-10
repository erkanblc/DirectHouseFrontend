<template>
  <div class="edit-house-page">
    <div class="table-wrapper">
      <div class="header">
        <h1>Edit Listing</h1>
      </div>

      <!-- Loading  -->
      <div v-if="isLoadingData" class="loading">
        Loading listing information...
      </div>

      <!-- Form -->
      <form v-else-if="form.id" @submit.prevent="handleSubmit" class="house-form">
        <!-- Price -->
        <div class="form-group">
          <label for="price">Price *</label>
          <input 
            id="price"
            v-model.number="form.price" 
            type="number" 
            placeholder="Price (€)"
            required 
          />
        </div>

        <!-- Bedrooms -->
        <div class="form-row">
          <div class="form-group">
            <label for="bedrooms">Bedrooms *</label>
            <input 
              id="bedrooms"
              v-model.number="form.bedrooms" 
              type="number" 
              min="1"
              placeholder="Number of bedrooms"
              required 
            />
          </div>

          <!-- Bathrooms -->
          <div class="form-group">
            <label for="bathrooms">Bathrooms *</label>
            <input 
              id="bathrooms"
              v-model.number="form.bathrooms" 
              type="number" 
              min="1"
              placeholder="Number of bathrooms"
              required 
            />
          </div>
        </div>

        <!-- Size -->
        <div class="form-group">
          <label for="size">Size (m²) *</label>
          <input 
            id="size"
            v-model.number="form.size" 
            type="number" 
            min="1"
            placeholder="Size (m²)"
            required 
          />
        </div>

        <!-- Street Name -->
        <div class="form-group">
          <label for="streetName">Street Name *</label>
          <input 
            id="streetName"
            v-model="form.streetName" 
            type="text" 
            placeholder="Street name"
            required 
          />
        </div>

        <!-- House Number and Addition -->
        <div class="form-row">
          <div class="form-group">
            <label for="houseNumber">House Number *</label>
            <input 
              id="houseNumber"
              v-model="form.houseNumber" 
              type="text" 
              placeholder="House number"
              required 
            />
          </div>

          <div class="form-group">
            <label for="numberAddition">Addition (Optional)</label>
            <input 
              id="numberAddition"
              v-model="form.numberAddition" 
              type="text" 
              placeholder="A, B, 1, etc."
            />
          </div>
        </div>

        <!-- Postal Code and City -->
        <div class="form-row">
          <div class="form-group">
            <label for="zip">Postal Code *</label>
            <input 
              id="zip"
              v-model="form.zip" 
              type="text" 
              placeholder="1234AB"
              required 
            />
          </div>

          <div class="form-group">
            <label for="city">City *</label>
            <input 
              id="city"
              v-model="form.city" 
              type="text" 
              placeholder="Amsterdam"
              required 
            />
          </div>
        </div>

        <!-- Construction Year -->
        <div class="form-group">
          <label for="constructionYear">Construction Year *</label>
          <input 
            id="constructionYear"
            v-model.number="form.constructionYear" 
            type="number" 
            min="1900"
            :max="new Date().getFullYear()"
            placeholder="1990"
            required 
          />
        </div>

        <!-- Garage -->
        <div class="form-group checkbox-group">
          <label>
            <input 
              v-model="form.hasGarage" 
              type="checkbox"
            />
            <span>Has Garage</span>
          </label>
        </div>

        <!-- Current Image -->
        <div v-if="form.currentImage && !imagePreview" class="form-group">
          <label>Current Photo</label>
          <div class="current-image">
            <img :src="form.currentImage" alt="Current photo" />
          </div>
        </div>

        <!-- New Image Upload -->
        <div class="form-group image-upload-section">
          <label>Upload New Photo</label>
          <div class="file-upload-wrapper">
            <input 
              id="image"
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="file-input-hidden"
            />
            <button type="button" @click="$refs.fileInput.click()" class="btn-file-select">
              📁 Choose File
            </button>
            <span class="file-name">{{ selectedImage ? selectedImage.name : 'No file selected' }}</span>
          </div>
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="New preview" />
          </div>
          
          <!-- Image message -->
          <div v-if="imageMessage" :class="imageMessage.includes('✓') ? 'success-message' : 'error-message'" style="margin-top: 12px;">
            {{ imageMessage }}
          </div>
          
          <!-- Image upload button -->
          <button 
            type="button" 
            @click="uploadImage" 
            :disabled="!selectedImage || isUploadingImage"
            class="btn-upload-image"
          >
            {{ isUploadingImage ? 'Uploading...' : 'Upload Image' }}
          </button>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            id="description"
            v-model="form.description" 
            placeholder="Detailed description about the house..."
            rows="5"
            required
          ></textarea>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Buttons -->
        <div class="form-buttons">
          <button type="button" class="btn-cancel" @click="goBack" :disabled="isLoading">
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HOUSES_API } from '@/config/api'

const route = useRoute()
const router = useRouter()

const form = ref({
  id: null,
  price: '',
  bedrooms: '',
  bathrooms: '',
  size: '',
  streetName: '',
  houseNumber: '',
  numberAddition: '',
  zip: '',
  city: '',
  constructionYear: '',
  hasGarage: false,
  description: '',
  currentImage: ''
})

const selectedImage = ref(null)
const imagePreview = ref(null)
const isLoadingData = ref(false)
const isLoading = ref(false)
const isUploadingImage = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const imageMessage = ref('')

// Load current house data
async function fetchHouse() {
  isLoadingData.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.HOUSE_BY_ID(route.params.id)}`, {
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      }
    })

    if (response.ok) {
      const data = await response.json()
      const house = data[0]
      
      // Formu doldur
      form.value = {
        id: house.id,
        price: house.price,
        bedrooms: house.rooms.bedrooms,
        bathrooms: house.rooms.bathrooms,
        size: house.size,
        streetName: house.location.street,
        houseNumber: house.location.houseNumber,
        numberAddition: house.location.houseNumberAddition || '',
        zip: house.location.zip,
        city: house.location.city,
        constructionYear: house.constructionYear,
        hasGarage: house.hasGarage,
        description: house.description,
        currentImage: house.image
      }
    } else {
      errorMessage.value = 'House not found'
    }
  } catch (err) {
    console.error('Fetch error:', err)
    errorMessage.value = 'Could not connect to the server'
  } finally {
    isLoadingData.value = false
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Create FormData
    const formData = new FormData()
    formData.append('price', form.value.price.toString())
    formData.append('bedrooms', form.value.bedrooms.toString())
    formData.append('bathrooms', form.value.bathrooms.toString())
    formData.append('size', form.value.size.toString())
    formData.append('streetName', form.value.streetName.trim())
    formData.append('houseNumber', form.value.houseNumber.toString())
    formData.append('numberAddition', form.value.numberAddition.trim())
    formData.append('zip', form.value.zip.trim())
    formData.append('city', form.value.city.trim())
    formData.append('constructionYear', form.value.constructionYear.toString())
    formData.append('hasGarage', form.value.hasGarage.toString())
    formData.append('description', form.value.description.trim())

    console.log('Sending update:', Object.fromEntries(formData))

    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.EDIT(form.value.id)}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      },
      body: formData
    })

    isLoading.value = false

    if (response.ok) {
      console.log('Listing updated')
      isLoading.value = false
      successMessage.value = '✓ Listing updated successfully!'
      
      setTimeout(() => {
        router.push(`/houses/${form.value.id}`)
      }, 1500)
    } else {
      const error = await response.text()
      console.error('API Error:', error)
      errorMessage.value = error || 'Update failed. Please check all fields.'
    }
  } catch (err) {
    isLoading.value = false
    console.error('Update error:', err)
    errorMessage.value = 'Could not connect to the server. Please check your internet connection.'
  }
}

// When image is selected
function handleImageSelect(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('New file selected:', file.name, file.type, file.size)
    
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select a valid image file'
      selectedImage.value = null
      imagePreview.value = null
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 10MB'
      selectedImage.value = null
      imagePreview.value = null
      return
    }
    
    selectedImage.value = file
    errorMessage.value = ''
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Upload image (separate button)
async function uploadImage() {
  if (!selectedImage.value) {
    imageMessage.value = 'Please select an image first'
    return
  }

  imageMessage.value = ''
  isUploadingImage.value = true

  try {
    const imageFormData = new FormData()
    imageFormData.append('image', selectedImage.value, selectedImage.value.name)

    console.log('=== IMAGE UPLOAD ===')
    console.log('House ID:', form.value.id)
    console.log('File:', selectedImage.value.name)

    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.UPLOAD_IMAGE(form.value.id)}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      },
      body: imageFormData
    })

    isUploadingImage.value = false

    if (response.ok) {
      console.log('✓ Image updated')
      imageMessage.value = '✓ Image updated successfully!'
      
      // Reset image selection
      selectedImage.value = null
      imagePreview.value = null
      
      // Update current image (refresh page)
      setTimeout(async () => {
        await fetchHouse()
        imageMessage.value = ''
      }, 2000)
    } else {
      const errorText = await response.text()
      console.error('❌ Image upload error:', errorText)
      imageMessage.value = `Could not upload image: ${errorText}`
    }
  } catch (err) {
    isUploadingImage.value = false
    console.error('❌ Upload exception:', err)
    imageMessage.value = `Error uploading image: ${err.message}`
  }
}

function goBack() {
  router.push(`/houses/${form.value.id}`)
}

onMounted(() => {
  fetchHouse()
})
</script>

<style scoped>
.edit-house-page {
  width: 100%;
  padding: 20px 0;
}

.table-wrapper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}

.house-form {
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

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffb400;
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.checkbox-group label:hover {
  border-color: #ffb400;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-group span {
  font-size: 15px;
  color: #333;
}

.field-hint {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: -4px;
}

.file-input {
  padding: 12px;
  border: 2px dashed #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.file-input:hover {
  border-color: #ffb400;
}

.current-image,
.image-preview {
  margin-top: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.current-image img,
.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.image-upload-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e5e5e5;
}

.btn-upload-image {
  margin-top: 12px;
  padding: 12px 24px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-upload-image:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-upload-image:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-input-hidden {
  display: none;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-file-select {
  padding: 10px 20px;
  background: #ffb400;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-file-select:hover {
  background: #e0a000;
  transform: translateY(-1px);
}

.file-name {
  color: #666;
  font-size: 14px;
  font-style: italic;
  transform: none;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.error-message {
  background: #fff0f0;
  color: #e53935;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e5e5e5;
}

.btn-submit {
  background: #ffb400;
  color: white;
}

.btn-submit:hover {
  background: #e0a000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 180, 0, 0.3);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 16px 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header h1 {
    font-size: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-group input,
  .form-group textarea {
    padding: 12px 14px;
    font-size: 14px;
  }

  .file-upload-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-file-select {
    width: 100%;
  }

  .file-name {
    font-size: 13px;
  }

  .btn-upload-image {
    font-size: 13px;
  }

  .form-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel, .btn-submit {
    width: 100%;
  }

  .image-preview {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 12px 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-group input,
  .form-group textarea {
    padding: 10px 12px;
    font-size: 13px;
  }

  .checkbox-group label span {
    font-size: 13px;
  }

  .current-image {
    max-width: 100%;
  }
}
</style>