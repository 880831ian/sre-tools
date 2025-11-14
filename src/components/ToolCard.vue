<template>
  <div class="card tool-card h-100" @click="openTool">
    <!-- Badge Ribbon -->
    <div v-if="tool.badge" class="ribbon" :class="`ribbon-${tool.badge.color}`">
      {{ tool.badge.text }}
    </div>
    
    <div class="card-body text-center">
      <div class="tool-icon">
        <i :class="tool.icon" class="text-primary"></i>
      </div>
      <h3 class="card-title">{{ tool.name }}</h3>
      <p class="text-muted" v-html="tool.description"></p>

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
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  border-color: #0054a6;
}

.tool-icon i {
  font-size: 3rem;
}

.ribbon {
  position: absolute;
  top: 10px;
  right: -30px;
  padding: 5px 35px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  transform: rotate(45deg);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ribbon-danger {
  background-color: #dc3545;
}

.ribbon-primary {
  background-color: #0054a6;
}

.ribbon-success {
  background-color: #28a745;
}

.ribbon-warning {
  background-color: #ffc107;
  color: #000;
}

.ribbon-info {
  background-color: #17a2b8;
}
</style>
