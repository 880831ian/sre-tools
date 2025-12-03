export const tools = {
  textTools: [
    {
      id: 'diff-checker',
      name: '文字差異比較',
      description: '線上文字差異比較工具，快速比對兩段文字內容的差異。支援逐行比較、高亮顯示變更內容，適合程式碼審查、文件比對、版本差異檢查。靈感來源：<a href="https://www.diffchecker.com/text-compare/" target="_blank">Diffchecker</a>',
      component: 'DiffChecker',
      tags: ['diff', 'compare', 'text', '文字比較', '差異檢查', 'code review'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: '文字差異比較工具 - 線上 Diff Checker',
        description: '免費的線上文字差異比較工具，快速比對兩段文字的差異。支援程式碼比對、文件審查、版本差異檢查，高亮顯示變更內容。',
        keywords: 'diff checker, 文字比較, 差異檢查, 程式碼比對, text compare, 版本比較'
      }
    },
    {
      id: 'regex-tester',
      name: '正規表示法測試',
      description: '線上正規表示式測試工具，即時測試和驗證 Regex 表達式。支援多種語言的正規表示法語法，提供匹配結果高亮顯示、群組捕獲、測試字串驗證等功能。',
      component: 'RegexTester',
      tags: ['regex', 'pattern', 'test', '正規表示式', 'regular expression', 'pattern matching'],
      badge: { text: '尚未更新', color: 'danger' },
      seo: {
        title: '正規表示法測試工具 - Regex Tester',
        description: '免費的線上正規表示式測試工具，即時驗證 Regex 表達式。支援多種語言語法、匹配結果高亮、群組捕獲功能。',
        keywords: 'regex tester, 正規表示式, regular expression, pattern matching, regex 測試'
      }
    },
    {
      id: 'fluent-formatter',
      name: 'Fluent 格式化',
      description: '專為 Fluentd 和 Fluent Bit 設計的正規表達式測試和格式化工具。支援測試 Fluentd 的 parser 配置、驗證 log 解析規則、格式化配置檔案。',
      component: 'FluentFormatter',
      tags: ['fluent', 'fluentd', 'fluent bit', 'regex', 'log', 'parser'],
      badge: { text: '稍後更新', color: 'primary' },
      seo: {
        title: 'Fluentd 格式化工具 - Fluent Parser 測試',
        description: '專業的 Fluentd 正規表達式測試工具，驗證 log parser 配置、測試解析規則、格式化 Fluentd 配置檔。',
        keywords: 'fluentd, fluent bit, log parser, fluentd regex, log 解析'
      }
    }    
  ],
  systemTools: [
    {
      id: 'cron-parser',
      name: 'Cron 表達式解析',
      description: '線上 Cron 表達式解析和驗證工具。即時解析 Cron 表達式、顯示執行時間、計算下次執行時間。支援標準 Cron 語法和擴展語法，適合系統管理員、DevOps 工程師使用。',
      component: 'CronParser',
      tags: ['cron', 'schedule', 'time', 'crontab', 'cronjob', 'cron parser', '排程'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: 'Cron 表達式解析器 - Cron Parser 線上工具',
        description: '免費的 Cron 表達式解析工具，即時驗證 Cron 語法、顯示執行時間、計算下次執行時間。支援標準和擴展 Cron 語法。',
        keywords: 'cron parser, cron 表達式, crontab, cronjob, 排程工具, cron 驗證'
      }
    },
    {
      id: 'php-fpm-calc',
      name: 'PHP-FPM 計算器',
      description: '計算 PHP-FPM 最佳配置參數的工具。根據伺服器記憶體、預期流量、平均請求大小，自動計算 pm.max_children、pm.start_servers 等參數，優化 PHP 性能。',
      component: 'PhpFpmCalculator',
      tags: ['php', 'fpm', 'php-fpm', 'performance', 'optimization', '性能優化'],
      badge: { text: '稍後更新', color: 'primary' },
      seo: {
        title: 'PHP-FPM 計算器 - PHP 性能優化工具',
        description: '專業的 PHP-FPM 配置計算工具，根據伺服器資源自動計算最佳參數。優化 pm.max_children、pm.start_servers 等配置。',
        keywords: 'php-fpm calculator, php 優化, php-fpm 配置, php 性能, pm.max_children'
      }
    },
    {
      id: 'nginx-formatter',
      name: 'Nginx 配置格式化',
      description: '線上 Nginx 配置檔格式化和美化工具。自動整理 Nginx 配置檔的縮排、排版，提高可讀性。支援語法檢查、配置驗證。',
      component: 'NginxFormatter',
      tags: ['nginx', 'config', 'format', 'beautify', 'nginx 配置', '格式化'],
      badge: { text: '稍後更新', color: 'primary' },
      seo: {
        title: 'Nginx 配置格式化工具 - Nginx Config Formatter',
        description: '免費的 Nginx 配置檔格式化工具，自動美化和整理 Nginx 配置。支援語法檢查、縮排調整、提高可讀性。',
        keywords: 'nginx formatter, nginx 配置, nginx beautify, nginx 格式化, nginx config'
      }
    }
  ],
  networkTools: [
    {
      id: 'ip-calculator',
      name: 'IP 子網路計算器',
      description: '專業的 IP 子網路計算工具，支援 IPv4 和 CIDR 記號計算。快速計算網路位址、廣播位址、可用 IP 範圍、子網路遮罩。適合網路規劃、IP 分配、CIDR 設計。',
      component: 'IpCalculator',
      tags: ['ip', 'subnet', 'cidr', 'network', 'ipv4', 'ip calculator', '子網路計算'],
      badge: { text: '正在更新', color: 'warning' },
      seo: {
        title: 'IP 子網路計算器 - CIDR 計算工具',
        description: '專業的 IP 子網路計算器，支援 IPv4 和 CIDR 計算。快速計算網路位址、廣播位址、可用 IP 範圍、子網路遮罩。',
        keywords: 'ip calculator, subnet calculator, cidr 計算, ip 子網路, 網路計算, ipv4 calculator'
      }
    },
    {
      id: 'eks-cni-calculator',
      name: 'EKS CNI 計算器',
      description: '計算 AWS EKS 集群的 CNI 容量和 IP 需求。支援計算每個節點最多可分配的 Pod 數量、集群總容量、子網路 IP 使用率，並提供多子網路配置建議。適用於 Kubernetes 網路規劃、AWS VPC CIDR 設計。',
      component: 'EksCniCalculator',
      tags: ['eks', 'kubernetes', 'aws', 'cni', 'pod', 'ip', 'eks cni calculator', 'aws pod ip', 'kubernetes network', 'vpc cidr', 'subnet calculator'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: 'EKS CNI 計算器 - AWS Kubernetes Pod IP 容量計算工具',
        description: '專業的 AWS EKS CNI 計算器，快速計算 Kubernetes 集群的 Pod IP 容量、節點配置、子網路需求。支援多子網路規劃、IP 使用率分析，幫助您優化 EKS 網路架構。',
        keywords: 'EKS CNI Calculator, AWS EKS, Kubernetes Pod IP, CNI 計算, AWS 子網路, VPC CIDR, EKS 網路規劃, Pod 容量計算, Kubernetes IP 管理'
      }
    }
  ],
  securityTools: [
    {
      id: 'ssl-checker',
      name: 'SSL 憑證檢查',
      description: 'SSL/TLS 憑證驗證工具，檢查 SSL 憑證公鑰與私鑰是否正確配對。支援 PEM 格式憑證、私鑰驗證、憑證資訊查看。適合網站管理員、系統管理員使用。靈感來源：<a href="https://www.cloudmax.com.tw/service/ssl-tools" target="_blank">CloudMax SSL Tools</a>',
      component: 'SslChecker',
      tags: ['ssl', 'tls', 'certificate', 'security', 'ssl checker', '憑證檢查', 'https'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: 'SSL 憑證檢查工具 - SSL Certificate Checker',
        description: '免費的 SSL 憑證驗證工具，檢查 SSL 公鑰與私鑰配對、驗證憑證有效性。支援 PEM 格式、憑證資訊查看。',
        keywords: 'ssl checker, ssl 憑證, certificate checker, ssl 驗證, tls 憑證, https 憑證'
      }
    }
  ],
  devTools: [
    {
      id: 'code-formatter',
      name: '程式碼格式化',
      description: '多語言程式碼格式化和美化工具。支援 JavaScript、Python、Java、HTML、CSS、JSON 等多種程式語言。自動調整縮排、排版，提高程式碼可讀性。',
      component: 'CodeFormatter',
      tags: ['code', 'format', 'beautify', 'prettier', 'code formatter', '程式碼美化'],
      badge: { text: '稍後更新', color: 'primary' },
      seo: {
        title: '程式碼格式化工具 - Code Formatter & Beautifier',
        description: '免費的多語言程式碼格式化工具，支援 JavaScript、Python、Java、HTML、CSS、JSON。自動美化程式碼、調整縮排。',
        keywords: 'code formatter, code beautifier, 程式碼格式化, prettier, code format, 程式碼美化'
      }
    },
    {
      id: 'data-generator',
      name: '測試資料產生器',
      description: '強大的測試資料產生工具，快速產生各種格式的假資料。支援姓名、Email、電話、地址、日期、數字等多種資料類型。適合開發測試、資料庫填充、API 測試。靈感來源：<a href="https://generatedata.com/generator" target="_blank">GenerateData</a>',
      component: 'DataGenerator',
      tags: ['data', 'fake', 'generator', 'test', 'mock data', '測試資料', 'faker'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: '測試資料產生器 - Fake Data Generator',
        description: '免費的測試資料產生工具，快速產生假資料。支援姓名、Email、電話、地址等多種資料類型。適合開發測試、資料庫填充。',
        keywords: 'data generator, fake data, test data, mock data, 測試資料, faker, 假資料產生'
      }
    }
  ],
  pdfTools: [
    {
      id: 'pdf-unlock',
      name: 'PDF 解密',
      description: '線上 PDF 解密工具，移除 PDF 檔案的密碼保護。支援移除開啟密碼和權限密碼，讓您可以自由編輯、列印和複製 PDF 內容。所有處理都在瀏覽器本地完成，確保檔案安全。靈感來源：<a href="https://www.ilovepdf.com/zh-tw/unlock_pdf" target="_blank">iLovePDF</a>',
      component: 'PdfUnlock',
      tags: ['pdf', 'unlock', 'decrypt', 'password', 'pdf 解密', 'pdf 解鎖', '移除密碼'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: 'PDF 解密工具 - 移除 PDF 密碼保護',
        description: '免費的線上 PDF 解密工具，快速移除 PDF 密碼保護。支援移除開啟密碼和權限密碼，所有處理在本地完成，確保安全。',
        keywords: 'pdf unlock, pdf 解密, pdf 解鎖, 移除 pdf 密碼, pdf password remover, pdf decrypt'
      }
    },
    {
      id: 'pdf-merge',
      name: 'PDF 合併',
      description: '強大的 PDF 合併工具，支援多個 PDF 檔案合併。可以選擇特定頁面、調整頁面順序、拖曳排序。提供即時預覽功能，讓您精確控制合併結果。所有處理都在瀏覽器本地完成。靈感來源：<a href="https://www.ilovepdf.com/zh-tw/merge_pdf" target="_blank">iLovePDF</a>',
      component: 'PdfMerge',
      tags: ['pdf', 'merge', 'combine', 'join', 'pdf 合併', 'pdf 結合', '合併 pdf'],
      badge: { text: '已完成', color: 'success' },
      seo: {
        title: 'PDF 合併工具 - 線上合併多個 PDF 檔案',
        description: '免費的 PDF 合併工具，支援多檔案合併、選擇頁面、拖曳排序。提供即時預覽，所有處理在本地完成，確保安全。',
        keywords: 'pdf merge, pdf 合併, 合併 pdf, pdf combine, pdf join, merge pdf files'
      }
    }
  ]
}

// 扁平化工具列表，方便根據 ID 查找
export const toolsFlat = Object.values(tools).flat()

export function getToolById(id) {
  return toolsFlat.find(tool => tool.id === id)
}

export function getToolGroup(id) {
  const groupNames = {
    textTools: '文字處理工具',
    systemTools: '系統工具',
    networkTools: '網路工具',
    securityTools: '安全工具',
    devTools: '開發工具',
    pdfTools: 'PDF 工具'
  }
  
  for (const [groupKey, groupTools] of Object.entries(tools)) {
    if (groupTools.find(tool => tool.id === id)) {
      return groupNames[groupKey]
    }
  }
  return null
}