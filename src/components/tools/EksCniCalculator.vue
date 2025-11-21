<template>
  <div class="eks-cni-calculator">
    <div class="row">
      <div class="col-lg-6">
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-settings me-2"></i>
              節點配置
            </h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">EC2 實例類型</label>
              <div class="instance-selector position-relative">
                <input
                  type="text"
                  class="form-control"
                  v-model="searchQuery"
                  @focus="showDropdown = true"
                  @input="onSearchInput"
                  placeholder="搜尋實例類型... (例如: t3, m5.large)"
                  autocomplete="off"
                />
                <div
                  v-if="showDropdown"
                  class="dropdown-menu show w-100"
                  style="max-height: 400px; overflow-y: auto"
                  @scroll="handleScroll"
                  ref="dropdownMenu"
                >
                  <div
                    v-for="instance in visibleInstances"
                    :key="instance.type"
                    class="dropdown-item"
                    :class="{ active: selectedInstance === instance.type }"
                    @click="selectInstance(instance.type)"
                    style="cursor: pointer"
                  >
                    <div
                      class="d-flex justify-content-between align-items-center gap-3"
                    >
                      <div class="flex-shrink-0">
                        <strong>{{ instance.type }}</strong>
                        <span class="text-muted ms-2"
                          >({{ instance.family }})</span
                        >
                      </div>
                      <div
                        class="flex-shrink-0 d-flex align-items-center gap-2"
                      >
                        <small class="text-muted text-nowrap">
                          {{ instance.maxeni }} ENIs ·
                          {{ instance.ipv4addr }} IPs/ENI
                        </small>
                        <span class="badge bg-green text-white text-nowrap">
                          Max Pods: {{ instance.maxpods }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="hasMoreInstances"
                    class="dropdown-item text-center text-muted"
                  >
                    <small>向下滾動載入更多...</small>
                  </div>
                  <div
                    v-if="filteredInstances.length === 0"
                    class="dropdown-item text-center text-muted"
                  >
                    找不到符合的實例類型
                  </div>
                </div>
              </div>
              <div class="form-hint">
                已選擇: <strong>{{ selectedInstanceDisplay }}</strong>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">節點數量</label>
              <input
                type="number"
                class="form-control"
                v-model.number="nodeCount"
                min="1"
                @input="calculate"
                @blur="
                  if (nodeCount < 1) {
                    nodeCount = 1;
                    calculate();
                  }
                "
              />
            </div>

            <div class="mb-3">
              <label class="form-label">子網路 CIDR</label>
              <input
                type="text"
                class="form-control font-monospace"
                v-model="subnetCidr"
                placeholder="例如: 10.0.1.0/24"
                @input="calculate"
              />
              <div class="form-hint">輸入子網路的 CIDR 記號</div>
            </div>

            <div class="mb-3">
              <label class="form-label">子網路數量</label>
              <input
                type="number"
                class="form-control"
                v-model.number="subnetCount"
                min="1"
                @input="calculate"
                @blur="
                  if (subnetCount < 1) {
                    subnetCount = 1;
                    calculate();
                  }
                "
              />
              <div class="form-hint">
                集群使用的子網路數量（每個子網路使用相同的 CIDR 大小）
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-bolt me-2"></i>
              快速選擇
            </h3>
          </div>
          <div class="card-body">
            <div class="btn-group-vertical w-100">
              <button
                class="btn btn-outline-primary"
                @click="setExample('t3.medium', '10.0.1.0/24', 3, 1)"
              >
                小型集群 (t3.medium × 3, 1 subnet)
              </button>
              <button
                class="btn btn-outline-primary"
                @click="setExample('t3.large', '10.0.0.0/24', 5, 2)"
              >
                中型集群 (t3.large × 5, 2 subnets)
              </button>
              <button
                class="btn btn-outline-primary"
                @click="setExample('m5.xlarge', '10.0.0.0/24', 10, 3)"
              >
                大型集群 (m5.xlarge × 10, 3 subnets)
              </button>
              <button
                class="btn btn-outline-primary"
                @click="setExample('c5.2xlarge', '10.0.0.0/24', 20, 4)"
              >
                超大型集群 (c5.2xlarge × 20, 4 subnets)
              </button>
            </div>
          </div>
        </div>

        <!-- 警告卡片移到左側 -->
        <div
          v-if="result && !error && result.warnings.length > 0"
          class="card mb-4"
        >
          <div class="card-header bg-warning">
            <h3 class="card-title">
              <i class="ti ti-alert-triangle me-2"></i>
              警告
            </h3>
          </div>
          <div class="card-body">
            <ul class="mb-0">
              <li
                v-for="(warning, index) in result.warnings"
                :key="index"
                class="mb-2"
              >
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <!-- 最多可分配的 Pod 數移到這裡 -->
        <div v-if="result && !error" class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-calculator me-2"></i>
              最多可分配的 Pod 數量
              <button
                class="btn-icon ms-2"
                @click="showPodHelp = !showPodHelp"
                type="button"
                title="查看說明"
              >
                <i class="ti ti-help-circle"></i>
              </button>
            </h3>
          </div>
          <div class="card-body">
            <div v-if="showPodHelp" class="alert alert-info mb-3">
              <strong>標準模式:</strong><br />
              每節點最多可分配的 Pod 數量 = ENI 數 × (每 ENI IP 數 - 1) + 2<br />
              <small class="text-muted"
                >每個 ENI 保留一個主 IP，最後加 2 是給 node level
                的系統用途（kubelet、CNI 內部運作）</small
              >
            </div>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td><strong>每節點最多 ENI 數</strong></td>
                  <td>
                    <span class="badge bg-blue text-white">{{
                      result.maxEnis
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>每 ENI IP 數</strong></td>
                  <td>
                    <span class="badge bg-blue text-white">{{
                      result.ipsPerEni
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>每節點最多可分配的 Pod 數量</strong></td>
                  <td>
                    <span class="badge bg-green text-white fs-4">{{
                      result.maxPodsPerNode
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>集群最多可分配的 Pod 數量</strong></td>
                  <td>
                    <span class="badge bg-purple text-white fs-4">{{
                      result.totalPods
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 子網路資訊移到這裡 -->
        <div v-if="result && !error" class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-network me-2"></i>
              AWS Subnet 資訊
              <button
                class="btn-icon ms-2"
                @click="showSubnetHelp = !showSubnetHelp"
                type="button"
                title="查看說明"
              >
                <i class="ti ti-help-circle"></i>
              </button>
            </h3>
          </div>
          <div class="card-body">
            <div v-if="showSubnetHelp" class="alert alert-info mb-3">
              <strong>AWS Subnet 計算方式：</strong><br />
              假設是 /24，計算是：32 - 24 = 8，2 的 8 次方 = 256<br />
              <small class="text-muted">
                AWS 會保留 5 個 IP：<br />
                • XX.XX.XX.0：網路位置<br />
                • XX.XX.XX.1：VPC 路由器位址<br />
                • XX.XX.XX.2：Amazon DNS 位址<br />
                • XX.XX.XX.3：保留給未來用途<br />
                • XX.XX.XX.255：廣播位址<br />
                所以最多可用的 IP 數量是 256 - 5 = 251
              </small>
            </div>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td><strong>子網路 CIDR</strong></td>
                  <td>
                    <code>{{ subnetCidr }}</code>
                  </td>
                </tr>
                <tr>
                  <td><strong>子網路數量</strong></td>
                  <td>
                    <span class="badge bg-cyan text-white">{{
                      subnetCount
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>單個子網路總 IP 數</strong></td>
                  <td>
                    <span class="badge bg-blue text-white">{{
                      result.totalIps
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>單個子網路 AWS 保留 IP</strong></td>
                  <td>
                    <span class="badge bg-red text-white">5</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>單個子網路可用 IP</strong></td>
                  <td>
                    <span class="badge bg-azure text-white">{{
                      result.singleSubnetIps
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>所有子網路可用 IP 總數</strong></td>
                  <td>
                    <span class="badge bg-blue text-white">{{
                      result.totalAvailableIps
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>最多所需 IP 數</strong>
                    <small class="text-muted d-block">
                      每節點最多所需 IP 數 x 節點數量
                    </small>
                  </td>
                  <td>
                    <span class="badge bg-orange text-white">{{
                      result.requiredIps
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><strong>最少剩餘 IP 數</strong></td>
                  <td>
                    <span
                      :class="
                        result.remainingIps >= 0
                          ? 'badge bg-green text-white'
                          : 'badge bg-red text-white'
                      "
                    >
                      {{ result.remainingIps }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>最多 IP 使用率</strong></td>
                  <td>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        :class="getUsageClass(result.ipUsagePercent)"
                        :style="{
                          width: Math.min(result.ipUsagePercent, 100) + '%',
                        }"
                      >
                        {{ result.ipUsagePercent.toFixed(1) }}%
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 詳細資訊卡片移到左側 -->
        <div v-if="result && !error" class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-file-text me-2"></i>
              詳細資訊
            </h3>
          </div>
          <div class="card-body">
            <h4 class="mb-3">資源需求</h4>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td>
                    <strong>每節點最多所需 IP 數</strong>
                    <small class="text-muted d-block">
                      每節點最多 ENI 數 x 每 ENI IP 數
                    </small>
                  </td>
                  <td>{{ result.ipsPerNode }}</td>
                </tr>
                <tr>
                  <td><strong>節點數量</strong></td>
                  <td>{{ nodeCount }}</td>
                </tr>
                <tr>
                  <td><strong>總 IP 需求</strong></td>
                  <td>{{ result.requiredIps }}</td>
                </tr>
              </tbody>
            </table>

            <h4 class="mb-3">建議</h4>
            <ul class="mb-0">
              <li v-if="result.ipUsagePercent > 80">
                IP 使用率較高，建議增加子網路數量或使用更大的子網路
              </li>
              <li v-if="result.ipUsagePercent < 30">
                IP 使用率較低，可以考慮減少子網路數量或使用較小的子網路以節省 IP
                資源
              </li>
              <li>建議預留 10-20% 的 IP 空間用於擴展和維護</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4">
      <i class="ti ti-alert-circle me-2"></i>
      {{ error }}
    </div>
  </div>
</template>

<script>
import { eksinstancetypes } from "../../data/eksInstanceTypes.js";

export default {
  name: "EksCniCalculator",
  data() {
    return {
      selectedInstance: "t3.medium",
      subnetCidr: "10.0.1.0/24",
      subnetCount: 1,
      nodeCount: 3,
      result: null,
      error: null,
      instanceTypes: eksinstancetypes,
      searchQuery: "",
      showDropdown: false,
      visibleCount: 50, // 初始顯示 50 個
      batchSize: 30, // 每次滾動載入 30 個
      showPodHelp: false, // 控制 Pod 說明顯示
      showSubnetHelp: false, // 控制 Subnet 說明顯示
    };
  },
  computed: {
    instancesByFamily() {
      const grouped = {};
      this.instanceTypes.forEach((instance) => {
        const familyName = instance.family || "其他";
        if (!grouped[familyName]) {
          grouped[familyName] = [];
        }
        grouped[familyName].push(instance);
      });
      // 按家族名稱排序
      return Object.keys(grouped)
        .sort()
        .reduce((acc, key) => {
          acc[key] = grouped[key];
          return acc;
        }, {});
    },
    filteredInstances() {
      if (!this.searchQuery.trim()) {
        return this.instanceTypes;
      }
      const query = this.searchQuery.toLowerCase();
      return this.instanceTypes.filter((instance) => {
        return (
          instance.type.toLowerCase().includes(query) ||
          instance.family.toLowerCase().includes(query)
        );
      });
    },
    visibleInstances() {
      return this.filteredInstances.slice(0, this.visibleCount);
    },
    hasMoreInstances() {
      return this.visibleCount < this.filteredInstances.length;
    },
    selectedInstanceDisplay() {
      const instance = this.instanceTypes.find(
        (i) => i.type === this.selectedInstance
      );
      return instance
        ? `${instance.type} (${instance.family})`
        : this.selectedInstance;
    },
  },
  mounted() {
    // 從 URL 參數載入配置
    this.loadFromUrl();
    this.calculate();
    // 設定初始搜尋值為當前選擇的實例
    this.searchQuery = this.selectedInstance;
    // 點擊外部關閉下拉選單
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    selectInstance(instanceType) {
      this.selectedInstance = instanceType;
      this.searchQuery = instanceType;
      this.showDropdown = false;
      this.calculate();
      this.updateUrl();
    },
    onSearchInput() {
      this.showDropdown = true;
      this.visibleCount = 50; // 重置可見數量
    },
    handleScroll(event) {
      const element = event.target;
      const scrollPercentage =
        (element.scrollTop + element.clientHeight) / element.scrollHeight;

      // 當滾動到 80% 時載入更多
      if (scrollPercentage > 0.8 && this.hasMoreInstances) {
        this.visibleCount += this.batchSize;
      }
    },
    handleClickOutside(event) {
      const selector = this.$el.querySelector(".instance-selector");
      if (selector && !selector.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    setExample(instanceType, cidr, nodes, subnets = 1) {
      this.selectedInstance = instanceType;
      this.searchQuery = instanceType;
      this.subnetCidr = cidr;
      this.nodeCount = nodes;
      this.subnetCount = subnets;
      this.calculate();
      this.updateUrl();
    },
    loadFromUrl() {
      const params = new URLSearchParams(window.location.search);
      if (params.has("instance")) {
        this.selectedInstance = params.get("instance");
      }
      if (params.has("cidr")) {
        this.subnetCidr = params.get("cidr");
      }
      if (params.has("nodes")) {
        this.nodeCount = Math.max(1, parseInt(params.get("nodes")) || 3);
      }
      if (params.has("subnets")) {
        this.subnetCount = Math.max(1, parseInt(params.get("subnets")) || 1);
      }
    },
    updateUrl() {
      const params = new URLSearchParams();
      params.set("instance", this.selectedInstance);
      params.set("cidr", this.subnetCidr);
      params.set("nodes", this.nodeCount.toString());
      params.set("subnets", this.subnetCount.toString());
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    },
    calculate() {
      this.error = null;
      this.result = null;

      // 確保最小值為 1
      if (this.nodeCount < 1) this.nodeCount = 1;
      if (this.subnetCount < 1) this.subnetCount = 1;

      // 更新 URL
      this.updateUrl();

      try {
        const instance = this.instanceTypes.find(
          (i) => i.type === this.selectedInstance
        );
        if (!instance) {
          throw new Error("請選擇實例類型");
        }

        // 計算每節點最多可分配的 Pod 數量（標準模式）
        // 標準模式: ENI × (IPs per ENI - 1) + 2
        const maxPodsPerNode = instance.maxeni * (instance.ipv4addr - 1) + 2;

        // 計算集群總容量
        const totalPods = maxPodsPerNode * this.nodeCount;

        // 計算子網路資訊
        const subnetInfo = this.calculateSubnetInfo();

        // 計算 IP 需求
        const ipsPerNode = instance.maxeni * instance.ipv4addr;
        const requiredIps = ipsPerNode * this.nodeCount;
        const totalAvailableIps = subnetInfo.usableIps * this.subnetCount;
        const remainingIps = totalAvailableIps - requiredIps;
        const ipUsagePercent = (requiredIps / totalAvailableIps) * 100;

        // 生成警告
        const warnings = [];
        if (remainingIps < 0) {
          warnings.push(
            `子網路 IP 不足！需要 ${requiredIps} 個 IP，但只有 ${totalAvailableIps} 個可用`
          );
        } else if (ipUsagePercent > 90) {
          warnings.push(
            "IP 使用率超過 90%，建議增加子網路數量或使用更大的子網路"
          );
        } else if (ipUsagePercent > 80) {
          warnings.push("IP 使用率超過 80%，建議預留更多 IP 空間");
        }

        this.result = {
          maxEnis: instance.maxeni,
          ipsPerEni: instance.ipv4addr,
          maxPodsPerNode,
          totalPods,
          totalIps: subnetInfo.totalIps,
          totalAvailableIps: totalAvailableIps,
          singleSubnetIps: subnetInfo.usableIps,
          ipsPerNode,
          requiredIps,
          remainingIps,
          ipUsagePercent,
          warnings,
        };
      } catch (e) {
        this.error = e.message;
      }
    },
    calculateSubnetInfo() {
      if (!this.subnetCidr.includes("/")) {
        throw new Error("請輸入有效的 CIDR 格式 (例如: 10.0.1.0/24)");
      }

      const [ip, cidrStr] = this.subnetCidr.split("/");
      const cidr = parseInt(cidrStr);

      if (cidr < 16 || cidr > 28) {
        throw new Error("CIDR 必須在 /16 到 /28 之間");
      }

      if (!this.isValidIPv4(ip)) {
        throw new Error("無效的 IP 地址");
      }

      const totalIps = Math.pow(2, 32 - cidr);
      // AWS 保留每個子網路的前 4 個和最後 1 個 IP
      const usableIps = totalIps - 5;

      return { totalIps, usableIps };
    },
    isValidIPv4(ip) {
      const parts = ip.split(".");
      if (parts.length !== 4) return false;
      return parts.every((part) => {
        const num = parseInt(part);
        return num >= 0 && num <= 255 && part === num.toString();
      });
    },
    getUsageClass(percent) {
      if (percent >= 90) return "bg-red";
      if (percent >= 80) return "bg-orange";
      if (percent >= 60) return "bg-yellow";
      return "bg-green";
    },
  },
};
</script>

<style scoped>
.progress {
  height: 1.5rem;
}

.form-hint {
  font-size: 0.875rem;
  color: var(--tblr-muted);
  margin-top: 0.25rem;
}

.instance-selector {
  position: relative;
}

.instance-selector .dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 0.125rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.instance-selector .dropdown-item {
  padding: 0.75rem 1rem;
  white-space: normal;
}

.instance-selector .dropdown-item:hover {
  background-color: var(--tblr-bg-surface-secondary);
}

.instance-selector .dropdown-item.active {
  background-color: var(--tblr-primary);
  color: white;
}

.instance-selector .dropdown-item.active .text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}

.instance-selector .dropdown-item.active .badge {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.btn-icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--tblr-border-color);
  background: transparent;
  color: var(--tblr-muted);
  transition: all 0.2s;
  font-size: 1rem;
  line-height: 1;
  vertical-align: middle;
}

.btn-icon i {
  font-size: 1rem;
  line-height: 1;
}

.btn-icon:hover {
  background: var(--tblr-bg-surface-secondary);
  color: var(--tblr-primary);
  border-color: var(--tblr-primary);
}

.alert {
  position: relative;
}

.alert .btn-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}
</style>
