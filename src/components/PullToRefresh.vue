<template>
  <div class="pull-to-refresh-container">
    <!-- 下拉刷新指示器 -->
    <div
      class="pull-to-refresh-indicator"
      :class="{ active: isPulling, refreshing: isRefreshing }"
      :style="{ transform: `translate(-50%, ${pullDistance}px)` }"
    >
      <div
        class="spinner-border spinner-border-sm"
        role="status"
        v-if="isRefreshing"
      >
        <span class="visually-hidden">載入中...</span>
      </div>
      <i v-else class="ti ti-arrow-down" :class="{ rotate: canRefresh }"></i>
      <span class="ms-2">{{ refreshText }}</span>
    </div>

    <!-- 更新提示 -->
    <div
      v-if="showUpdatePrompt"
      class="update-prompt alert alert-success alert-dismissible fade show"
    >
      <div
        class="d-flex flex-column flex-sm-row align-items-center justify-content-center text-center"
      >
        <div class="d-flex align-items-center mb-2 mb-sm-0">
          <i class="ti ti-refresh me-2"></i>
          <span>有新版本可用！</span>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-success ms-sm-3"
          @click="updateApp"
        >
          立即更新
        </button>
        <button
          type="button"
          class="btn-close position-absolute"
          style="top: 10px; right: 10px"
          @click="showUpdatePrompt = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PullToRefresh",
  data() {
    return {
      startY: 0,
      pullDistance: 0,
      isPulling: false,
      isRefreshing: false,
      canRefresh: false,
      threshold: 80, // 觸發刷新的距離
      showUpdatePrompt: false,
      registration: null,
    };
  },
  computed: {
    refreshText() {
      if (this.isRefreshing) return "更新中...";
      if (this.canRefresh) return "放開以更新";
      return "下拉以更新";
    },
  },
  mounted() {
    this.initPullToRefresh();
    this.checkForUpdates();
  },
  beforeUnmount() {
    this.removePullToRefresh();
  },
  methods: {
    initPullToRefresh() {
      document.addEventListener("touchstart", this.handleTouchStart, {
        passive: true,
      });
      document.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd, {
        passive: true,
      });
    },
    removePullToRefresh() {
      document.removeEventListener("touchstart", this.handleTouchStart);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchend", this.handleTouchEnd);
    },
    handleTouchStart(e) {
      // 只在頁面頂部時啟用下拉刷新
      if (window.scrollY === 0) {
        this.startY = e.touches[0].clientY;
      }
    },
    handleTouchMove(e) {
      if (this.isRefreshing || this.startY === 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - this.startY;

      // 只在向下拉且在頂部時處理
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        this.isPulling = true;
        // 使用阻尼效果
        this.pullDistance = Math.min(distance * 0.5, this.threshold * 1.5);
        this.canRefresh = this.pullDistance >= this.threshold;
      }
    },
    async handleTouchEnd() {
      if (!this.isPulling) return;

      this.isPulling = false;

      if (this.canRefresh) {
        this.isRefreshing = true;
        // 保持當前的下拉距離，不要重置
        await this.refresh();
      } else {
        // 如果沒有達到刷新閾值，才重置
        setTimeout(() => {
          this.pullDistance = 0;
          this.canRefresh = false;
        }, 300);
      }
    },
    async refresh() {
      try {
        // 清除緩存並重新載入
        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          // 發送清除緩存消息
          navigator.serviceWorker.controller.postMessage({
            type: "CLEAR_CACHE",
          });

          // 等待緩存清除
          await new Promise((resolve) => {
            const messageHandler = (event) => {
              if (event.data && event.data.type === "CACHE_CLEARED") {
                navigator.serviceWorker.removeEventListener(
                  "message",
                  messageHandler
                );
                resolve();
              }
            };
            navigator.serviceWorker.addEventListener("message", messageHandler);

            // 超時保護
            setTimeout(resolve, 2000);
          });
        }

        // 重新載入頁面
        window.location.reload();
      } catch (error) {
        console.error("刷新失敗:", error);
        this.isRefreshing = false;
      }
    },
    async checkForUpdates() {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          this.registration = registration;

          // 檢查更新
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // 有新版本可用
                this.showUpdatePrompt = true;
              }
            });
          });

          // 定期檢查更新（每小時）
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        } catch (error) {
          console.error("Service Worker 註冊失敗:", error);
        }
      }
    },
    updateApp() {
      if (this.registration && this.registration.waiting) {
        // 告訴等待中的 Service Worker 跳過等待
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" });

        // 監聽控制器變更
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });
      }
    },
  },
};
</script>

<style scoped>
.pull-to-refresh-container {
  position: relative;
}

.pull-to-refresh-indicator {
  position: fixed;
  top: -60px;
  left: 50%;
  background: var(--tblr-bg-surface);
  padding: 12px 24px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.pull-to-refresh-indicator.active {
  opacity: 1;
}

.pull-to-refresh-indicator.refreshing {
  opacity: 1;
}

.pull-to-refresh-indicator i {
  transition: transform 0.3s ease;
}

.pull-to-refresh-indicator i.rotate {
  transform: rotate(180deg);
}

.update-prompt {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1050;
  max-width: 500px;
  width: auto;
  margin: 0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem 2.5rem 1rem 1rem;
}

@media (max-width: 768px) {
  .update-prompt {
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 20px);
    width: auto;
    padding: 1rem 2rem 1rem 1rem;
  }
}
</style>
