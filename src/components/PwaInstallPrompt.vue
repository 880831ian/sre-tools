<template>
  <div v-if="showInstallPrompt" class="pwa-install-banner">
    <div class="alert alert-info alert-dismissible fade show" role="alert">
      <div class="d-flex align-items-center">
        <i class="ti ti-download me-3 fs-2"></i>
        <div class="flex-grow-1">
          <strong>安裝 SRE 工具箱</strong>
          <div class="text-muted">將應用程式安裝到您的裝置，享受更好的使用體驗</div>
        </div>
        <div class="btn-group ms-3">
          <button type="button" class="btn btn-primary btn-sm" @click="installPwa">
            <i class="ti ti-download me-1"></i>
            安裝
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="dismissPrompt">
            稍後
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PwaInstallPrompt',
  data() {
    return {
      showInstallPrompt: false,
      deferredPrompt: null
    }
  },
  mounted() {
    // 監聽 PWA 安裝提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      
      // 檢查是否已經安裝或已經拒絕過
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches
      
      if (!dismissed && !isInstalled) {
        this.showInstallPrompt = true
      }
    })
    
    // 監聽安裝完成事件
    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt = false
      this.deferredPrompt = null
    })
  },
  methods: {
    async installPwa() {
      if (!this.deferredPrompt) return
      
      try {
        await this.deferredPrompt.prompt()
        const { outcome } = await this.deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('PWA 安裝成功')
        } else {
          console.log('用戶取消安裝')
        }
      } catch (error) {
        console.error('PWA 安裝失敗:', error)
      }
      
      this.showInstallPrompt = false
      this.deferredPrompt = null
    },
    dismissPrompt() {
      this.showInstallPrompt = false
      localStorage.setItem('pwa-install-dismissed', 'true')
    }
  }
}
</script>

<style scoped>
.pwa-install-banner {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 1050;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .pwa-install-banner {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
}
</style>