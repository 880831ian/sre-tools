<template>
  <div class="fluent-formatter">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label class="form-label">Fluentd 正規表達式</label>
          <textarea
            class="form-control font-monospace"
            rows="8"
            v-model="fluentRegex"
            placeholder="輸入 Fluentd 正規表達式，例如：
^(?&lt;time&gt;[^ ]*) (?&lt;level&gt;[^ ]*) (?&lt;message&gt;.*)$"
            @input="testRegex"
          ></textarea>
          <div class="form-hint">
            使用 Fluentd 命名群組語法：(?&lt;name&gt;pattern)
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">測試日誌</label>
          <textarea
            class="form-control font-monospace"
            rows="8"
            v-model="testLog"
            placeholder="輸入要測試的日誌內容..."
            @input="testRegex"
          ></textarea>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-test-pipe me-2"></i>
              測試結果
            </h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">
              <i class="ti ti-alert-circle me-2"></i>
              {{ error }}
            </div>

            <div v-else-if="matches.length > 0">
              <div class="alert alert-success">
                <i class="ti ti-check me-2"></i>
                成功匹配 {{ matches.length }} 行日誌
              </div>

              <div v-for="(match, index) in matches" :key="index" class="mb-3">
                <h5>第 {{ index + 1 }} 行匹配結果</h5>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>欄位名稱</th>
                        <th>匹配值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(value, key) in match.groups" :key="key">
                        <td>
                          <code>{{ key }}</code>
                        </td>
                        <td>
                          <span class="badge bg-secondary text-white">{{
                            value
                          }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div v-else-if="fluentRegex && testLog">
              <div class="alert alert-warning">
                <i class="ti ti-alert-triangle me-2"></i>
                沒有匹配到任何日誌行
              </div>
            </div>

            <div v-else class="text-center py-4 text-muted">
              <h4>Fluentd 正規表達式測試</h4>
              <p>輸入 Fluentd 格式的正規表達式和測試日誌</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">常用 Fluentd 正規表達式範例</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>Apache 存取日誌</h5>
                <pre
                  class="p-2 rounded mb-3"
                ><code>^(?&lt;host&gt;[^ ]*) [^ ]* (?&lt;user&gt;[^ ]*) \[(?&lt;time&gt;[^\]]*)\] "(?&lt;method&gt;\S+)(?: +(?&lt;path&gt;[^\"]*?)(?: +\S*)?)?" (?&lt;code&gt;[^ ]*) (?&lt;size&gt;[^ ]*)(?: "(?&lt;referer&gt;[^\"]*)" "(?&lt;agent&gt;[^\"]*)")?$</code></pre>

                <h5>Nginx 存取日誌</h5>
                <pre
                  class="p-2 rounded mb-3"
                ><code>^(?&lt;remote&gt;[^ ]*) (?&lt;host&gt;[^ ]*) (?&lt;user&gt;[^ ]*) \[(?&lt;time&gt;[^\]]*)\] "(?&lt;method&gt;\S+)(?: +(?&lt;path&gt;[^ ]*) +\S*)?" (?&lt;code&gt;[^ ]*) (?&lt;size&gt;[^ ]*)(?: "(?&lt;referer&gt;[^\"]*)" "(?&lt;agent&gt;[^\"]*)")?$</code></pre>
              </div>

              <div class="col-md-6">
                <h5>系統日誌 (Syslog)</h5>
                <pre
                  class="p-2 rounded mb-3"
                ><code>^(?&lt;time&gt;[^ ]* {1,2}[^ ]* [^ ]*) (?&lt;host&gt;[^ ]*) (?&lt;ident&gt;[a-zA-Z0-9_\/\.\-]*)(?:\[(?&lt;pid&gt;[0-9]+)\])?(?:[^\:]*\:)? *(?&lt;message&gt;.*)$</code></pre>

                <h5>JSON 日誌</h5>
                <pre
                  class="p-2 rounded mb-3"
                ><code>^(?&lt;message&gt;.*)$</code></pre>
                <small class="text-muted"
                  >JSON 日誌通常使用 JSON parser 而不是正規表達式</small
                >
              </div>
            </div>

            <div class="mt-4">
              <h5>快速測試</h5>
              <div class="btn-group" role="group">
                <button
                  class="btn btn-outline-primary"
                  @click="loadExample('apache')"
                >
                  Apache 範例
                </button>
                <button
                  class="btn btn-outline-primary"
                  @click="loadExample('nginx')"
                >
                  Nginx 範例
                </button>
                <button
                  class="btn btn-outline-primary"
                  @click="loadExample('syslog')"
                >
                  Syslog 範例
                </button>
                <button
                  class="btn btn-outline-primary"
                  @click="loadExample('custom')"
                >
                  自定義範例
                </button>
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
  name: "FluentFormatter",
  data() {
    return {
      fluentRegex: "",
      testLog: "",
      matches: [],
      error: null,
      examples: {
        apache: {
          regex:
            '^(?<host>[^ ]*) [^ ]* (?<user>[^ ]*) \\[(?<time>[^\\]]*)\\] "(?<method>\\S+)(?: +(?<path>[^"]*?)(?: +\\S*)?)?" (?<code>[^ ]*) (?<size>[^ ]*)(?: "(?<referer>[^"]*)" "(?<agent>[^"]*)")?$',
          log: '127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"\n192.168.1.1 - - [25/Dec/2021:10:00:00 +0800] "POST /api/login HTTP/1.1" 200 1234',
        },
        nginx: {
          regex:
            '^(?<remote>[^ ]*) (?<host>[^ ]*) (?<user>[^ ]*) \\[(?<time>[^\\]]*)\\] "(?<method>\\S+)(?: +(?<path>[^ ]*) +\\S*)?" (?<code>[^ ]*) (?<size>[^ ]*)(?: "(?<referer>[^"]*)" "(?<agent>[^"]*)")?$',
          log: '192.168.1.100 - - [25/Dec/2021:10:00:00 +0800] "GET /index.html HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"\n10.0.0.1 - admin [25/Dec/2021:10:01:00 +0800] "POST /admin/login HTTP/1.1" 302 0',
        },
        syslog: {
          regex:
            "^(?<time>[^ ]* {1,2}[^ ]* [^ ]*) (?<host>[^ ]*) (?<ident>[a-zA-Z0-9_\\/\\.\\-]*)(?:\\[(?<pid>[0-9]+)\\])?(?:[^\\:]*\\:)? *(?<message>.*)$",
          log: 'Dec 25 10:00:00 localhost sshd[1234]: Accepted password for user from 192.168.1.100 port 22 ssh2\nDec 25 10:01:00 server nginx: 192.168.1.1 - - [25/Dec/2021:10:01:00 +0800] "GET / HTTP/1.1" 200',
        },
        custom: {
          regex:
            "^(?<timestamp>[^ ]*) (?<level>[^ ]*) (?<logger>[^ ]*) - (?<message>.*)$",
          log: "2021-12-25T10:00:00.000Z INFO com.example.MyClass - Application started successfully\n2021-12-25T10:01:00.000Z ERROR com.example.Database - Connection failed: timeout",
        },
      },
    };
  },
  methods: {
    testRegex() {
      this.error = null;
      this.matches = [];

      if (!this.fluentRegex || !this.testLog) {
        return;
      }

      try {
        // 轉換 Fluentd 命名群組語法為 JavaScript 語法
        const jsRegex = this.convertFluentdToJS(this.fluentRegex);
        const regex = new RegExp(jsRegex, "gm");

        const lines = this.testLog.split("\n").filter((line) => line.trim());

        lines.forEach((line, lineIndex) => {
          const match = regex.exec(line);
          if (match) {
            const groups = {};

            // 提取命名群組
            if (match.groups) {
              Object.keys(match.groups).forEach((key) => {
                if (match.groups[key] !== undefined) {
                  groups[key] = match.groups[key];
                }
              });
            }

            this.matches.push({
              line: lineIndex + 1,
              content: line,
              groups: groups,
            });
          }

          // 重置 regex lastIndex 以避免全域匹配問題
          regex.lastIndex = 0;
        });
      } catch (e) {
        this.error = `正規表達式錯誤: ${e.message}`;
      }
    },
    convertFluentdToJS(fluentdRegex) {
      // 將 Fluentd 的 (?<name>pattern) 轉換為 JavaScript 的 (?<name>pattern)
      // JavaScript 原生支援命名群組，所以主要是處理轉義字符
      return fluentdRegex
        .replace(/\\</g, "<") // 處理轉義的 <
        .replace(/\\>/g, ">"); // 處理轉義的 >
    },
    loadExample(type) {
      if (this.examples[type]) {
        this.fluentRegex = this.examples[type].regex;
        this.testLog = this.examples[type].log;
        this.testRegex();
      }
    },
  },
};
</script>

<style scoped>
.fluent-formatter pre {
  font-size: 12px;
  line-height: 1.4;
}

.fluent-formatter .table-sm td {
  padding: 0.25rem 0.5rem;
}
</style>
