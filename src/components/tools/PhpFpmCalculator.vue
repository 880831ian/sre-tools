<template>
  <div class="php-fpm-calculator">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">系統資源</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">可用記憶體 (MB)</label>
              <input
                type="number"
                class="form-control"
                v-model="availableMemory"
                @input="calculate"
                placeholder="4096"
              />
            </div>

            <div class="mb-3">
              <label class="form-label"
                >平均每個 PHP 程序記憶體使用量 (MB)</label
              >
              <input
                type="number"
                class="form-control"
                v-model="avgProcessMemory"
                @input="calculate"
                placeholder="50"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">預期同時連線數</label>
              <input
                type="number"
                class="form-control"
                v-model="expectedConnections"
                @input="calculate"
                placeholder="100"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">伺服器類型</label>
              <select
                class="form-select"
                v-model="serverType"
                @change="calculate"
              >
                <option value="web">Web 伺服器</option>
                <option value="api">API 伺服器</option>
                <option value="mixed">混合用途</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-settings me-2"></i>
              建議配置
            </h3>
          </div>
          <div class="card-body">
            <div v-if="result">
              <div class="alert alert-info">
                <strong>基於你的系統資源，建議以下 PHP-FPM 配置：</strong>
              </div>

              <div class="table-responsive">
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>pm</strong></td>
                      <td>
                        <code>{{ result.pm }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>pm.max_children</strong></td>
                      <td>
                        <code>{{ result.maxChildren }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>pm.start_servers</strong></td>
                      <td>
                        <code>{{ result.startServers }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>pm.min_spare_servers</strong></td>
                      <td>
                        <code>{{ result.minSpareServers }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>pm.max_spare_servers</strong></td>
                      <td>
                        <code>{{ result.maxSpareServers }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>pm.max_requests</strong></td>
                      <td>
                        <code>{{ result.maxRequests }}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-3">
                <h5>記憶體使用預估</h5>
                <div class="progress mb-2">
                  <div
                    class="progress-bar"
                    :style="{ width: result.memoryUsagePercent + '%' }"
                  >
                    {{ result.memoryUsagePercent }}%
                  </div>
                </div>
                <small class="text-muted">
                  預估使用 {{ result.estimatedMemory }} MB /
                  {{ availableMemory }} MB
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">完整配置檔案</h3>
          </div>
          <div class="card-body">
            <pre
              class="bg-dark text-light p-3 rounded"
            ><code v-if="result">{{ generateConfig() }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhpFpmCalculator",
  data() {
    return {
      availableMemory: 4096,
      avgProcessMemory: 50,
      expectedConnections: 100,
      serverType: "web",
      result: null,
    };
  },
  mounted() {
    this.calculate();
  },
  methods: {
    calculate() {
      if (!this.availableMemory || !this.avgProcessMemory) {
        return;
      }

      // 計算最大子程序數
      const maxChildren = Math.floor(
        (this.availableMemory * 0.8) / this.avgProcessMemory
      );

      // 根據伺服器類型調整
      let multiplier = 1;
      switch (this.serverType) {
        case "api":
          multiplier = 0.8; // API 伺服器通常需要更多記憶體
          break;
        case "mixed":
          multiplier = 0.9;
          break;
      }

      const adjustedMaxChildren = Math.floor(maxChildren * multiplier);

      // 計算其他參數
      const startServers = Math.ceil(adjustedMaxChildren * 0.25);
      const minSpareServers = Math.ceil(adjustedMaxChildren * 0.1);
      const maxSpareServers = Math.ceil(adjustedMaxChildren * 0.4);
      const maxRequests = 1000;

      const estimatedMemory = adjustedMaxChildren * this.avgProcessMemory;
      const memoryUsagePercent = Math.round(
        (estimatedMemory / this.availableMemory) * 100
      );

      this.result = {
        pm: "dynamic",
        maxChildren: adjustedMaxChildren,
        startServers,
        minSpareServers,
        maxSpareServers,
        maxRequests,
        estimatedMemory,
        memoryUsagePercent,
      };
    },
    generateConfig() {
      if (!this.result) return "";

      return `; PHP-FPM 配置建議
; 基於系統記憶體: ${this.availableMemory} MB
; 平均程序記憶體: ${this.avgProcessMemory} MB

[www]
user = www-data
group = www-data
listen = /run/php/php-fpm.sock
listen.owner = www-data
listen.group = www-data

; 程序管理設定
pm = ${this.result.pm}
pm.max_children = ${this.result.maxChildren}
pm.start_servers = ${this.result.startServers}
pm.min_spare_servers = ${this.result.minSpareServers}
pm.max_spare_servers = ${this.result.maxSpareServers}
pm.max_requests = ${this.result.maxRequests}

; 效能調整
pm.process_idle_timeout = 10s
request_terminate_timeout = 30s

; 日誌設定
php_admin_value[error_log] = /var/log/fpm-php.www.log
php_admin_flag[log_errors] = on
php_value[session.save_handler] = files
php_value[session.save_path] = /var/lib/php/sessions`;
    },
  },
};
</script>
