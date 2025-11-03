<template>
  <div class="code-formatter">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">程式語言</label>
          <select class="form-select" v-model="selectedLanguage">
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
            <option value="xml">XML</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label class="form-label">原始程式碼</label>
          <textarea 
            class="form-control font-monospace" 
            rows="20"
            v-model="sourceCode"
            placeholder="貼上你的程式碼..."
          ></textarea>
        </div>
        
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="formatCode">
            <i class="ti ti-code me-1"></i>
            格式化
          </button>
          <button class="btn btn-outline-secondary" @click="minifyCode">
            <i class="ti ti-minimize me-1"></i>
            壓縮
          </button>
          <button class="btn btn-outline-danger" @click="clearCode">
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
            v-model="formattedCode"
            readonly
          ></textarea>
        </div>
        
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="copyToClipboard" :disabled="!formattedCode">
            <i class="ti ti-copy me-1"></i>
            複製
          </button>
          <button class="btn btn-outline-success" @click="downloadCode" :disabled="!formattedCode">
            <i class="ti ti-download me-1"></i>
            下載
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="row mt-4">
      <div class="col-12">
        <div class="alert alert-danger">
          <i class="ti ti-alert-circle me-2"></i>
          {{ error }}
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">程式碼範例</h3>
          </div>
          <div class="card-body">
            <div class="btn-group mb-3" role="group">
              <button class="btn btn-outline-primary" @click="loadExample('javascript')">JavaScript</button>
              <button class="btn btn-outline-primary" @click="loadExample('json')">JSON</button>
              <button class="btn btn-outline-primary" @click="loadExample('html')">HTML</button>
              <button class="btn btn-outline-primary" @click="loadExample('css')">CSS</button>
              <button class="btn btn-outline-primary" @click="loadExample('sql')">SQL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeFormatter',
  data() {
    return {
      selectedLanguage: 'javascript',
      sourceCode: '',
      formattedCode: '',
      error: null,
      examples: {
        javascript: `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){if(items[i].price>0){total+=items[i].price*items[i].quantity;}}return total;}`,
        json: `{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","swimming","coding"]}`,
        html: `<!DOCTYPE html><html><head><title>Example</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph.</p></div></body></html>`,
        css: `.container{margin:0 auto;padding:20px;max-width:1200px;}.header{background-color:#333;color:white;padding:10px;}.content{margin-top:20px;}`,
        sql: `SELECT u.id,u.name,u.email,COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.created_at>='2023-01-01' GROUP BY u.id,u.name,u.email ORDER BY order_count DESC;`
      }
    }
  },
  methods: {
    formatCode() {
      this.error = null
      
      if (!this.sourceCode.trim()) {
        this.formattedCode = ''
        return
      }
      
      try {
        switch (this.selectedLanguage) {
          case 'javascript':
            this.formattedCode = this.formatJavaScript(this.sourceCode)
            break
          case 'json':
            this.formattedCode = this.formatJSON(this.sourceCode)
            break
          case 'html':
            this.formattedCode = this.formatHTML(this.sourceCode)
            break
          case 'css':
            this.formattedCode = this.formatCSS(this.sourceCode)
            break
          case 'sql':
            this.formattedCode = this.formatSQL(this.sourceCode)
            break
          case 'xml':
            this.formattedCode = this.formatXML(this.sourceCode)
            break
          default:
            this.formattedCode = this.sourceCode
        }
      } catch (e) {
        this.error = `格式化錯誤: ${e.message}`
        this.formattedCode = this.sourceCode
      }
    },
    minifyCode() {
      this.error = null
      
      if (!this.sourceCode.trim()) {
        this.formattedCode = ''
        return
      }
      
      try {
        switch (this.selectedLanguage) {
          case 'javascript':
            this.formattedCode = this.minifyJavaScript(this.sourceCode)
            break
          case 'json':
            this.formattedCode = this.minifyJSON(this.sourceCode)
            break
          case 'css':
            this.formattedCode = this.minifyCSS(this.sourceCode)
            break
          default:
            this.formattedCode = this.sourceCode.replace(/\s+/g, ' ').trim()
        }
      } catch (e) {
        this.error = `壓縮錯誤: ${e.message}`
        this.formattedCode = this.sourceCode
      }
    },
    formatJavaScript(code) {
      // 簡化的 JavaScript 格式化
      return code
        .replace(/;/g, ';\n')
        .replace(/{/g, ' {\n')
        .replace(/}/g, '\n}\n')
        .replace(/,/g, ',\n')
        .split('\n')
        .map(line => {
          const trimmed = line.trim()
          if (!trimmed) return ''
          
          let indent = 0
          const openBraces = (code.substring(0, code.indexOf(trimmed)).match(/{/g) || []).length
          const closeBraces = (code.substring(0, code.indexOf(trimmed)).match(/}/g) || []).length
          indent = Math.max(0, openBraces - closeBraces)
          
          if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1)
          
          return '  '.repeat(indent) + trimmed
        })
        .filter(line => line.trim())
        .join('\n')
    },
    formatJSON(code) {
      const parsed = JSON.parse(code)
      return JSON.stringify(parsed, null, 2)
    },
    formatHTML(code) {
      // 簡化的 HTML 格式化
      return code
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => {
          const trimmed = line.trim()
          if (!trimmed) return ''
          
          let indent = 0
          const beforeLine = code.substring(0, code.indexOf(trimmed))
          const openTags = (beforeLine.match(/<[^\/][^>]*>/g) || []).length
          const closeTags = (beforeLine.match(/<\/[^>]*>/g) || []).length
          indent = Math.max(0, openTags - closeTags)
          
          if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1)
          
          return '  '.repeat(indent) + trimmed
        })
        .filter(line => line.trim())
        .join('\n')
    },
    formatCSS(code) {
      return code
        .replace(/;/g, ';\n  ')
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}\n')
        .replace(/,/g, ',\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n')
    },
    formatSQL(code) {
      return code
        .replace(/SELECT/gi, 'SELECT\n  ')
        .replace(/FROM/gi, '\nFROM\n  ')
        .replace(/WHERE/gi, '\nWHERE\n  ')
        .replace(/JOIN/gi, '\nJOIN\n  ')
        .replace(/LEFT JOIN/gi, '\nLEFT JOIN\n  ')
        .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN\n  ')
        .replace(/INNER JOIN/gi, '\nINNER JOIN\n  ')
        .replace(/GROUP BY/gi, '\nGROUP BY\n  ')
        .replace(/ORDER BY/gi, '\nORDER BY\n  ')
        .replace(/HAVING/gi, '\nHAVING\n  ')
        .replace(/,/g, ',\n  ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n')
    },
    formatXML(code) {
      // 簡化的 XML 格式化
      return code
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => {
          const trimmed = line.trim()
          if (!trimmed) return ''
          
          let indent = 0
          const beforeLine = code.substring(0, code.indexOf(trimmed))
          const openTags = (beforeLine.match(/<[^\/\?][^>]*>/g) || []).length
          const closeTags = (beforeLine.match(/<\/[^>]*>/g) || []).length
          indent = Math.max(0, openTags - closeTags)
          
          if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1)
          
          return '  '.repeat(indent) + trimmed
        })
        .filter(line => line.trim())
        .join('\n')
    },
    minifyJavaScript(code) {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/}\s*/g, '}')
        .trim()
    },
    minifyJSON(code) {
      const parsed = JSON.parse(code)
      return JSON.stringify(parsed)
    },
    minifyCSS(code) {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/}\s*/g, '}')
        .replace(/:\s*/g, ':')
        .replace(/;\s*/g, ';')
        .trim()
    },
    clearCode() {
      this.sourceCode = ''
      this.formattedCode = ''
      this.error = null
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.formattedCode).then(() => {
        alert('已複製到剪貼簿')
      })
    },
    downloadCode() {
      const extension = {
        javascript: 'js',
        json: 'json',
        html: 'html',
        css: 'css',
        sql: 'sql',
        xml: 'xml'
      }[this.selectedLanguage] || 'txt'
      
      const blob = new Blob([this.formattedCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      
      a.href = url
      a.download = `formatted_code.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    loadExample(type) {
      if (this.examples[type]) {
        this.selectedLanguage = type
        this.sourceCode = this.examples[type]
        this.formatCode()
      }
    }
  }
}
</script>