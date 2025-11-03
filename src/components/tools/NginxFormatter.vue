<template>
  <div class="nginx-formatter">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Nginx 配置</label>
          <textarea
            class="form-control font-monospace"
            rows="20"
            v-model="nginxConfig"
            placeholder="貼上你的 Nginx 配置..."
          ></textarea>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="formatConfig">
            <i class="ti ti-code me-1"></i>
            格式化
          </button>
          <button class="btn btn-outline-secondary" @click="minifyConfig">
            <i class="ti ti-minimize me-1"></i>
            壓縮
          </button>
          <button class="btn btn-outline-danger" @click="clearConfig">
            <i class="ti ti-trash me-1"></i>
            清除
          </button>
        </div>
      </div>

      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">格式化結果</label>
          <textarea
            class="form-control font-monospace"
            rows="20"
            v-model="formattedConfig"
            readonly
          ></textarea>
        </div>

        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-primary"
            @click="copyToClipboard"
            :disabled="!formattedConfig"
          >
            <i class="ti ti-copy me-1"></i>
            複製
          </button>
          <button
            class="btn btn-outline-success"
            @click="downloadConfig"
            :disabled="!formattedConfig"
          >
            <i class="ti ti-download me-1"></i>
            下載
          </button>
        </div>
      </div>
    </div>

    <div v-if="errors.length > 0" class="row mt-4">
      <div class="col-12">
        <div
          class="alert"
          :class="isConfigValid ? 'alert-success' : 'alert-warning'"
        >
          <h4>
            <i
              :class="
                isConfigValid ? 'ti ti-check-circle' : 'ti ti-alert-triangle'
              "
              class="me-2"
            ></i>
            配置檢查
          </h4>
          <ul class="mb-0">
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Nginx 配置範例</h3>
          </div>
          <div class="card-body">
            <div class="btn-group mb-3" role="group">
              <button
                class="btn btn-outline-primary"
                @click="loadExample('basic')"
              >
                基本配置
              </button>
              <button
                class="btn btn-outline-primary"
                @click="loadExample('ssl')"
              >
                SSL 配置
              </button>
              <button
                class="btn btn-outline-primary"
                @click="loadExample('proxy')"
              >
                反向代理
              </button>
              <button
                class="btn btn-outline-primary"
                @click="loadExample('load-balancer')"
              >
                負載均衡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NginxFormatter",
  data() {
    return {
      nginxConfig: "",
      formattedConfig: "",
      errors: [],
      isConfigValid: false,
      examples: {
        basic: `server {
listen 80;
server_name example.com www.example.com;
root /var/www/html;
index index.html index.htm index.php;
location / {
try_files $uri $uri/ =404;
}
location ~ \\.php$ {
include snippets/fastcgi-php.conf;
fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
}
}`,
        ssl: `server {
listen 443 ssl http2;
server_name example.com;
ssl_certificate /path/to/certificate.crt;
ssl_certificate_key /path/to/private.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;
location / {
root /var/www/html;
index index.html;
}
}`,
        proxy: `upstream backend {
server 127.0.0.1:3000;
server 127.0.0.1:3001;
}
server {
listen 80;
server_name api.example.com;
location / {
proxy_pass http://backend;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
}
}`,
        "load-balancer": `upstream app_servers {
least_conn;
server app1.example.com:8080 weight=3;
server app2.example.com:8080 weight=2;
server app3.example.com:8080 backup;
}
server {
listen 80;
server_name lb.example.com;
location / {
proxy_pass http://app_servers;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_connect_timeout 30s;
proxy_send_timeout 30s;
proxy_read_timeout 30s;
}
}`,
      },
    };
  },
  methods: {
    formatConfig() {
      if (!this.nginxConfig.trim()) {
        this.formattedConfig = "";
        return;
      }

      this.errors = [];

      try {
        const formatted = this.beautifyNginxConfig(this.nginxConfig);
        this.formattedConfig = formatted;
        this.validateConfig(formatted);
      } catch (e) {
        this.errors.push(`格式化錯誤: ${e.message}`);
        this.formattedConfig = this.nginxConfig;
      }
    },
    minifyConfig() {
      if (!this.nginxConfig.trim()) {
        this.formattedConfig = "";
        return;
      }

      // 簡單的壓縮：移除多餘空白和註解
      const minified = this.nginxConfig
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .join(" ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s+/g, " ");

      this.formattedConfig = minified;
    },
    beautifyNginxConfig(config) {
      const lines = config.split("\n");
      const formatted = [];
      let indentLevel = 0;
      const indentSize = 4;

      for (let line of lines) {
        line = line.trim();

        if (!line || line.startsWith("#")) {
          formatted.push(line);
          continue;
        }

        // 減少縮排（遇到 } 時）
        if (line.includes("}")) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // 添加縮排
        const indent = " ".repeat(indentLevel * indentSize);
        formatted.push(indent + line);

        // 增加縮排（遇到 { 時）
        if (line.includes("{")) {
          indentLevel++;
        }
      }

      return formatted.join("\n");
    },
    validateConfig(config) {
      const lines = config.split("\n");
      let braceCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line || line.startsWith("#")) continue;

        // 檢查大括號平衡
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceCount += openBraces - closeBraces;

        // 檢查常見錯誤
        if (
          line.includes("server_name") &&
          !line.includes(";") &&
          !line.includes("{")
        ) {
          this.errors.push(`第 ${i + 1} 行: server_name 指令缺少分號`);
        }

        if (
          line.includes("listen") &&
          !line.includes(";") &&
          !line.includes("{")
        ) {
          this.errors.push(`第 ${i + 1} 行: listen 指令缺少分號`);
        }

        if (
          line.includes("root") &&
          !line.includes(";") &&
          !line.includes("{")
        ) {
          this.errors.push(`第 ${i + 1} 行: root 指令缺少分號`);
        }
      }

      if (braceCount !== 0) {
        this.errors.push("大括號不平衡");
      }

      if (this.errors.length === 0) {
        this.errors.push("配置語法檢查通過");
        this.isConfigValid = true;
      } else {
        this.isConfigValid = false;
      }
    },
    clearConfig() {
      this.nginxConfig = "";
      this.formattedConfig = "";
      this.errors = [];
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.formattedConfig).then(() => {
        alert("已複製到剪貼簿");
      });
    },
    downloadConfig() {
      const blob = new Blob([this.formattedConfig], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "nginx.conf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    loadExample(type) {
      if (this.examples[type]) {
        this.nginxConfig = this.examples[type];
        this.formatConfig();
      }
    },
  },
};
</script>
