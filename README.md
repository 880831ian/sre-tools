# SRE 工具箱

一個集成了多種 SRE 日常工具的 Web 應用程式，支援 PWA、深色模式和響應式設計。

## 🚀 快速開始

### 使用 Docker（推薦）

```bash
# 使用 Docker Compose
docker compose up -d

# 或使用 Docker 命令
docker build -t sre-tools .
docker run -d -p 3000:8080 --name sre-tools sre-tools
```

訪問 http://localhost:3000

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build
```

## 🛠️ 工具列表

### 文字處理工具

- **文字差異比較** - 比較兩個文字的差異，支援統一和分割檢視
- **正規表示法測試** - 測試正規表達式匹配
- **Fluent 格式化** - Fluentd 正規表達式測試工具

### 系統管理工具

- **Cron 表達式解析** - 解析和驗證 cron 表達式，顯示下次執行時間
- **PHP-FPM 計算器** - 計算 PHP-FPM 最佳配置參數
- **Nginx 配置格式化** - 格式化和驗證 Nginx 配置文件

### 網路工具

- **IP 子網路計算器** - 計算 IP 子網路和 CIDR 資訊

### 安全工具

- **SSL 憑證檢查** - 檢查 SSL 憑證資訊（演示版本）

### 開發工具

- **程式碼格式化** - 格式化多種程式語言的代碼
- **測試資料產生器** - 產生各種格式的測試資料

## ✨ 功能特色

- 🌙 **深色模式** - 自動適應系統主題
- 📱 **PWA 支援** - 可安裝到手機和桌面
- 📐 **響應式設計** - 完美支援各種螢幕尺寸
- ⚡ **離線功能** - Service Worker 快取
- 🔒 **隱私保護** - 所有處理都在前端進行

## 🐳 Docker 部署

### 生產環境

```bash
# 1. 克隆項目
git clone <your-repo>
cd sre-tools-website

# 2. 構建並啟動
docker compose up -d

# 3. 查看狀態
docker-compose ps
docker-compose logs -f
```

### 自定義配置

修改 `docker-compose.yml` 中的設置：

```yaml
services:
  sre-tools:
    ports:
      - "80:8080" # 修改端口
    environment:
      - NODE_ENV=production
```

## 🔧 技術棧

- **Vue 3** - 前端框架
- **Vue Router** - 路由管理
- **Vite** - 構建工具
- **Bootstrap 5** - UI 框架
- **Tabler** - 圖標和組件
- **PWA** - 漸進式 Web 應用

## 📝 開發說明

### 添加新工具

1. 在 `src/components/tools/` 創建組件
2. 在 `src/data/tools.js` 添加配置
3. 在 `src/views/ToolView.vue` 註冊組件

### 自定義樣式

修改 `src/style.css` 中的 CSS 變數：

```css
[data-bs-theme="dark"] {
  --bs-primary: #your-color;
}
```

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

Made with ❤️ for SRE Engineers
