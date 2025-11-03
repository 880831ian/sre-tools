<template>
  <div class="tool-view">
    <div class="container-xl py-4">
      <!-- 工具標題 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary me-3" @click="goBack">
              <i class="ti ti-arrow-left me-1"></i>
              返回
            </button>
            <div>
              <h1 class="mb-1">
                <i :class="tool?.icon" class="me-2"></i>
                {{ tool?.name }}
                <small class="text-muted fs-5" v-if="toolGroup"
                  >({{ toolGroup }})</small
                >
              </h1>
              <p class="text-muted mb-0">&nbsp;&nbsp;{{ tool?.description }}</p>
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
    // 設置頁面標題
    if (this.tool) {
      document.title = `${this.tool.name} - SRE 工具箱`;
    }
  },
};
</script>

<style scoped>
.tool-view {
  min-height: calc(100vh - 200px);
}
</style>
