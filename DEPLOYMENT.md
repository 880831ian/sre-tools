# SRE 工具箱 - 部署說明

## 功能特色

✅ **深色模式** - 自動適應系統主題，可手動切換
✅ **PWA 支援** - 可安裝到手機和桌面
✅ **響應式設計** - 完美支援手機、平板和桌面
✅ **離線功能** - Service Worker 快取，離線也能使用
✅ **豐富工具集** - 包含文字處理、系統管理、網路、安全、開發等多類工具

## 開發環境

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 部署到生產環境

### 1. 靜態網站託管 (推薦)

構建後的 `dist` 目錄可以直接部署到任何靜態網站託管服務：

- **Vercel**: 連接 GitHub 倉庫，自動部署
- **Netlify**: 拖拽 `dist` 目錄或連接 Git
- **GitHub Pages**: 使用 GitHub Actions 自動部署
- **Firebase Hosting**: `firebase deploy`

### 2. 伺服器部署

```bash
# 構建項目
npm run build

# 將 dist 目錄內容複製到 web 伺服器根目錄
cp -r dist/* /var/www/html/
```

### 3. Docker 部署

#### 使用 Docker Compose（推薦）

```bash
# 構建並啟動服務
docker compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

#### 使用 Docker 命令

```bash
# 構建映像
docker build -t sre-tools .

# 運行容器
docker run -d \
  --name sre-tools \
  -p 3000:8080 \
  --restart unless-stopped \
  sre-tools

# 查看日誌
docker logs -f sre-tools
```

#### Docker 特性

- **多階段構建** - 優化映像大小
- **非 root 用戶** - 提高安全性
- **健康檢查** - 自動監控服務狀態
- **Nginx 優化** - Gzip 壓縮、快取設置
- **PWA 支援** - 正確的 MIME 類型和快取策略

## PWA 功能

### 安裝提示

- 應用會自動檢測是否支援 PWA 安裝
- 在支援的瀏覽器中會顯示安裝提示
- 用戶可以將應用安裝到主畫面

### 離線功能

- 使用 Service Worker 快取資源
- 離線狀態下仍可使用已快取的工具
- 自動更新快取內容

### 手機優化

- 響應式設計，適配各種螢幕尺寸
- 觸控友好的介面
- 符合 PWA 標準的圖標和配置

## 瀏覽器支援

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 技術棧

- **Vue 3** - 前端框架
- **Vue Router** - 路由管理
- **Vite** - 構建工具
- **Bootstrap 5** - UI 框架
- **Tabler Core & Icons** - UI 組件和圖標
- **Vite PWA Plugin** - PWA 功能

## 工具列表

### 文字處理工具

- **文字差異比較** - 比較兩個文字檔案的差異
- **正規表示法測試** - 測試正規表達式
- **Fluent 格式化** - 測試和格式化 Fluentd 正規表達式

### 系統管理工具

- **Cron 表達式解析** - 測試和驗證 cron 表達式
- **PHP-FPM 計算器** - 計算 PHP-FPM 最佳配置
- **Nginx 配置格式化** - 格式化和美化 Nginx 配置檔

### 網路工具

- **IP 子網路計算器** - 計算 IP 子網路和 CIDR

### 安全工具

- **SSL 憑證檢查** - 檢查 SSL 憑證資訊和有效性

### 開發工具

- **程式碼格式化** - 格式化和美化程式碼
- **測試資料產生器** - 產生測試用的假資料

## 自定義配置

### 添加新工具

1. 在 `src/components/tools/` 目錄下創建新組件
2. 在 `src/data/tools.js` 中添加工具配置
3. 在 `src/views/ToolView.vue` 中註冊組件
4. 更新工具分類和描述

### 自定義主題

修改 `src/style.css` 中的 CSS 變數：

```css
[data-bs-theme="dark"] {
  --bs-primary: #your-color;
  --bs-body-bg: #your-bg-color;
}
```

## 效能優化

- 使用 Vite 的代碼分割
- 圖片和資源壓縮
- Service Worker 快取策略
- 懶加載組件

## 安全性

- 所有工具都在前端運行，不會傳送資料到伺服器
- 使用 HTTPS 部署以啟用 PWA 功能
- Content Security Policy 配置

## 監控和分析

建議添加：

- Google Analytics 或其他分析工具
- 錯誤監控 (如 Sentry)
- 效能監控

## Docker 使用指南

### 快速開始

```bash
# 1. 克隆項目
git clone <your-repo-url>
cd sre-tools-website

# 2. 使用 Docker Compose 啟動
docker compose up -d

# 3. 訪問應用
open http://localhost:3000
```

### 生產環境部署

```bash
# 1. 設置環境變數
export DOMAIN=your-domain.com

# 2. 修改 docker-compose.yml 中的域名
# 3. 啟動服務
docker compose up -d

# 4. 設置反向代理（如 Traefik 或 Nginx）
```

### 映像管理

```bash
# 查看映像大小
docker images sre-tools

# 清理未使用的映像
docker image prune

# 推送到 Registry
docker tag sre-tools your-registry/sre-tools:latest
docker push your-registry/sre-tools:latest
```

## 維護

- 定期更新依賴套件
- 監控 PWA 功能是否正常
- 檢查新瀏覽器的兼容性
- 定期更新 Docker 基礎映像
- 監控容器資源使用情況
