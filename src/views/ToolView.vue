<template>
  <div class="tool-view">
    <div class="container-fluid py-4">
      <!-- 工具標題 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="header-wrapper">
            <div class="d-flex align-items-center mb-3">
              <h1 class="mb-0 flex-grow-1">
                <i :class="tool?.icon" class="me-2"></i>
                {{ tool?.name }}
                <small class="text-muted fs-5" v-if="toolGroup"
                  >/ {{ toolGroup }}</small
                >
              </h1>
              <button class="btn btn-outline-secondary ms-3" @click="goBack">
                <i class="ti ti-arrow-left me-1"></i>
                返回
              </button>
            </div>
            <div class="description-text">
              <p class="text-muted mb-0" v-html="tool?.description || ''"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具內容 -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <component v-if="tool" :is="tool.component" />
              <div v-else class="text-center py-5">
                <h3>工具不存在</h3>
                <p class="text-muted">
                  找不到指定的工具或是連結錯誤，請先回到首頁並重新點擊
                </p>
                <button class="btn btn-primary" @click="goBack">
                  返回首頁
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToolById, getToolGroup } from "../data/tools.js";
import FluentFormatter from "../components/tools/FluentFormatter.vue";
import DiffChecker from "../components/tools/DiffChecker.vue";
import RegexTester from "../components/tools/RegexTester.vue";
import CronParser from "../components/tools/CronParser.vue";
import PhpFpmCalculator from "../components/tools/PhpFpmCalculator.vue";
import NginxFormatter from "../components/tools/NginxFormatter.vue";
import IpCalculator from "../components/tools/IpCalculator.vue";
import EksCniCalculator from "../components/tools/EksCniCalculator.vue";
import SslChecker from "../components/tools/SslChecker.vue";
import CodeFormatter from "../components/tools/CodeFormatter.vue";
import DataGenerator from "../components/tools/DataGenerator.vue";

export default {
  name: "ToolView",
  components: {
    FluentFormatter,
    DiffChecker,
    RegexTester,
    CronParser,
    PhpFpmCalculator,
    NginxFormatter,
    IpCalculator,
    EksCniCalculator,
    SslChecker,
    CodeFormatter,
    DataGenerator,
  },
  props: {
    toolId: {
      type: String,
      required: true,
    },
  },
  computed: {
    tool() {
      return getToolById(this.toolId);
    },
    toolGroup() {
      return getToolGroup(this.toolId);
    },
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
  },
  mounted() {
    // 設置頁面標題和 SEO meta tags
    if (this.tool) {
      const seoTitle = this.tool.seo?.title || `${this.tool.name} - SRE 工具箱`;
      const seoDescription =
        this.tool.seo?.description || this.tool.description;
      const seoKeywords = this.tool.seo?.keywords || this.tool.tags?.join(", ");

      document.title = seoTitle;

      // 更新或創建 meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = seoDescription;

      // 更新或創建 meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = seoKeywords;

      // 更新 Open Graph tags
      this.updateMetaTag("property", "og:title", seoTitle);
      this.updateMetaTag("property", "og:description", seoDescription);
      this.updateMetaTag("property", "og:url", window.location.href);

      // 更新 Twitter Card tags
      this.updateMetaTag("name", "twitter:title", seoTitle);
      this.updateMetaTag("name", "twitter:description", seoDescription);

      // 更新 canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    }
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    updateMetaTag(attr, attrValue, content) {
      let meta = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    },
  },
};
</script>

<style scoped>
.tool-view {
  min-height: calc(100vh - 200px);
}

.header-wrapper h1 {
  font-size: 1.75rem;
  line-height: 1.2;
}

.description-text {
  padding-left: 0.7rem;
}

@media (min-width: 768px) {
  .header-wrapper h1 {
    font-size: 2.5rem;
  }
}
</style>
