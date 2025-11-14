export const tools = {
  textTools: [
    {
      id: 'diff-checker',
      name: '文字差異比較',
      description: "比較兩個文字內容的差異，靈感來源：<a href='https://www.diffchecker.com/text-compare/' target='_blank'>https://www.diffchecker.com/text-compare/</a>",
      icon: 'ti-file-diff',
      component: 'DiffChecker',
      tags: ['diff', 'compare', 'text'],
      badge: { text: '已完成', color: 'success' }
    },
    {
      id: 'regex-tester',
      name: '正規表示法測試',
      description: '用來測試所寫的正規表示法是否正確',
      icon: 'ti-regex',
      component: 'RegexTester',
      tags: ['regex', 'pattern', 'test'],
      badge: { text: '尚未更新', color: 'danger' }      
    },
    {
      id: 'fluent-formatter',
      name: 'Fluent 格式化',
      description: '測試和格式化 Fluentd 正規表達式',
      icon: 'ti-regex',
      component: 'FluentFormatter',
      tags: ['fluent', 'regex', 'log'],
      badge: { text: '稍後更新', color: 'primary' }     
    }    
  ],
  systemTools: [
    {
      id: 'cron-parser',
      name: 'Cron 表達式解析',
      description: '測試和驗證 cron 表達式',
      icon: 'ti-clock',
      component: 'CronParser',
      tags: ['cron', 'schedule', 'time', 'crontab', 'cronjob'],
      badge: { text: '稍後更新', color: 'primary' }    
    },
    {
      id: 'php-fpm-calc',
      name: 'PHP-FPM 計算器',
      description: '計算 PHP-FPM 最佳配置',
      icon: 'ti-calculator',
      component: 'PhpFpmCalculator',
      tags: ['php', 'fpm', 'performance'],
      badge: { text: '稍後更新', color: 'primary' }    
    },
    {
      id: 'nginx-formatter',
      name: 'Nginx 配置格式化',
      description: '格式化和美化 Nginx 配置檔',
      icon: 'ti-file-code',
      component: 'NginxFormatter',
      tags: ['nginx', 'config', 'format'],
      badge: { text: '稍後更新', color: 'primary' }    
    }
  ],
  networkTools: [
    {
      id: 'ip-calculator',
      name: 'IP 子網路計算器',
      description: '計算 IP 子網路和 CIDR',
      icon: 'ti-network',
      component: 'IpCalculator',
      tags: ['ip', 'subnet', 'cidr', 'network'],
      badge: { text: '正在更新', color: 'warning' }
    }
  ],
  securityTools: [
    {
      id: 'ssl-checker',
      name: 'SSL 憑證檢查',
      description: "檢查 SSL 憑證公鑰與私鑰是否正確匹配證公鑰與私鑰是否正確匹配，靈感來源：<a href='https://www.cloudmax.com.tw/service/ssl-tools' target='_blank'>https://www.cloudmax.com.tw/service/ssl-tools</a>",
      icon: 'ti-certificate',
      component: 'SslChecker',
      tags: ['ssl', 'tls', 'certificate', 'security'],
      badge: { text: '已完成', color: 'success' }
    }
  ],
  devTools: [
    {
      id: 'code-formatter',
      name: '程式碼格式化',
      description: '格式化和美化程式碼',
      icon: 'ti-code',
      component: 'CodeFormatter',
      tags: ['code', 'format', 'beautify'],
      badge: { text: '稍後更新', color: 'primary' }
    },
    {
      id: 'data-generator',
      name: '測試資料產生器',
      description: '產生測試用的假資料',
      icon: 'ti-database',
      component: 'DataGenerator',
      tags: ['data', 'fake', 'generator', 'test'],
      badge: { text: '稍後更新', color: 'primary' }
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
    devTools: '開發工具'
  }
  
  for (const [groupKey, groupTools] of Object.entries(tools)) {
    if (groupTools.find(tool => tool.id === id)) {
      return groupNames[groupKey]
    }
  }
  return null
}