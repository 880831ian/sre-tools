<template>
  <div class="pdf-merge">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-files me-2"></i>
              PDF 合併工具
            </h3>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="ti ti-alert-circle me-2"></i>
              上傳多個 PDF
              檔案，選擇需要的頁面，拖曳調整順序後合併。所有處理都在您的瀏覽器本地完成。
            </div>

            <div
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                multiple
                @change="handleFileSelect"
                style="display: none"
              />
              <div class="text-center py-4">
                <i class="ti ti-file-upload upload-icon"></i>
                <h5 class="mt-2 upload-title">點擊或拖曳 PDF 檔案到此處</h5>
                <p class="text-muted mb-0">支援多個 PDF 檔案</p>
              </div>
            </div>

            <div v-if="pdfFiles.length > 0" class="mt-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5 class="mb-0">已上傳的檔案 ({{ pdfFiles.length }})</h5>
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="expandAllPages"
                  >
                    <i class="ti ti-chevrons-down me-1"></i>
                    展開全部頁面
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="clearAll"
                  >
                    <i class="ti ti-trash me-1"></i>
                    清除全部
                  </button>
                </div>
              </div>

              <div class="pdf-files-list">
                <draggable
                  v-model="pdfFiles"
                  item-key="id"
                  handle=".drag-handle"
                  @end="onDragEnd"
                >
                  <template #item="{ element, index }">
                    <div class="pdf-file-item">
                      <div class="file-header">
                        <div class="file-header-row">
                          <i
                            class="ti ti-grip-vertical drag-handle me-2"
                            style="cursor: move; font-size: 1.5rem"
                          ></i>
                          <i
                            class="ti ti-file-text me-2"
                            style="font-size: 1.5rem; color: #dc3545"
                          ></i>
                          <div class="flex-grow-1 min-width-0">
                            <div class="file-name">{{ element.name }}</div>
                            <div class="file-info">
                              {{ formatFileSize(element.size) }} ·
                              {{
                                element.isEncrypted
                                  ? "0 頁"
                                  : `${element.pageCount} 頁`
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="file-header-actions">
                          <button
                            v-if="!element.isEncrypted"
                            class="btn btn-sm btn-outline-primary"
                            @click="togglePageSelection(index)"
                          >
                            <i class="ti ti-list me-1"></i>
                            <span class="btn-text">選擇頁面</span>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="removeFile(index)"
                          >
                            <i class="ti ti-trash me-1"></i>
                            <span class="btn-text">移除</span>
                          </button>
                        </div>
                      </div>

                      <!-- 加密 PDF 警告 -->
                      <div
                        v-if="element.isEncrypted"
                        class="alert alert-warning mt-3 mb-0"
                      >
                        <i class="ti ti-lock me-2"></i>
                        此 PDF 檔案已加密，需要先解鎖才可以合併。
                        <router-link
                          to="/tools/pdf-unlock"
                          class="alert-link ms-1"
                        >
                          前往 PDF 解鎖工具
                        </router-link>
                      </div>

                      <div
                        v-if="element.showPageSelection"
                        class="page-selection mt-3"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-3"
                        >
                          <strong class="page-selection-title"
                            >選擇要合併的頁面：</strong
                          >
                          <div>
                            <button
                              class="btn btn-sm btn-outline-primary me-2"
                              @click="selectAllPages(index)"
                            >
                              全選
                            </button>
                            <button
                              class="btn btn-sm btn-outline-secondary"
                              @click="deselectAllPages(index)"
                            >
                              全不選
                            </button>
                          </div>
                        </div>
                        <draggable
                          v-model="element.pageOrder"
                          item-key="pageNum"
                          class="page-thumbnails"
                          :animation="200"
                          @end="onPageDragEnd(index)"
                        >
                          <template #item="{ element: pageItem }">
                            <div
                              class="page-thumbnail"
                              :class="{
                                selected: element.selectedPages.includes(
                                  pageItem.pageNum
                                ),
                              }"
                              @click="togglePage(index, pageItem.pageNum)"
                            >
                              <div class="page-drag-handle">
                                <i class="ti ti-grip-vertical"></i>
                              </div>
                              <img
                                v-if="
                                  pageThumbnails[
                                    `${element.id}-${pageItem.pageNum}`
                                  ]
                                "
                                :src="
                                  pageThumbnails[
                                    `${element.id}-${pageItem.pageNum}`
                                  ]
                                "
                                :alt="`第 ${pageItem.pageNum} 頁`"
                                class="thumbnail-img"
                              />
                              <div v-else class="thumbnail-loading">
                                <div
                                  class="spinner-border spinner-border-sm"
                                ></div>
                              </div>
                              <div class="page-number">
                                <span
                                  class="badge bg-dark"
                                  style="color: white"
                                  >{{ pageItem.pageNum }}</span
                                >
                              </div>
                              <div
                                v-if="
                                  element.selectedPages.includes(
                                    pageItem.pageNum
                                  )
                                "
                                class="selected-overlay"
                              >
                                <i class="ti ti-check-circle"></i>
                              </div>
                            </div>
                          </template>
                        </draggable>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>

              <div class="mt-4">
                <button
                  class="btn btn-success btn-lg"
                  @click="mergePdfs"
                  :disabled="processing || !hasSelectedPages"
                >
                  <span
                    v-if="processing"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i v-else class="ti ti-files me-1"></i>
                  {{ processing ? "合併中..." : "合併 PDF" }}
                </button>
                <small v-if="!hasSelectedPages" class="text-danger ms-3">
                  請至少選擇一個頁面
                </small>
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-3">
              <i class="ti ti-alert-triangle me-2"></i>
              {{ error }}
            </div>

            <div v-if="success" class="alert alert-success mt-3">
              <i class="ti ti-check me-2"></i>
              <strong>PDF 合併成功！</strong>
              <br />
              <small class="text-muted"
                >共 {{ mergedPageCount }} 頁 ·
                {{ formatFileSize(mergedPdfBytes.length) }}</small
              >
              <br />
              <button
                class="btn btn-success btn-sm mt-2"
                @click="downloadMergedPdf"
              >
                <i class="ti ti-download me-1"></i>
                下載合併後的 PDF
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
import draggable from "vuedraggable";
import * as pdfjsLib from "pdfjs-dist";

// 設置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;

export default {
  name: "PdfMerge",
  components: {
    draggable,
  },
  data() {
    return {
      pdfFiles: [],
      processing: false,
      error: null,
      success: false,
      mergedPdfBytes: null,
      mergedPageCount: 0,
      nextId: 1,
      pageThumbnails: {}, // 存儲頁面縮圖
    };
  },
  computed: {
    hasSelectedPages() {
      return this.pdfFiles.some(
        (file) => !file.isEncrypted && file.selectedPages.length > 0
      );
    },
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileSelect(event) {
      const files = Array.from(event.target.files);
      await this.addFiles(files);
      event.target.value = "";
    },
    async handleDrop(event) {
      const files = Array.from(event.dataTransfer.files).filter(
        (f) => f.type === "application/pdf"
      );
      await this.addFiles(files);
    },
    async addFiles(files) {
      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          let pdfDoc;
          let isEncrypted = false;
          let pageCount = 0;

          try {
            pdfDoc = await PDFDocument.load(arrayBuffer);
            pageCount = pdfDoc.getPageCount();
          } catch (err) {
            // 檢查是否為加密錯誤
            if (
              err.message.includes("encrypted") ||
              err.message.includes("password")
            ) {
              isEncrypted = true;
            } else {
              throw err;
            }
          }

          const fileId = this.nextId++;

          this.pdfFiles.push({
            id: fileId,
            name: file.name,
            size: file.size,
            file: file,
            arrayBuffer: arrayBuffer,
            pageCount: pageCount,
            selectedPages: isEncrypted
              ? []
              : Array.from({ length: pageCount }, (_, i) => i + 1),
            pageOrder: Array.from({ length: pageCount }, (_, i) => ({
              pageNum: i + 1,
            })),
            showPageSelection: false,
            isEncrypted: isEncrypted,
          });

          // 只有非加密檔案才生成縮圖
          if (!isEncrypted && pageCount > 0) {
            await this.generateThumbnails(fileId, arrayBuffer, pageCount);
          }
        } catch (err) {
          this.error = `無法讀取 ${file.name}：${err.message}`;
        }
      }
    },
    async generateThumbnails(fileId, arrayBuffer, pageCount) {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDocument = await loadingTask.promise;

        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.5 }); // 小縮圖

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          const thumbnailKey = `${fileId}-${pageNum}`;
          this.pageThumbnails[thumbnailKey] = canvas.toDataURL(
            "image/jpeg",
            0.7
          );
        }
      } catch (err) {
        console.error("生成縮圖失敗:", err);
      }
    },
    removeFile(index) {
      this.pdfFiles.splice(index, 1);
      this.error = null;
      this.success = false;
    },
    clearAll() {
      this.pdfFiles = [];
      this.error = null;
      this.success = false;
      this.mergedPdfBytes = null;
    },
    expandAllPages() {
      this.pdfFiles.forEach((file) => {
        if (!file.isEncrypted) {
          file.showPageSelection = true;
        }
      });
    },
    togglePageSelection(index) {
      this.pdfFiles[index].showPageSelection =
        !this.pdfFiles[index].showPageSelection;
    },
    togglePage(fileIndex, page) {
      const file = this.pdfFiles[fileIndex];
      const pageIndex = file.selectedPages.indexOf(page);
      if (pageIndex > -1) {
        file.selectedPages.splice(pageIndex, 1);
      } else {
        file.selectedPages.push(page);
        file.selectedPages.sort((a, b) => a - b);
      }
    },
    selectAllPages(index) {
      const file = this.pdfFiles[index];
      file.selectedPages = Array.from(
        { length: file.pageCount },
        (_, i) => i + 1
      );
    },
    deselectAllPages(index) {
      this.pdfFiles[index].selectedPages = [];
    },
    onDragEnd() {
      // 拖曳結束後的處理（如果需要）
    },
    onPageDragEnd(fileIndex) {
      // 頁面拖曳結束後，更新選中的頁面順序
      const file = this.pdfFiles[fileIndex];
      // 保持選中狀態，但順序已經由 draggable 更新
    },
    async mergePdfs() {
      if (!this.hasSelectedPages) return;

      this.processing = true;
      this.error = null;
      this.success = false;
      this.mergedPageCount = 0;

      try {
        const mergedPdf = await PDFDocument.create();

        for (const file of this.pdfFiles) {
          if (file.selectedPages.length === 0) continue;

          // 重新讀取文件以避免 detached ArrayBuffer 問題
          const freshArrayBuffer = await file.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(freshArrayBuffer);

          // 使用 pageOrder 的順序，但只合併選中的頁面
          for (const pageItem of file.pageOrder) {
            if (file.selectedPages.includes(pageItem.pageNum)) {
              const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [
                pageItem.pageNum - 1,
              ]);
              mergedPdf.addPage(copiedPage);
              this.mergedPageCount++;
            }
          }
        }

        this.mergedPdfBytes = await mergedPdf.save();
        this.success = true;
      } catch (err) {
        this.error = `合併失敗：${err.message}`;
      } finally {
        this.processing = false;
      }
    },
    downloadMergedPdf() {
      if (!this.mergedPdfBytes) return;

      const blob = new Blob([this.mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
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

.pdf-files-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pdf-file-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.pdf-file-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-header-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
}

.min-width-0 {
  min-width: 0;
}

.file-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.file-info {
  font-size: 0.875rem;
  color: #6c757d;
  white-space: nowrap;
}

.file-header-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.file-header-actions .btn {
  flex: 1;
}

/* 桌面版佈局 */
@media (min-width: 768px) {
  .file-header {
    flex-direction: row;
    align-items: center;
  }

  .file-header-row {
    flex: 1;
  }

  .file-header-actions {
    width: auto;
    flex-shrink: 0;
  }

  .file-header-actions .btn {
    flex: 0 0 auto;
  }
}

.drag-handle {
  color: #6c757d;
}

.drag-handle:hover {
  color: #0054a6;
}

.page-selection {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.page-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.page-thumbnail {
  position: relative;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  cursor: move;
  transition: all 0.3s;
  background-color: #fff;
  aspect-ratio: 1 / 1.414; /* A4 比例 */
}

.page-drag-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 1rem;
  z-index: 10;
  cursor: move;
  opacity: 0;
  transition: opacity 0.2s;
}

.page-thumbnail:hover .page-drag-handle {
  opacity: 1;
}

.page-thumbnail:hover {
  border-color: #0054a6;
  box-shadow: 0 4px 12px rgba(0, 84, 166, 0.2);
  transform: translateY(-2px);
}

.page-thumbnail.selected {
  border-color: #0054a6;
  border-width: 3px;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #fff;
}

.thumbnail-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.page-number {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 84, 166, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #0054a6;
}

/* 深色模式適配 */
[data-bs-theme="dark"] .pdf-file-item {
  background-color: #1e1e1e;
  border-color: #444;
}

[data-bs-theme="dark"] .pdf-file-item:hover {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

[data-bs-theme="dark"] .page-selection {
  background-color: #2a2a2a;
}

[data-bs-theme="dark"] .page-thumbnail {
  border-color: #444;
  background-color: #1e1e1e;
}

[data-bs-theme="dark"] .page-thumbnail:hover {
  border-color: #4a9eff;
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

[data-bs-theme="dark"] .page-thumbnail.selected {
  border-color: #4a9eff;
}

[data-bs-theme="dark"] .thumbnail-loading {
  background-color: #2a2a2a;
}

[data-bs-theme="dark"] .selected-overlay {
  background-color: rgba(74, 158, 255, 0.3);
  color: #4a9eff;
}

[data-bs-theme="dark"] .file-name,
[data-bs-theme="dark"] .page-selection-title {
  color: #e0e0e0;
}

[data-bs-theme="dark"] .file-info {
  color: #999;
}

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

[data-bs-theme="dark"] .page-drag-handle {
  background-color: rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
}
</style>
