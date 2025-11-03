# 多階段構建 Dockerfile for SRE 工具箱

# 第一階段：構建階段
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝依賴（包含 devDependencies 用於構建）
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 第二階段：生產階段
FROM nginx:alpine

# 安裝 dumb-init 用於正確處理信號
RUN apk add --no-cache dumb-init

# 複製構建產物到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 創建非 root 用戶
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 設置正確的權限
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# 創建 nginx 運行所需的目錄
RUN touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# 切換到非 root 用戶
USER nextjs

# 暴露端口
EXPOSE 80

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# 使用 dumb-init 作為 PID 1
ENTRYPOINT ["dumb-init", "--"]

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]