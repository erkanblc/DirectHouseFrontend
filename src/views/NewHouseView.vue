<template>
  <div class="new-house-page">
    <div class="table-wrapper">
      <div class="header">
        <h1>Create New Listing</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="house-form">
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

        <!-- Image Upload -->
        <div class="form-group">
          <label>House Photo *</label>
          <div class="file-upload-wrapper">
            <input 
              id="image"
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="file-input-hidden"
              required
            />
            <button type="button" @click="$refs.fileInput.click()" class="btn-file-select">
              📁 Choose File
            </button>
            <span class="file-name">{{ selectedImage ? selectedImage.name : 'No file selected' }}</span>
          </div>
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview" />
          </div>
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
            {{ isLoading ? 'Creating...' : 'Create Listing' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { HOUSES_API } from '@/config/api'

const router = useRouter()

// Initial form values
const initialFormState = {
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
  description: ''
}

const form = ref({ ...initialFormState })
const selectedImage = ref(null)
const imagePreview = ref(null)

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Reset form
function resetForm() {
  form.value = { ...initialFormState }
  selectedImage.value = null
  imagePreview.value = null
  successMessage.value = ''
  errorMessage.value = ''
}

// When image is selected
function handleImageSelect(event) {
  const file = event.target.files[0]
  if (file) {
    console.log('File selected:', file.name, file.type, file.size)
    
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select a valid image file (JPG, PNG, etc.)'
      selectedImage.value = null
      imagePreview.value = null
      return
    }
    
    // Max 10MB check
    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 10MB'
      selectedImage.value = null
      imagePreview.value = null
      return
    }
    
    selectedImage.value = file
    errorMessage.value = ''
    
    // For preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Reset form when page changes
onUnmounted(() => {
  resetForm()
})

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!form.value.price || form.value.price <= 0) {
    errorMessage.value = 'Please enter a valid price'
    return
  }

  // Image check
  if (!selectedImage.value) {
    errorMessage.value = 'Please select a house photo'
    return
  }

  isLoading.value = true

  try {
    // Create FormData (format expected by API)
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

    console.log('Submitting form:', Object.fromEntries(formData))

    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.HOUSES}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      },
      body: formData
    })

    isLoading.value = false

    if (response.ok) {
      const data = await response.json()
      console.log('Listing created:', data)
      
      const houseId = data.id
      
      // Upload image if exists
      if (selectedImage.value && houseId) {
        await uploadImage(houseId)
      } else {
        // Redirect directly if no image
        isLoading.value = false
        successMessage.value = '✓ Listing created successfully!'
        resetForm()
        router.push(`/houses/${houseId}`)
      }
    } else {
      isLoading.value = false
      const error = await response.text()
      console.error('API Error:', error)
      errorMessage.value = error || 'Could not create listing. Please check all fields.'
    }
  } catch (err) {
    isLoading.value = false
    console.error('Create error:', err)
    errorMessage.value = 'Could not connect to server. Please check your internet connection.'
  }
}

// Upload image
async function uploadImage(houseId) {
  try {
    const imageFormData = new FormData()
    imageFormData.append('image', selectedImage.value, selectedImage.value.name)

    console.log('=== IMAGE UPLOAD STARTING ===')
    console.log('House ID:', houseId)
    console.log('File name::', selectedImage.value.name)
    console.log('File size:', selectedImage.value.size, 'bytes')
    console.log('File type:', selectedImage.value.type)
    console.log('API URL:', `${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.UPLOAD_IMAGE(houseId)}`)

    const response = await fetch(`${HOUSES_API.BASE_URL}${HOUSES_API.ENDPOINTS.UPLOAD_IMAGE(houseId)}`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HOUSES_API.API_KEY
      },
      body: imageFormData
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    isLoading.value = false

    if (response.ok) {
      const result = await response.json().catch(() => ({}))
      console.log('✓ Image uploaded successfully:', result)
      successMessage.value = '✓ Listing and image uploaded successfully!'
      resetForm()
      
      // Redirect to detail page after successful creation
      router.push(`/houses/${houseId}`)
    } else {
      const errorText = await response.text()
      console.error('❌ Image upload error:')
      console.error('Status:', response.status)
      console.error('Error:', errorText)
      
      errorMessage.value = `Listing created but image could not be uploaded: ${errorText}`
      
      // Redirect to detail page even if image upload fails
      setTimeout(() => {
        router.push(`/houses/${houseId}`)
      }, 2000)
    }
  } catch (err) {
    isLoading.value = false
    console.error('❌ Upload exception:', err)
    errorMessage.value = `Listing created but error uploading image: ${err.message}`
    
    // Redirect to detail page even on error
    setTimeout(() => {
      router.push(`/houses/${houseId}`)
    }, 2000)
  }
}

function goBack() {
  resetForm()
  router.push('/houses')
}
</script>

<style scoped>
.new-house-page {
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
}

.image-preview {
  margin-top: 12px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
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
}
</style>