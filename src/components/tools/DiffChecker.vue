<template>
  <div class="diff-checker">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">原始文字</label>
          <div class="position-relative">
            <div v-if="showLineNumbers" class="line-numbers">
              <div
                v-for="(line, index) in originalText.split('\n')"
                :key="index"
                class="line-number"
              >
                {{ index + 1 }}
              </div>
            </div>
            <textarea
              class="form-control font-monospace"
              :class="{ 'with-line-numbers': showLineNumbers }"
              rows="15"
              v-model="originalText"
              placeholder="輸入原始文字..."
              @input="calculateDiff"
            ></textarea>
          </div>
          <div class="form-hint">
            行數: {{ originalText.split("\n").length }} | 字符數:
            {{ originalText.length }}
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">比較文字</label>
          <div class="position-relative">
            <div v-if="showLineNumbers" class="line-numbers">
              <div
                v-for="(line, index) in modifiedText.split('\n')"
                :key="index"
                class="line-number"
              >
                {{ index + 1 }}
              </div>
            </div>
            <textarea
              class="form-control font-monospace"
              :class="{ 'with-line-numbers': showLineNumbers }"
              rows="15"
              v-model="modifiedText"
              placeholder="輸入要比較的文字..."
              @input="calculateDiff"
            ></textarea>
          </div>
          <div class="form-hint">
            行數: {{ modifiedText.split("\n").length }} | 字符數:
            {{ modifiedText.length }}
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="showLineNumbers"
                    @change="calculateDiff"
                  />
                  <label class="form-check-label">顯示行號</label>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="ignoreWhitespace"
                    @change="calculateDiff"
                  />
                  <label class="form-check-label">忽略空白字符</label>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="ignoreCase"
                    @change="calculateDiff"
                  />
                  <label class="form-check-label">忽略大小寫</label>
                </div>
              </div>
              <div class="col-auto">
                <button class="btn btn-outline-secondary" @click="swapTexts">
                  <i class="ti ti-arrows-exchange me-1"></i>
                  交換文字
                </button>
              </div>
              <div class="col-auto">
                <button class="btn btn-outline-danger" @click="clearTexts">
                  <i class="ti ti-trash me-1"></i>
                  清除全部
                </button>
              </div>
              <div class="col-auto ms-auto">
                <label class="form-label me-2 mb-0">檢視模式:</label>
                <div class="btn-group btn-group-sm" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    name="viewMode"
                    id="unified"
                    value="unified"
                    v-model="viewMode"
                  />
                  <label class="btn btn-outline-primary" for="unified"
                    >統一</label
                  >

                  <input
                    type="radio"
                    class="btn-check"
                    name="viewMode"
                    id="split"
                    value="split"
                    v-model="viewMode"
                  />
                  <label class="btn btn-outline-primary" for="split"
                    >分割</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 完全相同提示 -->
    <div v-if="isIdentical" class="row">
      <div class="col-12">
        <div class="alert alert-success">
          <i class="ti ti-check-circle me-2"></i>
          <strong>兩個文字完全相同</strong>
          <div class="mt-2">
            <small class="text-muted">
              共 {{ originalText.split("\n").length }} 行，{{
                originalText.length
              }}
              個字符
            </small>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="diffResult" class="row">
      <div class="col-12">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h3 class="card-title">
              <i class="ti ti-file-diff me-2"></i>
              差異結果
            </h3>
            <div class="card-actions">
              <small class="text-muted">
                顯示 {{ displayedLines }} / {{ totalLines }} 行
              </small>
            </div>
          </div>
          <div class="card-body p-0">
            <!-- 統計資訊 -->
            <div class="p-3 border-bottom">
              <div class="row">
                <div class="col-auto">
                  <span class="badge bg-green me-2"
                    >+{{ stats.additions }}</span
                  >
                  <small class="text-muted">新增</small>
                </div>
                <div class="col-auto">
                  <span class="badge bg-red me-2">-{{ stats.deletions }}</span>
                  <small class="text-muted">刪除</small>
                </div>
                <div class="col-auto">
                  <span class="badge bg-blue me-2">{{ stats.changes }}</span>
                  <small class="text-muted">修改</small>
                </div>
              </div>
            </div>

            <!-- 統一檢視 -->
            <div v-if="viewMode === 'unified'" class="diff-unified">
              <pre
                class="mb-0"
              ><code v-for="(line, index) in diffResult.unified" :key="index" :class="getDiffLineClass(line)" v-html="formatDiffLine(line, index)"></code></pre>
            </div>

            <!-- 分割檢視 -->
            <div v-if="viewMode === 'split'" class="diff-split">
              <div class="row g-0">
                <div class="col-6 border-end">
                  <div class="p-2 bg-secondary text-white border-bottom">
                    <strong>原始文字</strong>
                  </div>
                  <pre
                    class="mb-0 p-2"
                  ><code v-for="(line, index) in diffResult.original" :key="index" :class="getOriginalLineClass(line)" v-html="formatOriginalLine(line, index)"></code></pre>
                </div>
                <div class="col-6">
                  <div class="p-2 bg-secondary text-white border-bottom">
                    <strong>修改後文字</strong>
                  </div>
                  <pre
                    class="mb-0 p-2"
                  ><code v-for="(line, index) in diffResult.modified" :key="index" :class="getModifiedLineClass(line)" v-html="formatModifiedLine(line, index)"></code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!originalText && !modifiedText"
      class="text-center py-5 text-muted"
    >
      <h3>文字差異比較工具</h3>
      <p>在上方輸入兩段文字來比較它們的差異</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiffChecker",
  data() {
    return {
      originalText: "",
      modifiedText: "",
      showLineNumbers: true,
      ignoreWhitespace: false,
      ignoreCase: false,
      contextLines: 999,
      viewMode: "unified",
      diffResult: null,
      stats: {
        additions: 0,
        deletions: 0,
        changes: 0,
      },
    };
  },
  computed: {
    isIdentical() {
      if (!this.originalText && !this.modifiedText) return false;

      let original = this.originalText;
      let modified = this.modifiedText;

      if (this.ignoreCase) {
        original = original.toLowerCase();
        modified = modified.toLowerCase();
      }

      if (this.ignoreWhitespace) {
        original = original.replace(/\s+/g, " ").trim();
        modified = modified.replace(/\s+/g, " ").trim();
      }

      return original === modified;
    },
    displayedLines() {
      return this.diffResult ? this.diffResult.unified.length : 0;
    },
    totalLines() {
      const originalLines = this.originalText.split("\n").length;
      const modifiedLines = this.modifiedText.split("\n").length;
      return Math.max(originalLines, modifiedLines);
    },
  },
  methods: {
    calculateDiff() {
      if (!this.originalText && !this.modifiedText) {
        this.diffResult = null;
        return;
      }

      if (this.isIdentical) {
        this.diffResult = null;
        return;
      }

      let original = this.originalText;
      let modified = this.modifiedText;

      // 預處理文字
      if (this.ignoreCase) {
        original = original.toLowerCase();
        modified = modified.toLowerCase();
      }

      if (this.ignoreWhitespace) {
        original = original.replace(/\s+/g, " ").trim();
        modified = modified.replace(/\s+/g, " ").trim();
      }

      const originalLines = original.split("\n");
      const modifiedLines = modified.split("\n");

      // 簡化的 diff 算法
      const diff = this.simpleDiff(originalLines, modifiedLines);

      // 應用上下文過濾
      const filteredDiff = this.applyContext(diff);

      this.diffResult = {
        unified: this.generateUnifiedDiff(filteredDiff),
        original: this.generateOriginalView(filteredDiff),
        modified: this.generateModifiedView(filteredDiff),
      };

      this.calculateStats(diff);
    },

    applyContext(diff) {
      // 移除上下文過濾功能，直接返回完整差異
      return diff;
    },

    simpleDiff(original, modified) {
      const diff = [];
      let i = 0,
        j = 0;

      while (i < original.length || j < modified.length) {
        if (i >= original.length) {
          // 剩餘的都是新增
          diff.push({
            type: "add",
            line: modified[j],
            originalIndex: -1,
            modifiedIndex: j,
          });
          j++;
        } else if (j >= modified.length) {
          // 剩餘的都是刪除
          diff.push({
            type: "delete",
            line: original[i],
            originalIndex: i,
            modifiedIndex: -1,
          });
          i++;
        } else if (original[i] === modified[j]) {
          // 相同行
          diff.push({
            type: "equal",
            line: original[i],
            originalIndex: i,
            modifiedIndex: j,
          });
          i++;
          j++;
        } else {
          // 尋找下一個匹配
          let foundMatch = false;

          // 簡單的向前查找
          for (let k = 1; k <= 3 && j + k < modified.length; k++) {
            if (original[i] === modified[j + k]) {
              // 找到匹配，中間的是新增
              for (let l = 0; l < k; l++) {
                diff.push({
                  type: "add",
                  line: modified[j + l],
                  originalIndex: -1,
                  modifiedIndex: j + l,
                });
              }
              j += k;
              foundMatch = true;
              break;
            }
          }

          if (!foundMatch) {
            for (let k = 1; k <= 3 && i + k < original.length; k++) {
              if (original[i + k] === modified[j]) {
                // 找到匹配，中間的是刪除
                for (let l = 0; l < k; l++) {
                  diff.push({
                    type: "delete",
                    line: original[i + l],
                    originalIndex: i + l,
                    modifiedIndex: -1,
                  });
                }
                i += k;
                foundMatch = true;
                break;
              }
            }
          }

          if (!foundMatch) {
            // 當作修改
            diff.push({
              type: "delete",
              line: original[i],
              originalIndex: i,
              modifiedIndex: -1,
            });
            diff.push({
              type: "add",
              line: modified[j],
              originalIndex: -1,
              modifiedIndex: j,
            });
            i++;
            j++;
          }
        }
      }

      return diff;
    },

    generateUnifiedDiff(diff) {
      return diff.map((item) => ({
        type: item.type,
        content: item.line,
        originalIndex: item.originalIndex,
        modifiedIndex: item.modifiedIndex,
      }));
    },

    generateOriginalView(diff) {
      return diff.map((item) => {
        if (
          item.type === "equal" ||
          item.type === "delete" ||
          item.type === "separator"
        ) {
          return {
            type: item.type,
            content: item.line,
            originalIndex: item.originalIndex,
          };
        } else {
          return { type: "empty", content: "", originalIndex: -1 };
        }
      });
    },

    generateModifiedView(diff) {
      return diff.map((item) => {
        if (
          item.type === "equal" ||
          item.type === "add" ||
          item.type === "separator"
        ) {
          return {
            type: item.type,
            content: item.line,
            modifiedIndex: item.modifiedIndex,
          };
        } else {
          return { type: "empty", content: "", modifiedIndex: -1 };
        }
      });
    },

    calculateStats(diff) {
      this.stats = {
        additions: diff.filter((item) => item.type === "add").length,
        deletions: diff.filter((item) => item.type === "delete").length,
        changes: 0,
      };

      this.stats.changes = this.stats.additions + this.stats.deletions;
    },

    getDiffLineClass(line) {
      return {
        "diff-line": true,
        "diff-add": line.type === "add",
        "diff-delete": line.type === "delete",
        "diff-equal": line.type === "equal",
        "diff-separator": line.type === "separator",
      };
    },

    getOriginalLineClass(line) {
      return {
        "diff-line": true,
        "diff-delete": line.type === "delete",
        "diff-equal": line.type === "equal",
        "diff-empty": line.type === "empty",
        "diff-separator": line.type === "separator",
      };
    },

    getModifiedLineClass(line) {
      return {
        "diff-line": true,
        "diff-add": line.type === "add",
        "diff-equal": line.type === "equal",
        "diff-empty": line.type === "empty",
        "diff-separator": line.type === "separator",
      };
    },

    formatDiffLine(line, index) {
      let prefix = "";
      let lineNumber = "";

      if (this.showLineNumbers) {
        if (line.type === "add") {
          lineNumber = `${String(line.modifiedIndex + 1).padStart(4, " ")} | `;
          prefix = "+ ";
        } else if (line.type === "delete") {
          lineNumber = `${String(line.originalIndex + 1).padStart(4, " ")} | `;
          prefix = "- ";
        } else if (line.type === "equal") {
          lineNumber = `${String(line.originalIndex + 1).padStart(4, " ")} | `;
          prefix = "  ";
        } else if (line.type === "separator") {
          lineNumber = ".... | ";
          prefix = "";
        }
      } else {
        if (line.type === "add") prefix = "+ ";
        if (line.type === "delete") prefix = "- ";
        if (line.type === "equal") prefix = "  ";
      }

      return this.escapeHtml(lineNumber + prefix + line.content) + "\n";
    },

    formatOriginalLine(line, index) {
      let lineNumber = "";

      if (this.showLineNumbers && line.originalIndex >= 0) {
        lineNumber = `${String(line.originalIndex + 1).padStart(4, " ")} | `;
      } else if (this.showLineNumbers && line.type === "separator") {
        lineNumber = ".... | ";
      } else if (this.showLineNumbers) {
        lineNumber = "     | ";
      }

      return this.escapeHtml(lineNumber + line.content) + "\n";
    },

    formatModifiedLine(line, index) {
      let lineNumber = "";

      if (this.showLineNumbers && line.modifiedIndex >= 0) {
        lineNumber = `${String(line.modifiedIndex + 1).padStart(4, " ")} | `;
      } else if (this.showLineNumbers && line.type === "separator") {
        lineNumber = ".... | ";
      } else if (this.showLineNumbers) {
        lineNumber = "     | ";
      }

      return this.escapeHtml(lineNumber + line.content) + "\n";
    },

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },

    swapTexts() {
      const temp = this.originalText;
      this.originalText = this.modifiedText;
      this.modifiedText = temp;
      this.calculateDiff();
    },

    clearTexts() {
      this.originalText = "";
      this.modifiedText = "";
      this.diffResult = null;
    },
  },
};
</script>

<style scoped>
.diff-line {
  display: block;
  margin: 0;
  padding: 2px 8px;
  white-space: pre-wrap;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.4;
}

.diff-add {
  background-color: #d4edda;
  color: #155724;
}

.diff-delete {
  background-color: #f8d7da;
  color: #721c24;
}

.diff-equal {
  background-color: transparent;
  color: #212529;
}

.diff-empty {
  background-color: #f8f9fa;
  color: transparent;
}

.diff-separator {
  background-color: #e9ecef;
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

.diff-unified pre,
.diff-split pre {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
}

.btn.active {
  background-color: var(--bs-primary);
  color: white;
}

.line-numbers {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.4;
  padding: 8px 4px;
  z-index: 1;
  overflow: hidden;
}

.line-number {
  text-align: right;
  color: #6c757d;
  height: 19.6px;
  padding-right: 8px;
}

.with-line-numbers {
  padding-left: 58px !important;
}
</style>
