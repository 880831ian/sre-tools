<template>
  <div>
    <!-- Development Banner -->
    <div
      class="alert alert-info alert-dismissible mb-0 rounded-0 border-0"
      role="alert"
    >
      <div class="container-fluid">
        <div class="d-flex align-items-center">
          <i class="ti ti-info-circle me-2"></i>
          <span
            >目前網站還在開發調整中，有些功能尚未正常運作(若已完成會標示已完成圖樣)，敬請見諒。</span
          >
          <button
            type="button"
            class="btn-close ms-auto"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container-fluid">
        <div class="text-center">
          <h1 class="display-4 fw-bold mb-3">SRE 工具箱</h1>
          <p class="lead mb-4">
            此工具集合了 SRE
            日常會使用到的工具(平常都需要開啟很多的不同網站，故想要將所有功能整合在一個頁面)，使用
            Kiro 進行開發，僅微調 Bug 以及排版，歡迎大家使用。
          </p>

          <!-- Search Box -->
          <div
            class="search-box mx-auto position-relative"
            style="max-width: 600px"
          >
            <i class="ti ti-search position-absolute search-icon"></i>
            <input
              type="text"
              class="form-control form-control-lg"
              style="padding-left: 45px"
              placeholder="搜尋工具..."
              v-model="searchQuery"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-wrapper">
      <div class="page-body">
        <div class="container-fluid">
          <!-- 文字處理工具 -->
          <div
            class="category-section"
            v-if="filteredTools.textTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-file-text me-2"></i>
              文字處理工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.textTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>

          <!-- 系統管理工具 -->
          <div
            class="category-section"
            v-if="filteredTools.systemTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-server me-2"></i>
              系統管理工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.systemTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>

          <!-- 網路工具 -->
          <div
            class="category-section"
            v-if="filteredTools.networkTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-network me-2"></i>
              網路工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.networkTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>

          <!-- 安全工具 -->
          <div
            class="category-section"
            v-if="filteredTools.securityTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-shield-check me-2"></i>
              安全工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.securityTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>

          <!-- 開發工具 -->
          <div
            class="category-section"
            v-if="filteredTools.devTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-code me-2"></i>
              開發工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.devTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>

          <!-- PDF 工具 -->
          <div
            class="category-section"
            v-if="filteredTools.pdfTools.length > 0"
          >
            <h2 class="mb-4">
              <i class="ti ti-file-type-pdf me-2"></i>
              PDF 工具
            </h2>
            <div class="row">
              <div
                v-for="tool in filteredTools.pdfTools"
                :key="tool.id"
                class="col-sm-6 col-lg-4 mb-4"
              >
                <ToolCard :tool="tool" @open-tool="openTool" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolCard from "../components/ToolCard.vue";
import { tools } from "../data/tools.js";

export default {
  name: "Home",
  components: {
    ToolCard,
  },
  data() {
    return {
      searchQuery: "",
      tools,
    };
  },
  computed: {
    filteredTools() {
      if (!this.searchQuery) {
        return this.tools;
      }

      const query = this.searchQuery.toLowerCase();
      const filtered = {};

      Object.keys(this.tools).forEach((category) => {
        filtered[category] = this.tools[category].filter((tool) => {
          const toolName = tool.name.toLowerCase();
          const toolDesc = tool.description.toLowerCase();
          return (
            toolName.includes(query) ||
            toolDesc.includes(query) ||
            tool.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        });
      });

      return filtered;
    },
  },
  methods: {
    openTool(tool) {
      this.$router.push(`/tools/${tool.id}`);
    },
  },
};
</script>

<style scoped>
.search-icon {
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: var(--tblr-body-color);
  opacity: 0.6;
}

/* 淺色模式 */
:root:not([data-bs-theme="dark"]) .search-icon {
  color: #000;
  opacity: 0.5;
}

/* 深色模式 */
[data-bs-theme="dark"] .search-icon {
  color: #fff;
  opacity: 0.7;
}
</style>
