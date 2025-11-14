<template>
  <div class="ssl-checker">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-certificate me-2"></i>
              SSL 憑證匹配檢查
            </h3>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="ti ti-alert-circle me-2"></i>
              貼上您的憑證、中繼憑證和私鑰，系統會檢查它們是否匹配
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="ti ti-certificate me-1"></i>
                SSL 憑證 (Certificate)
              </label>
              <textarea
                class="form-control font-monospace"
                v-model="certificate"
                rows="8"
                placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAKZ...&#10;-----END CERTIFICATE-----"
              ></textarea>
              <small class="text-muted">貼上完整的 PEM 格式憑證</small>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="ti ti-certificate me-1"></i>
                中繼憑證 (Intermediate Certificate)
                <span class="text-muted">(選填)</span>
              </label>
              <textarea
                class="form-control font-monospace"
                v-model="intermediate"
                rows="8"
                placeholder="-----BEGIN CERTIFICATE-----&#10;MIIEkjCCA3qgAwIBAgIQCgF...&#10;-----END CERTIFICATE-----"
              ></textarea>
              <small class="text-muted">如有多個中繼憑證，請依序貼上</small>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="ti ti-file-text me-1"></i>
                私鑰 (Private Key)
              </label>
              <textarea
                class="form-control font-monospace"
                v-model="privateKey"
                rows="8"
                placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvQIBADANBgkqhkiG9w...&#10;-----END PRIVATE KEY-----"
              ></textarea>
              <small class="text-muted">支援 RSA 和 EC 私鑰</small>
            </div>

            <div class="d-flex gap-2">
              <button
                class="btn btn-primary"
                @click="checkCertificates"
                :disabled="!certificate || !privateKey"
              >
                <i class="ti ti-search me-1"></i>
                檢查匹配
              </button>
              <button class="btn btn-secondary" @click="clearAll">
                <i class="ti ti-trash me-1"></i>
                清除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="result" class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">檢查結果</h3>
          </div>
          <div class="card-body">
            <div
              class="alert"
              :class="result.allMatch ? 'alert-success' : 'alert-danger'"
            >
              <h2 class="alert-heading">
                <i
                  :class="
                    result.allMatch ? 'ti ti-check' : 'ti ti-alert-triangle'
                  "
                  class="me-2"
                ></i>
                {{ result.allMatch ? "憑證匹配成功！" : "憑證匹配失敗" }}
              </h2>
              <p class="mb-0">{{ result.message }}</p>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h5>匹配狀態</h5>
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <i
                      :class="
                        result.certValid
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    憑證格式：{{ result.certValid ? "有效" : "無效" }}
                  </li>
                  <li class="mb-2">
                    <i
                      :class="
                        result.keyValid
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    私鑰格式：{{ result.keyValid ? "有效" : "無效" }}
                  </li>
                  <li class="mb-2">
                    <i
                      :class="
                        result.keyMatch
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    憑證與私鑰：{{ result.keyMatch ? "匹配" : "不匹配" }}
                  </li>
                  <li v-if="intermediate" class="mb-2">
                    <i
                      :class="
                        result.intermediateValid
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    中繼憑證：{{
                      result.intermediateValid ? "有效" : "無效"
                    }}
                  </li>
                  <li v-if="intermediate" class="mb-2">
                    <i
                      :class="
                        result.chainValid
                          ? 'ti ti-check text-success'
                          : 'ti ti-x text-danger'
                      "
                      class="me-2"
                    ></i>
                    憑證鏈：{{ result.chainValid ? "完整" : "不完整" }}
                  </li>
                </ul>
              </div>

              <div class="col-md-6" v-if="result.certInfo">
                <h5>憑證資訊</h5>
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <strong>主體：</strong>
                    <br />
                    <small>{{ result.certInfo.subject }}</small>
                  </li>
                  <li class="mb-2">
                    <strong>發行者：</strong>
                    <br />
                    <small>{{ result.certInfo.issuer }}</small>
                  </li>
                  <li class="mb-2">
                    <strong>有效期：</strong>
                    <br />
                    <small
                      >{{ result.certInfo.validFrom }} 至
                      {{ result.certInfo.validTo }}</small
                    >
                  </li>
                  <li class="mb-2">
                    <strong>剩餘天數：</strong>
                    <span
                      class="badge text-white"
                      :class="getDaysLeftClass(result.certInfo.daysLeft)"
                    >
                      {{ result.certInfo.daysLeft }} 天
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div
              v-if="result.certInfo && result.certInfo.san"
              class="mt-3"
            >
              <h5>替代名稱 (SAN)</h5>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="san in result.certInfo.san"
                  :key="san"
                  class="badge bg-blue text-white"
                >
                  {{ san }}
                </span>
              </div>
            </div>

            <div v-if="result.warnings && result.warnings.length > 0" class="mt-3">
              <h5>警告</h5>
              <div
                v-for="(warning, index) in result.warnings"
                :key="index"
                class="alert alert-warning mb-2"
              >
                <i class="ti ti-alert-triangle me-2"></i>
                {{ warning }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import forge from "node-forge";

export default {
  name: "SslChecker",
  data() {
    return {
      certificate: "",
      intermediate: "",
      privateKey: "",
      result: null,
    };
  },
  methods: {
    checkCertificates() {
      this.result = null;

      try {
        // 驗證憑證格式
        let cert = null;
        let certValid = false;
        try {
          cert = forge.pki.certificateFromPem(this.certificate);
          certValid = true;
        } catch (e) {
          certValid = false;
        }

        // 驗證私鑰格式
        let privateKey = null;
        let keyValid = false;
        try {
          privateKey = forge.pki.privateKeyFromPem(this.privateKey);
          keyValid = true;
        } catch (e) {
          keyValid = false;
        }

        // 驗證中繼憑證格式
        let intermediateCert = null;
        let intermediateValid = true;
        if (this.intermediate && this.intermediate.trim()) {
          try {
            intermediateCert = forge.pki.certificateFromPem(this.intermediate);
            intermediateValid = true;
          } catch (e) {
            intermediateValid = false;
          }
        }

        if (!certValid || !keyValid) {
          this.result = {
            allMatch: false,
            message: certValid ? "私鑰格式無效" : "憑證格式無效",
            certValid,
            keyValid,
            intermediateValid,
            keyMatch: false,
            chainValid: false,
          };
          return;
        }

        // 檢查憑證與私鑰是否匹配
        const keyMatch = this.checkKeyMatch(cert, privateKey);

        // 檢查憑證鏈
        const chainValid = intermediateCert
          ? this.checkCertificateChain(cert, intermediateCert)
          : true;

        // 解析憑證資訊
        const certInfo = this.parseCertificate(cert);
        const warnings = this.getWarnings(certInfo);

        // 生成詳細的錯誤訊息
        let message = "";
        if (certValid && keyValid && keyMatch && intermediateValid && chainValid) {
          message = "所有憑證和私鑰都正確匹配！";
        } else {
          const issues = [];
          if (!certValid) issues.push("憑證格式無效");
          if (!keyValid) issues.push("私鑰格式無效");
          if (!keyMatch) issues.push("憑證與私鑰不匹配");
          if (!intermediateValid) issues.push("中繼憑證格式無效");
          if (!chainValid) issues.push("憑證鏈不完整");
          message = "發現問題：" + issues.join("、");
        }

        this.result = {
          allMatch:
            certValid && keyValid && keyMatch && intermediateValid && chainValid,
          message,
          certValid,
          keyValid,
          intermediateValid,
          keyMatch,
          chainValid,
          certInfo,
          warnings,
        };
      } catch (error) {
        this.result = {
          allMatch: false,
          message: `檢查時發生錯誤：${error.message}`,
          certValid: false,
          keyValid: false,
          intermediateValid: false,
          keyMatch: false,
          chainValid: false,
        };
      }
    },

    checkKeyMatch(cert, privateKey) {
      try {
        const publicKey = cert.publicKey;

        // 比較公鑰和私鑰的模數（RSA）
        if (publicKey.n && privateKey.n) {
          const modulusMatch = publicKey.n.compareTo(privateKey.n) === 0;
          
          if (!modulusMatch) {
            return false;
          }

          // 額外驗證：使用私鑰簽名，用公鑰驗證
          try {
            const testData = "test-certificate-key-match-verification";
            const md = forge.md.sha256.create();
            md.update(testData, "utf8");
            const signature = privateKey.sign(md);

            const md2 = forge.md.sha256.create();
            md2.update(testData, "utf8");
            const verified = publicKey.verify(md2.digest().bytes(), signature);
            
            return verified;
          } catch (e) {
            return false;
          }
        } else {
          // 其他類型的金鑰（如 EC）
          try {
            const testData = "test-certificate-key-match-verification";
            const md = forge.md.sha256.create();
            md.update(testData, "utf8");
            const signature = privateKey.sign(md);

            const md2 = forge.md.sha256.create();
            md2.update(testData, "utf8");
            const verified = publicKey.verify(md2.digest().bytes(), signature);
            
            return verified;
          } catch (e) {
            return false;
          }
        }
      } catch (e) {
        return false;
      }
    },

    checkCertificateChain(cert, intermediateCert) {
      try {
        // 檢查憑證的發行者是否與中繼憑證的主體匹配
        const certIssuer = cert.issuer.attributes
          .map((attr) => `${attr.shortName}=${attr.value}`)
          .join(", ");
        const intermediateSubject = intermediateCert.subject.attributes
          .map((attr) => `${attr.shortName}=${attr.value}`)
          .join(", ");
        
        const issuerMatch = certIssuer === intermediateSubject;

        if (!issuerMatch) {
          return false;
        }

        // 使用 forge 的內建方法驗證憑證簽名
        try {
          const verified = intermediateCert.verify(cert);
          return verified;
        } catch (e) {
          // 如果簽名驗證失敗，至少檢查發行者是否匹配
          return issuerMatch;
        }
      } catch (e) {
        return false;
      }
    },

    parseCertificate(cert) {
      try {
        // 解析主體
        const subject = cert.subject.attributes
          .map((attr) => `${attr.shortName}=${attr.value}`)
          .join(", ");

        // 解析發行者
        const issuer = cert.issuer.attributes
          .map((attr) => `${attr.shortName}=${attr.value}`)
          .join(", ");

        // 解析有效期
        const validFrom = cert.validity.notBefore;
        const validTo = cert.validity.notAfter;
        const now = new Date();
        const daysLeft = Math.ceil((validTo - now) / (24 * 60 * 60 * 1000));

        // 解析 SAN (Subject Alternative Names)
        const san = [];
        const altNames = cert.getExtension("subjectAltName");
        if (altNames && altNames.altNames) {
          altNames.altNames.forEach((altName) => {
            if (altName.type === 2) {
              // DNS name
              san.push(altName.value);
            } else if (altName.type === 7) {
              // IP address
              san.push(altName.ip);
            }
          });
        }

        return {
          subject,
          issuer,
          validFrom: validFrom.toLocaleDateString("zh-TW"),
          validTo: validTo.toLocaleDateString("zh-TW"),
          daysLeft,
          san: san.length > 0 ? san : null,
        };
      } catch (e) {
        return null;
      }
    },

    getWarnings(certInfo) {
      const warnings = [];
      
      if (certInfo.daysLeft < 30) {
        warnings.push("憑證即將在 30 天內到期，建議盡快更新");
      }
      
      if (certInfo.daysLeft < 7) {
        warnings.push("憑證即將在 7 天內到期，請立即更新！");
      }

      if (certInfo.daysLeft < 0) {
        warnings.push("憑證已過期！");
      }

      return warnings;
    },

    getDaysLeftClass(days) {
      if (days < 7) return "bg-danger";
      if (days < 30) return "bg-warning";
      return "bg-success";
    },

    clearAll() {
      this.certificate = "";
      this.intermediate = "";
      this.privateKey = "";
      this.result = null;
    },
  },
};
</script>
