import { ref, watch } from 'vue'

export function useDarkMode() {
  // 從 localStorage 讀取深色模式設定
  const getStoredDarkMode = () => {
    try {
      const stored = localStorage.getItem('dark-mode')
      return stored ? JSON.parse(stored) : false
    } catch {
      return false
    }
  }
  
  const isDark = ref(getStoredDarkMode())
  
  const toggleDarkMode = () => {
    console.log('切換深色模式:', isDark.value, '->', !isDark.value)
    isDark.value = !isDark.value
    // 保存到 localStorage
    try {
      localStorage.setItem('dark-mode', JSON.stringify(isDark.value))
    } catch (e) {
      console.warn('無法保存深色模式設定')
    }
  }
  
  const setDarkMode = (value) => {
    isDark.value = value
    try {
      localStorage.setItem('dark-mode', JSON.stringify(value))
    } catch (e) {
      console.warn('無法保存深色模式設定')
    }
  }
  
  // 監聽變化並應用到 document
  watch(isDark, (newValue) => {
    if (newValue) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      document.body.classList.add('theme-dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      document.body.classList.remove('theme-dark')
    }
  }, { immediate: true })
  
  return {
    isDark,
    toggleDarkMode,
    setDarkMode
  }
}