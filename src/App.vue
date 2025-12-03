<template>
  <div class="page">
    <!-- Pull to Refresh -->
    <PullToRefresh />

    <!-- Header -->
    <header class="navbar navbar-expand-md navbar-light d-print-none">
      <div class="container-fluid">
        <h1 class="navbar-brand navbar-brand-autodark pe-0 pe-md-3">
          <router-link to="/" class="text-decoration-none">
            <i class="ti ti-tools me-2"></i>
            SRE 工具箱
          </router-link>
        </h1>
        <div class="navbar-nav flex-row order-md-last">
          <!-- Dark Mode Toggle -->
          <div class="nav-item">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>

    <!-- Router View -->
    <router-view />

    <!-- Footer -->
    <footer class="footer footer-transparent d-print-none">
      <div class="container-fluid">
        <div class="row text-center align-items-center flex-row-reverse">
          <div class="col-12 col-lg-auto mt-3 mt-lg-0">
            <ul class="list-inline list-inline-dots mb-0">
              <li class="list-inline-item">
                開發人員：<a href="https://pin-yi.me">Pin-Yi</a> & Kiro
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>

    <!-- PWA Install Prompt -->
    <PwaInstallPrompt />
  </div>
</template>

<script>
import PwaInstallPrompt from "./components/PwaInstallPrompt.vue";
import DarkModeToggle from "./components/DarkModeToggle.vue";
import PullToRefresh from "./components/PullToRefresh.vue";

export default {
  name: "App",
  components: {
    PwaInstallPrompt,
    DarkModeToggle,
    PullToRefresh,
  },
  mounted() {
    // 頁面載入時滾動到頂部（包含重新整理的情況）
    window.scrollTo(0, 0);
  },
};
</script>
