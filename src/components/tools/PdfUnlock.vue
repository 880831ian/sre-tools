<template>
  <div class="pdf-unlock">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-lock-open me-2"></i>
              PDF 解密工具
            </h3>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="ti ti-alert-circle me-2"></i>
              上傳受密碼保護的 PDF
              檔案，輸入密碼後即可移除保護並下載解密後的檔案。所有處理都在您的瀏覽器本地完成，不會上傳到伺服器。
            </div>

            <div
              v-if="!pdfFile"
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                @change="handleFileSelect"
                style="display: none"
              />
              <div class="text-center py-4">
                <i class="ti ti-file-upload upload-icon"></i>
                <h5 class="mt-2 upload-title">點擊或拖曳 PDF 檔案到此處</h5>
                <p class="text-muted mb-0">支援受密碼保護的 PDF 檔案</p>
              </div>
            </div>

            <div v-if="pdfFile" class="file-info">
              <div
                class="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3"
              >
                <div class="d-flex align-items-center flex-grow-1">
                  <i
                    class="ti ti-file-text me-3"
                    style="font-size: 2.5rem; color: #dc3545"
                  ></i>
                  <div>
                    <strong>{{ pdfFile.name }}</strong>
                    <br />
                    <small class="text-muted">{{
                      formatFileSize(pdfFile.size)
                    }}</small>
                  </div>
                </div>
                <button class="btn btn-danger" @click="removeFile">
                  <i class="ti ti-trash me-1"></i>
                  刪除
                </button>
              </div>

              <div
                v-if="pdfInfo && pdfInfo.includes('沒有開啟密碼')"
                class="alert alert-success"
              >
                <i class="ti ti-check-circle me-2"></i>
                <strong>{{ pdfInfo }}</strong>
              </div>

              <div
                v-if="pdfInfo && pdfInfo.includes('受密碼保護')"
                class="alert alert-warning"
              >
                <i class="ti ti-lock me-2"></i>
                <strong>{{ pdfInfo }}</strong>
              </div>

              <div
                v-if="pdfInfo && pdfInfo.includes('受密碼保護')"
                class="mt-3"
              >
                <label class="form-label">
                  <i class="ti ti-key me-1"></i>
                  PDF 密碼
                </label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="password"
                    placeholder="輸入 PDF 密碼"
                    @keyup.enter="unlockPdf"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"
                    ></i>
                  </button>
                </div>
                <small class="text-muted">輸入開啟 PDF 所需的密碼</small>
              </div>

              <div
                v-if="pdfInfo && pdfInfo.includes('受密碼保護')"
                class="mt-3 d-flex gap-2"
              >
                <button
                  class="btn btn-primary"
                  @click="unlockPdf"
                  :disabled="!password || processing"
                >
                  <span
                    v-if="processing"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i v-else class="ti ti-lock-open me-1"></i>
                  {{ processing ? "處理中..." : "解密 PDF" }}
                </button>
                <button class="btn btn-secondary" @click="reset">
                  <i class="ti ti-refresh me-1"></i>
                  重新開始
                </button>
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-3">
              <i class="ti ti-alert-triangle me-2"></i>
              <span style="white-space: pre-line">{{ error }}</span>
            </div>

            <div v-if="success" class="alert alert-success mt-3">
              <i class="ti ti-check me-2"></i>
              <strong>PDF 解密成功！</strong>
              <br />
              <button class="btn btn-success mt-2" @click="downloadUnlockedPdf">
                <i class="ti ti-download me-1"></i>
                下載解密後的 PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PDFDocument } from "pdf-lib";
import { PDFDocument as CantooPDFDocument } from "@cantoo/pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// 設置 PDF.js worker - 使用 unpkg CDN 確保版本匹配
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;

