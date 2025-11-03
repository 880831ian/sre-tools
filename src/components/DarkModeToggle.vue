<template>
  <button
    class="btn btn-outline-primary btn-lg"
    @click="toggleDarkMode"
    :title="isDark ? '淺色模式' : '深色模式'"
  >
    <i class="ti ti-moon" v-if="!isDark"></i>
    <i class="ti ti-sun" v-else></i>
  </button>
</template>

<script>
import { useDarkMode } from "../composables/useDarkMode";

export default {
  name: "DarkModeToggle",
  setup() {
    const { isDark, toggleDarkMode } = useDarkMode();

    return {
      isDark,
      toggleDarkMode,
    };
  },
};
</script>
