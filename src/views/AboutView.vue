<template>
  <div class="about-page">
    <div class="table-wrapper">
      <h1>About DirectHouse</h1>
      <p class="intro">DirectHouse is a modern platform for finding and listing houses. Browse thousands of properties or create your own listings with ease.</p>
      
      <div class="about-section">
        <h2>🏠 What You Can Do</h2>
        <ul class="feature-list">
          <li><strong>Browse Houses:</strong> Search through all available house listings with advanced filters</li>
          <li><strong>Search:</strong> Find houses by location (city, street, or postal code) with instant results</li>
          <li><strong>Sort & Filter:</strong> Organize listings by price, size, date, or number of rooms</li>
          <li><strong>View Details:</strong> See comprehensive information including photos, location maps, and property features</li>
        </ul>
      </div>

      <div class="about-section">
        <h2>🔐 With Login You Can</h2>
        <ul class="feature-list">
          <li><strong>Create Listings:</strong> Post your own house listings with photos and detailed information</li>
          <li><strong>Manage Properties:</strong> Edit or delete your listings anytime</li>
          <li><strong>Save Favorites:</strong> Add houses to your favorites for quick access later</li>
          <li><strong>View History:</strong> Your last 3 viewed houses are automatically saved</li>
          <li><strong>Edit Profile:</strong> Update your account information and password</li>
        </ul>
      </div>

      <div class="about-section">
        <h2>✨ Features</h2>
        <ul class="feature-list">
          <li>User-friendly and modern interface</li>
          <li>Detailed property information with Google Maps integration</li>
          <li>Smart search with minimum 3 character requirement</li>
          <li>Automatic logout after 1 minute of inactivity for security</li>
          <li>Responsive design for all devices</li>
        </ul>
      </div>

      <div class="contact-section">
        <h2>📧 Get Started</h2>
        <p>Ready to find your dream home? <RouterLink to="/register" class="link">Create an account</RouterLink> or <RouterLink to="/houses" class="link">browse houses</RouterLink> now!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.about-page {
  width: 100%;
  padding: 20px 0;
}

.table-wrapper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

h1 {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

h2 {
  margin: 0 0 16px 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}

.intro {
  font-size: 18px;
  color: #555;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
}

.about-section {
  box-sizing: border-box;
  margin: 32px 0;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #ffb400;
}

.feature-list {
  margin: 0;
  padding-left: 24px;
  list-style: none;
}

.feature-list li {
  position: relative;
  margin-bottom: 12px;
  color: #555;
  line-height: 1.6;
  padding-left: 20px;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #ffb400;
  font-weight: bold;
}

.feature-list li strong {
  color: #333;
}

.contact-section {
  margin-top: 32px;
  padding: 24px;
  background: #ffb400;
  border-radius: 8px;
  text-align: center;
}

.contact-section h2 {
  color: white;
  justify-content: center;
}

.contact-section p {
  color: white;
  font-size: 16px;
  margin: 0;
}

.link {
  color: white;
  font-weight: 600;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.link:hover {
  opacity: 0.8;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 30px 20px;
  }

  h1 {
    font-size: 26px;
  }

  .intro {
    font-size: 16px;
  }

  .about-section {
    padding: 20px;
  }

  h2 {
    font-size: 20px;
  }

  .feature-list li {
    font-size: 14px;
  }

  .contact-section {
    padding: 20px;
  }

  .contact-section h2 {
    font-size: 22px;
  }

  .contact-section p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    padding: 24px 16px;
  }

  h1 {
    font-size: 24px;
  }

  .intro {
    font-size: 15px;
  }

  .about-section {
    padding: 16px;
  }

  h2 {
    font-size: 18px;
  }

  .feature-list li {
    font-size: 13px;
  }

  .contact-section {
    padding: 16px;
  }

  .contact-section h2 {
    font-size: 20px;
  }

  .contact-section p {
    font-size: 14px;
  }
}
</style>