export default {
  name: "PdfUnlock",
  data() {
    return {
      pdfFile: null,
      password: "",
      showPassword: false,
      processing: false,
      error: null,
      success: false,
      unlockedPdfBytes: null,
      pdfInfo: null,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.pdfFile = file;
        this.error = null;
        this.success = false;
        this.pdfInfo = null;
        await this.checkPdfEncryption();
      }
    },
    async handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        this.pdfFile = file;
        this.error = null;
        this.success = false;
        this.pdfInfo = null;
        await this.checkPdfEncryption();
      }
    },
    async checkPdfEncryption() {
      if (!this.pdfFile) return;

      this.processing = true;
      try {
        const arrayBuffer = await this.pdfFile.arrayBuffer();

        // 使用 PDF.js 檢查是否需要密碼
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
        });

        try {
          const pdfDocument = await loadingTask.promise;
          // 如果成功載入，表示 PDF 沒有開啟密碼保護
          this.pdfInfo = "此 PDF 檔案沒有開啟密碼保護，不需要解密。";
          this.success = false;
        } catch (err) {
          // 檢查是否因為需要密碼
          if (
            err.name === "PasswordException" ||
            err.message.includes("password")
          ) {
            this.pdfInfo = "此 PDF 檔案受密碼保護，請輸入密碼以解密。";
          } else {
            // 其他錯誤
            this.pdfInfo = null;
            this.error = `無法讀取 PDF 檔案：${err.message}`;
          }
        }
      } catch (err) {
        this.error = `讀取檔案失敗：${err.message}`;
      } finally {
        this.processing = false;
      }
    },
    removeFile() {
      this.pdfFile = null;
      this.password = "";
      this.error = null;
      this.success = false;
      this.unlockedPdfBytes = null;
      this.pdfInfo = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async unlockPdf() {
      if (!this.pdfFile || !this.password) return;

      this.processing = true;
      this.error = null;
      this.success = false;
      this.unlockedPdfBytes = null;

      try {
        const arrayBuffer = await this.pdfFile.arrayBuffer();
        console.log("開始解密 PDF...");

        // 使用 PDF.js 載入加密的 PDF
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          password: this.password,
        });

        try {
          const pdfDocument = await loadingTask.promise;
          console.log(`PDF 載入成功，共 ${pdfDocument.numPages} 頁`);

          // 重新讀取文件
          const freshArrayBuffer = await this.pdfFile.arrayBuffer();

          // 使用 Cantoo PDF-lib 載入加密的 PDF
          const cantooPdf = await CantooPDFDocument.load(freshArrayBuffer, {
            password: this.password,
          });

          console.log(
            `Cantoo PDF-lib 載入成功，共 ${cantooPdf.getPageCount()} 頁`
          );

          // 保存為新的 PDF（不帶密碼）
          this.unlockedPdfBytes = await cantooPdf.save();

          // 驗證是否真的沒有密碼
          const testDoc = await PDFDocument.load(this.unlockedPdfBytes);
          console.log("驗證成功：PDF 已解密，共", testDoc.getPageCount(), "頁");

          this.success = true;
          console.log("PDF 解密成功！保持原始質量和文字可選取");
        } catch (err) {
          console.error("解密錯誤:", err);

          // 檢查是否是密碼錯誤
          if (
            err.name === "PasswordException" ||
            err.message.includes("password") ||
            err.message.includes("PasswordException")
          ) {
            this.error = "密碼錯誤，請檢查密碼是否正確";
          } else {
            this.error = `解密失敗：${err.message}`;
          }
        }
      } catch (err) {
        console.error("讀取檔案失敗:", err);
        this.error = `讀取檔案失敗：${err.message}`;
      } finally {
        this.processing = false;
      }
    },
    downloadUnlockedPdf() {
      if (!this.unlockedPdfBytes) return;

      const blob = new Blob([this.unlockedPdfBytes], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.pdfFile.name.replace(".pdf", "_unlocked.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    },
    reset() {
      this.pdfFile = null;
      this.password = "";
      this.showPassword = false;
      this.error = null;
      this.success = false;
      this.unlockedPdfBytes = null;
      this.pdfInfo = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
  },
};
</script>

<style scoped>
.upload-area {
  border: 2px dashed #0054a6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  background-color: #f8f9fa;
  border-color: #003d7a;
}

.upload-icon {
  font-size: 3rem;
  color: #0054a6;
}

.upload-title {
  color: #212529;
}

.file-info {
  margin-top: 1rem;
}

/* 深色模式適配 */
[data-bs-theme="dark"] .upload-area {
  border-color: #4a9eff;
}

[data-bs-theme="dark"] .upload-area:hover {
  background-color: #2a2a2a;
  border-color: #6bb0ff;
}

[data-bs-theme="dark"] .upload-icon {
  color: #4a9eff;
}

[data-bs-theme="dark"] .upload-title {
  color: #e0e0e0;
}
</style>
