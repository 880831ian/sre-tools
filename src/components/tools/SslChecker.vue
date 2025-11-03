<template>
  <div class="ssl-checker">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">SSL 憑證檢查</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">網域名稱或 IP</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="hostname"
                  placeholder="example.com"
                />
                <input
                  type="number"
                  class="form-control"
                  v-model="port"
                  placeholder="443"
                  style="max-width: 100px"
                />
                <button
                  class="btn btn-primary"
                  @click="checkSSL"
                  :disabled="loading"
                >
                  <i class="ti ti-search me-1"></i>
                  檢查
                </button>
              </div>
            </div>

            <div class="mb-3">
              <h5>快速測試</h5>
              <div class="btn-group-vertical w-100 gap-1">
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="setHostname('google.com')"
                >
                  <i class="ti ti-check me-1"></i>Google (正常)
                </button>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="setHostname('github.com')"
                >
                  <i class="ti ti-check me-1"></i>GitHub (即將到期)
                </button>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="setHostname('stackoverflow.com')"
                >
                  <i class="ti ti-check me-1"></i>Stack Overflow (長期有效)
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="setHostname('expired.badssl.com')"
                >
                  <i class="ti ti-x me-1"></i>已過期憑證
                </button>
                <button
                  class="btn btn-outline-warning btn-sm"
                  @click="setHostname('self-signed.badssl.com')"
                >
                  <i class="ti ti-alert-triangle me-1"></i>自簽憑證
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="setHostname('invalid-domain-test')"
                >
                  <i class="ti ti-x me-1"></i>無效域名
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-certificate me-2"></i>
              憑證資訊
            </h3>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">檢查中...</span>
              </div>
              <div class="mt-2">正在檢查 SSL 憑證...</div>
            </div>

            <div v-else-if="error" class="alert alert-danger">
              <i class="ti ti-alert-circle me-2"></i>
              {{ error }}
            </div>

            <div v-else-if="sslInfo">
              <div
                class="alert"
                :class="sslInfo.valid ? 'alert-success' : 'alert-warning'"
              >
                <i
                  :class="
                    sslInfo.valid ? 'ti ti-check' : 'ti ti-alert-triangle'
                  "
                  class="me-2"
                ></i>
                {{ sslInfo.valid ? "SSL 憑證有效" : "SSL 憑證有問題" }}
              </div>

              <div class="table-responsive">
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>主體</strong></td>
                      <td>{{ sslInfo.subject }}</td>
                    </tr>
                    <tr>
                      <td><strong>發行者</strong></td>
                      <td>{{ sslInfo.issuer }}</td>
                    </tr>
                    <tr>
                      <td><strong>有效期開始</strong></td>
                      <td>{{ sslInfo.validFrom }}</td>
                    </tr>
                    <tr>
                      <td><strong>有效期結束</strong></td>
                      <td>{{ sslInfo.validTo }}</td>
                    </tr>
                    <tr>
                      <td><strong>剩餘天數</strong></td>
                      <td>
                        <span
                          class="badge"
                          :class="getDaysLeftClass(sslInfo.daysLeft)"
                        >
                          {{ sslInfo.daysLeft }} 天
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>序號</strong></td>
                      <td>
                        <code>{{ sslInfo.serialNumber }}</code>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>指紋 (SHA1)</strong></td>
                      <td>
                        <code>{{ sslInfo.fingerprint }}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                v-if="
                  sslInfo.subjectAltNames && sslInfo.subjectAltNames.length > 0
                "
                class="mt-3"
              >
                <h5>替代名稱 (SAN)</h5>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="san in sslInfo.subjectAltNames"
                    :key="san"
                    class="badge bg-blue"
                  >
                    {{ san }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-muted">
              <i class="ti ti-certificate fs-1 mb-3 d-block"></i>
              <h4>SSL 憑證檢查工具</h4>
              <p>輸入網域名稱來檢查 SSL 憑證資訊</p>
              <div class="alert alert-info text-start mt-3">
                <h6>注意事項：</h6>
                <ul class="mb-0">
                  <li>
                    <strong>前端限制：</strong
                    >由於瀏覽器安全政策，無法直接從前端發起 SSL 憑證檢查
                  </li>
                  <li>此為演示版本，使用模擬數據展示功能</li>
                  <li>僅支援預設的測試域名</li>
                  <li>實際使用需要後端 API 或伺服器端工具支援</li>
                  <li>可測試正常、過期、自簽等不同情況</li>
                  <li>建議使用 openssl 命令或專門的 SSL 檢查工具</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="sslInfo" class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">安全性檢查</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>憑證狀態</h5>
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <i
                      :class="
                        sslInfo.valid
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    憑證有效性
                  </li>
                  <li class="mb-2">
                    <i
                      :class="
                        sslInfo.daysLeft > 30
                          ? 'ti ti-check text-success'
                          : 'ti ti-alert-triangle text-warning'
                      "
                      class="me-2"
                    ></i>
                    到期時間 ({{ sslInfo.daysLeft > 30 ? "充足" : "即將到期" }})
                  </li>
                  <li class="mb-2">
                    <i
                      :class="
                        sslInfo.selfSigned
                          ? 'ti ti-alert-triangle text-warning'
                          : 'ti ti-check text-success'
                      "
                      class="me-2"
                    ></i>
                    {{ sslInfo.selfSigned ? "自簽憑證" : "受信任的 CA 簽發" }}
                  </li>
                </ul>
              </div>

              <div class="col-md-6">
                <h5>建議</h5>
                <ul class="list-unstyled">
                  <li v-if="sslInfo.daysLeft < 30" class="mb-2 text-warning">
                    <i class="ti ti-alert-triangle me-2"></i>
                    建議盡快更新憑證
                  </li>
                  <li v-if="sslInfo.selfSigned" class="mb-2 text-warning">
                    <i class="ti ti-alert-triangle me-2"></i>
                    考慮使用受信任的 CA 憑證
                  </li>
                  <li
                    v-if="sslInfo.valid && sslInfo.daysLeft > 30"
                    class="mb-2 text-success"
                  >
                    <i class="ti ti-check me-2"></i>
                    憑證狀態良好
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SslChecker",
  data() {
    return {
      hostname: "",
      port: 443,
      loading: false,
      sslInfo: null,
      error: null,
    };
  },
  methods: {
    setHostname(host) {
      this.hostname = host;
      this.checkSSL();
    },
    async checkSSL() {
      if (!this.hostname.trim()) {
        this.error = "請輸入網域名稱";
        return;
      }

      this.loading = true;
      this.error = null;
      this.sslInfo = null;

      try {
        // 模擬 SSL 檢查（實際應用中需要後端 API）
        await this.simulateSSLCheck();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async simulateSSLCheck() {
      // 模擬 API 延遲
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 驗證域名格式
      if (!this.isValidDomain(this.hostname)) {
        throw new Error("無效的域名格式");
      }

      // 根據不同網域提供不同的模擬資料
      const mockData = {
        "google.com": {
          subject: "CN=*.google.com",
          issuer: "CN=GTS CA 1C3, O=Google Trust Services LLC, C=US",
          subjectAltNames: ["*.google.com", "google.com"],
          selfSigned: false,
          validFromDays: -45, // 45天前開始有效
          validToDays: 45, // 45天後到期
        },
        "github.com": {
          subject: "CN=github.com",
          issuer:
            "CN=DigiCert TLS Hybrid ECC SHA384 2020 CA1, O=DigiCert Inc, C=US",
          subjectAltNames: ["github.com", "www.github.com"],
          selfSigned: false,
          validFromDays: -60,
          validToDays: 30,
        },
        "stackoverflow.com": {
          subject: "CN=*.stackoverflow.com",
          issuer:
            "CN=DigiCert SHA2 High Assurance Server CA, OU=www.digicert.com, O=DigiCert Inc, C=US",
          subjectAltNames: ["*.stackoverflow.com", "stackoverflow.com"],
          selfSigned: false,
          validFromDays: -90,
          validToDays: 270,
        },
        "expired.badssl.com": {
          subject: "CN=*.badssl.com",
          issuer: "CN=BadSSL Intermediate Certificate Authority",
          subjectAltNames: ["*.badssl.com", "badssl.com"],
          selfSigned: false,
          validFromDays: -400,
          validToDays: -10, // 已過期
        },
        "self-signed.badssl.com": {
          subject: "CN=*.badssl.com",
          issuer: "CN=*.badssl.com", // 自簽憑證
          subjectAltNames: ["*.badssl.com"],
          selfSigned: true,
          validFromDays: -30,
          validToDays: 335,
        },
      };

      // 檢查是否為已知的測試域名
      const data = mockData[this.hostname];
      if (!data) {
        // 對於未知域名，模擬連線失敗
        throw new Error(
          `無法連線到 ${this.hostname}:${this.port} - 連線逾時或域名不存在`
        );
      }

      const now = new Date();
      const validFrom = new Date(
        now.getTime() + data.validFromDays * 24 * 60 * 60 * 1000
      );
      const validTo = new Date(
        now.getTime() + data.validToDays * 24 * 60 * 60 * 1000
      );
      const daysLeft = Math.ceil((validTo - now) / (24 * 60 * 60 * 1000));

      // 檢查憑證是否有效
      const isValid = now >= validFrom && now <= validTo && !data.selfSigned;

      this.sslInfo = {
        valid: isValid,
        subject: data.subject,
        issuer: data.issuer,
        validFrom: validFrom.toLocaleDateString("zh-TW"),
        validTo: validTo.toLocaleDateString("zh-TW"),
        daysLeft: daysLeft,
        serialNumber: this.generateSerialNumber(),
        fingerprint: this.generateFingerprint(),
        subjectAltNames: data.subjectAltNames,
        selfSigned: data.selfSigned,
      };
    },

    isValidDomain(domain) {
      // 簡單的域名格式驗證
      const domainRegex =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return domainRegex.test(domain) && domain.length <= 253;
    },
    generateSerialNumber() {
      return Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      )
        .join("")
        .toUpperCase();
    },
    generateFingerprint() {
      return Array.from({ length: 20 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0")
      )
        .join(":")
        .toUpperCase();
    },
    getDaysLeftClass(days) {
      if (days < 7) return "bg-danger";
      if (days < 30) return "bg-warning";
      return "bg-success";
    },
  },
};
</script>
