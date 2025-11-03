<template>
  <div class="data-generator">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">資料類型</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">資料筆數</label>
              <input
                type="number"
                class="form-control"
                v-model="recordCount"
                min="1"
                max="1000"
                placeholder="10"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">輸出格式</label>
              <select class="form-select" v-model="outputFormat">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="sql">SQL INSERT</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">選擇欄位</label>
              <div
                class="form-selectgroup form-selectgroup-boxes d-flex flex-column"
              >
                <label
                  v-for="field in availableFields"
                  :key="field.key"
                  class="form-selectgroup-item"
                >
                  <input
                    type="checkbox"
                    class="form-selectgroup-input"
                    v-model="selectedFields"
                    :value="field.key"
                  />
                  <div
                    class="form-selectgroup-label d-flex align-items-center p-2"
                  >
                    <div class="me-3">
                      <span class="form-selectgroup-check"></span>
                    </div>
                    <div class="flex-fill">
                      <div class="font-weight-medium">{{ field.name }}</div>
                      <div class="text-muted small">
                        {{ field.description }}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button class="btn btn-primary w-100" @click="generateData">
              <i class="ti ti-refresh me-2"></i>
              產生資料
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h3 class="card-title">產生的資料</h3>
            <div class="card-actions">
              <button
                v-if="generatedData"
                class="btn btn-outline-primary btn-sm me-2"
                @click="copyToClipboard"
              >
                <i class="ti ti-copy me-1"></i>
                複製
              </button>
              <button
                v-if="generatedData"
                class="btn btn-outline-success btn-sm"
                @click="downloadData"
              >
                <i class="ti ti-download me-1"></i>
                下載
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="!generatedData" class="text-center py-5 text-muted">
              <h4>選擇欄位並點擊產生資料</h4>
              <p>左側選擇你需要的資料欄位，然後點擊產生按鈕</p>
            </div>

            <div v-else>
              <div class="mb-3">
                <small class="text-muted">
                  產生了 {{ recordCount }} 筆
                  {{ outputFormat.toUpperCase() }} 格式的資料
                </small>
              </div>
              <pre
                class="bg-dark text-light p-3 rounded"
                style="max-height: 500px; overflow-y: auto"
              ><code>{{ generatedData }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataGenerator",
  data() {
    return {
      recordCount: 10,
      outputFormat: "json",
      selectedFields: ["name", "email", "phone"],
      generatedData: null,
      availableFields: [
        { key: "id", name: "ID", description: "唯一識別碼" },
        { key: "name", name: "姓名", description: "隨機中文姓名" },
        { key: "email", name: "電子郵件", description: "隨機電子郵件地址" },
        { key: "phone", name: "電話號碼", description: "台灣手機號碼格式" },
        { key: "address", name: "地址", description: "台灣地址" },
        { key: "company", name: "公司名稱", description: "隨機公司名稱" },
        { key: "job", name: "職業", description: "隨機職業" },
        { key: "age", name: "年齡", description: "18-65歲之間" },
        { key: "birthday", name: "生日", description: "YYYY-MM-DD 格式" },
        { key: "gender", name: "性別", description: "男性或女性" },
        { key: "salary", name: "薪資", description: "月薪範圍" },
        { key: "website", name: "網站", description: "隨機網站 URL" },
        { key: "ip", name: "IP 地址", description: "IPv4 地址" },
        { key: "mac", name: "MAC 地址", description: "MAC 地址格式" },
        { key: "uuid", name: "UUID", description: "UUID v4 格式" },
        { key: "creditCard", name: "信用卡號", description: "假的信用卡號碼" },
      ],
    };
  },
  methods: {
    generateData() {
      if (this.selectedFields.length === 0) {
        alert("請至少選擇一個欄位");
        return;
      }

      const data = [];

      for (let i = 0; i < this.recordCount; i++) {
        const record = {};

        this.selectedFields.forEach((field) => {
          record[field] = this.generateFieldData(field, i + 1);
        });

        data.push(record);
      }

      this.formatOutput(data);
    },
    generateFieldData(field, index) {
      switch (field) {
        case "id":
          return index;
        case "name":
          return this.generateChineseName();
        case "email":
          return this.generateEmail();
        case "phone":
          return this.generatePhone();
        case "address":
          return this.generateAddress();
        case "company":
          return this.generateCompany();
        case "job":
          return this.generateJob();
        case "age":
          return Math.floor(Math.random() * 48) + 18;
        case "birthday":
          return this.generateBirthday();
        case "gender":
          return Math.random() > 0.5 ? "男" : "女";
        case "salary":
          return Math.floor(Math.random() * 80000) + 30000;
        case "website":
          return this.generateWebsite();
        case "ip":
          return this.generateIP();
        case "mac":
          return this.generateMAC();
        case "uuid":
          return this.generateUUID();
        case "creditCard":
          return this.generateCreditCard();
        default:
          return "";
      }
    },
    generateChineseName() {
      const surnames = [
        "王",
        "李",
        "張",
        "劉",
        "陳",
        "楊",
        "趙",
        "黃",
        "周",
        "吳",
        "徐",
        "孫",
        "胡",
        "朱",
        "高",
        "林",
        "何",
        "郭",
        "馬",
        "羅",
      ];
      const names = [
        "偉",
        "芳",
        "娜",
        "秀英",
        "敏",
        "靜",
        "麗",
        "強",
        "磊",
        "軍",
        "洋",
        "勇",
        "艷",
        "傑",
        "娟",
        "濤",
        "明",
        "超",
        "秀蘭",
        "霞",
      ];

      const surname = surnames[Math.floor(Math.random() * surnames.length)];
      const name = names[Math.floor(Math.random() * names.length)];

      return surname + name;
    },
    generateEmail() {
      const domains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "example.com",
      ];
      const username = Math.random().toString(36).substring(2, 10);
      const domain = domains[Math.floor(Math.random() * domains.length)];

      return `${username}@${domain}`;
    },
    generatePhone() {
      const prefixes = ["09"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const number = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0");

      return `${prefix}${number}`;
    },
    generateAddress() {
      const cities = [
        "台北市",
        "新北市",
        "桃園市",
        "台中市",
        "台南市",
        "高雄市",
      ];
      const districts = [
        "中正區",
        "大安區",
        "信義區",
        "松山區",
        "中山區",
        "萬華區",
      ];
      const roads = [
        "中山路",
        "中正路",
        "民生路",
        "忠孝路",
        "仁愛路",
        "信義路",
      ];

      const city = cities[Math.floor(Math.random() * cities.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];
      const road = roads[Math.floor(Math.random() * roads.length)];
      const number = Math.floor(Math.random() * 999) + 1;

      return `${city}${district}${road}${number}號`;
    },
    generateCompany() {
      const companies = [
        "科技股份有限公司",
        "資訊有限公司",
        "電子股份有限公司",
        "軟體科技公司",
        "數位科技公司",
        "創新科技公司",
      ];
      const prefixes = [
        "台灣",
        "亞洲",
        "全球",
        "智慧",
        "未來",
        "創新",
        "數位",
        "雲端",
      ];

      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];

      return prefix + company;
    },
    generateJob() {
      const jobs = [
        "軟體工程師",
        "系統管理員",
        "網路工程師",
        "資料分析師",
        "產品經理",
        "設計師",
        "行銷專員",
        "業務代表",
        "會計師",
        "人資專員",
      ];
      return jobs[Math.floor(Math.random() * jobs.length)];
    },
    generateBirthday() {
      const year = Math.floor(Math.random() * 50) + 1960;
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;

      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    },
    generateWebsite() {
      const domains = [
        "example.com",
        "test.org",
        "demo.net",
        "sample.io",
        "mock.co",
      ];
      const subdomain = Math.random().toString(36).substring(2, 8);
      const domain = domains[Math.floor(Math.random() * domains.length)];

      return `https://${subdomain}.${domain}`;
    },
    generateIP() {
      return `${Math.floor(Math.random() * 256)}.${Math.floor(
        Math.random() * 256
      )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    },
    generateMAC() {
      const hex = "0123456789ABCDEF";
      let mac = "";

      for (let i = 0; i < 6; i++) {
        if (i > 0) mac += ":";
        mac +=
          hex[Math.floor(Math.random() * 16)] +
          hex[Math.floor(Math.random() * 16)];
      }

      return mac;
    },
    generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    generateCreditCard() {
      // 產生假的信用卡號碼（僅供測試）
      const prefix = "4"; // Visa
      let number = prefix;

      for (let i = 0; i < 15; i++) {
        number += Math.floor(Math.random() * 10);
      }

      return number.replace(/(.{4})/g, "$1 ").trim();
    },
    formatOutput(data) {
      switch (this.outputFormat) {
        case "json":
          this.generatedData = JSON.stringify(data, null, 2);
          break;
        case "csv":
          this.generatedData = this.formatCSV(data);
          break;
        case "sql":
          this.generatedData = this.formatSQL(data);
          break;
        case "xml":
          this.generatedData = this.formatXML(data);
          break;
      }
    },
    formatCSV(data) {
      if (data.length === 0) return "";

      const headers = Object.keys(data[0]);
      const csvHeaders = headers.join(",");

      const csvRows = data.map((row) => {
        return headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",");
      });

      return [csvHeaders, ...csvRows].join("\n");
    },
    formatSQL(data) {
      if (data.length === 0) return "";

      const tableName = "generated_data";
      const headers = Object.keys(data[0]);

      let sql = `-- Generated test data\n`;
      sql += `CREATE TABLE ${tableName} (\n`;
      sql += headers.map((header) => `  ${header} VARCHAR(255)`).join(",\n");
      sql += "\n);\n\n";

      data.forEach((row) => {
        const values = headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string"
              ? `'${value.replace(/'/g, "''")}'`
              : value;
          })
          .join(", ");

        sql += `INSERT INTO ${tableName} (${headers.join(
          ", "
        )}) VALUES (${values});\n`;
      });

      return sql;
    },
    formatXML(data) {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';

      data.forEach((row, index) => {
        xml += `  <record id="${index + 1}">\n`;

        Object.keys(row).forEach((key) => {
          xml += `    <${key}>${this.escapeXML(row[key])}</${key}>\n`;
        });

        xml += "  </record>\n";
      });

      xml += "</data>";
      return xml;
    },
    escapeXML(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedData).then(() => {
        alert("已複製到剪貼簿");
      });
    },
    downloadData() {
      const blob = new Blob([this.generatedData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `generated_data.${this.outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
