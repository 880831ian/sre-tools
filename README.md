# SRE 工具箱

一個集成了多種 SRE 日常工具的 Web 應用程式，支援 PWA、深色模式和響應式設計。

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發服務器（預設在 http://localhost:3000）
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
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
- **EKS CNI 計算器** - 計算 AWS EKS 集群的 CNI 容量和 IP 需求

### 安全工具

- **SSL 憑證檢查** - 檢查 SSL 憑證資訊（演示版本）

### 開發工具

- **程式碼格式化** - 格式化多種程式語言的代碼
- **測試資料產生器** - 產生各種格式的測試資料

### PDF 工具

- **PDF 解密** - 移除 PDF 檔案的密碼保護，支援開啟密碼和權限密碼
- **PDF 合併** - 合併多個 PDF 檔案，支援選擇頁面、拖曳排序

## ✨ 功能特色

- 🌙 **深色模式** - 自動適應系統主題
- 📱 **PWA 支援** - 可安裝到手機和桌面
- 📐 **響應式設計** - 完美支援各種螢幕尺寸
- ⚡ **離線功能** - Service Worker 快取
- 🔒 **隱私保護** - 所有處理都在前端進行

## 🚀 部署

### 靜態網站託管（推薦）

構建後的 `dist` 目錄可以直接部署到任何靜態網站託管服務：

```bash
# 構建生產版本
npm run build

# dist 目錄可以部署到：
# - Vercel
# - Netlify
# - GitHub Pages
# - Firebase Hosting
# - 任何支援靜態網站的伺服器
```

### Docker 部署（用於 CI/CD）

```bash
# 構建 Docker 映像
docker build -t sre-tools:latest .

# 運行容器
docker run -d -p 8080:80 --name sre-tools sre-tools:latest
```

詳細的 CI/CD 整合範例請參考 `DEPLOYMENT.md`。

### 傳統伺服器部署

```bash
# 構建項目
npm run build

# 將 dist 目錄內容複製到 web 伺服器根目錄
cp -r dist/* /var/www/html/
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
