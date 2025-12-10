import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_HISTORY = 3

export const useHistoryStore = defineStore('history', () => {
  const historyIds = ref([])

  // Add to history (max 3 items)
  function addToHistory(houseId) {
    // Remove if already exists
    const index = historyIds.value.indexOf(houseId)
    if (index > -1) {
      historyIds.value.splice(index, 1)
    }

    // Add to beginning
    historyIds.value.unshift(houseId)

    // Keep max 3 items
    if (historyIds.value.length > MAX_HISTORY) {
      historyIds.value = historyIds.value.slice(0, MAX_HISTORY)
    }

    saveHistory()
    console.log('Added to history:', houseId, 'Total:', historyIds.value.length)
  }

  // Save to SessionStorage
  function saveHistory() {
    sessionStorage.setItem('history', JSON.stringify(historyIds.value))
  }

  // Load from SessionStorage
  function loadHistory() {
    const saved = sessionStorage.getItem('history')
    if (saved) {
      historyIds.value = JSON.parse(saved)
      // Limit to max 3 (if old data exists)
      if (historyIds.value.length > MAX_HISTORY) {
        historyIds.value = historyIds.value.slice(0, MAX_HISTORY)
      }
    }
  }

  // Clear
  function clearHistory() {
    historyIds.value = []
    sessionStorage.removeItem('history')
    console.log('History cleared')
  }

  return {
    historyIds,
    addToHistory,
    loadHistory,
    clearHistory
  }
})

