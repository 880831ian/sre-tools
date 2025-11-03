<template>
  <div class="card tool-card h-100" @click="openTool">
    <div class="card-body text-center">
      <div class="tool-icon">
        <i :class="tool.icon" class="text-primary"></i>
      </div>
      <h3 class="card-title">{{ tool.name }}</h3>
      <p class="text-muted">{{ tool.description }}</p>

      <!-- Tags -->
      <div class="mt-3">
        <span
          v-for="tag in tool.tags"
          :key="tag"
          class="badge bg-secondary text-white me-1 mb-1"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="card-footer">
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">點擊使用工具</small>
        <i class="ti ti-arrow-right text-muted"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolCard",
  props: {
    tool: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openTool() {
      this.$emit("open-tool", this.tool);
    },
  },
  emits: ["open-tool"],
};
</script>

<style scoped>
.tool-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.tool-card:hover {
  border-color: #0054a6;
}

.tool-icon i {
  font-size: 3rem;
}
</style>
