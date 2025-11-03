<template>
  <div class="regex-tester">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">正規表達式</label>
          <div class="input-group">
            <span class="input-group-text">/</span>
            <input 
              type="text" 
              class="form-control" 
              v-model="pattern"
              placeholder="輸入正規表達式"
              @input="testRegex"
            >
            <span class="input-group-text">/{{ flags }}</span>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">選項</label>
          <div class="form-selectgroup form-selectgroup-boxes d-flex flex-column">
            <label class="form-selectgroup-item flex-fill">
              <input type="checkbox" class="form-selectgroup-input" v-model="globalFlag" @change="updateFlags">
              <div class="form-selectgroup-label d-flex align-items-center p-3">
                <div class="me-3">
                  <span class="form-selectgroup-check"></span>
                </div>
                <div>
                  <strong>全域匹配 (g)</strong>
                  <div class="text-muted">匹配所有符合的結果</div>
                </div>
              </div>
            </label>
            <label class="form-selectgroup-item flex-fill">
              <input type="checkbox" class="form-selectgroup-input" v-model="ignoreCase" @change="updateFlags">
              <div class="form-selectgroup-label d-flex align-items-center p-3">
                <div class="me-3">
                  <span class="form-selectgroup-check"></span>
                </div>
                <div>
                  <strong>忽略大小寫 (i)</strong>
                  <div class="text-muted">不區分大小寫</div>
                </div>
              </div>
            </label>
            <label class="form-selectgroup-item flex-fill">
              <input type="checkbox" class="form-selectgroup-input" v-model="multiline" @change="updateFlags">
              <div class="form-selectgroup-label d-flex align-items-center p-3">
                <div class="me-3">
                  <span class="form-selectgroup-check"></span>
                </div>
                <div>
                  <strong>多行模式 (m)</strong>
                  <div class="text-muted">^ 和 $ 匹配行的開始和結束</div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">測試文字</label>
          <textarea 
            class="form-control" 
            rows="8"
            v-model="testText"
            placeholder="輸入要測試的文字"
            @input="testRegex"
          ></textarea>
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-check-circle me-2"></i>
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
                找到 {{ matches.length }} 個匹配結果
              </div>
              
              <div class="table-responsive">
                <table class="table table-vcenter">
                  <thead>
                    <tr>
                      <th>匹配</th>
                      <th>位置</th>
                      <th>群組</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(match, index) in matches" :key="index">
                      <td>
                        <code class="bg-success-lt">{{ match.match }}</code>
                      </td>
                      <td>{{ match.index }} - {{ match.index + match.match.length - 1 }}</td>
                      <td>
                        <span v-if="match.groups.length > 1" class="badge bg-blue me-1" v-for="(group, i) in match.groups.slice(1)" :key="i">
                          ${{ i + 1 }}: {{ group || '(空)' }}
                        </span>
                        <span v-else class="text-muted">無群組</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div v-else-if="pattern && testText">
              <div class="alert alert-warning">
                <i class="ti ti-alert-triangle me-2"></i>
                沒有找到匹配結果
              </div>
            </div>
            
            <div v-else class="text-muted text-center py-4">
              輸入正規表達式和測試文字開始測試
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegexTester',
  data() {
    return {
      pattern: '',
      testText: '',
      globalFlag: true,
      ignoreCase: false,
      multiline: false,
      flags: 'g',
      matches: [],
      error: null
    }
  },
  methods: {
    updateFlags() {
      let flags = ''
      if (this.globalFlag) flags += 'g'
      if (this.ignoreCase) flags += 'i'
      if (this.multiline) flags += 'm'
      this.flags = flags
      this.testRegex()
    },
    testRegex() {
      this.error = null
      this.matches = []
      
      if (!this.pattern || !this.testText) {
        return
      }
      
      try {
        const regex = new RegExp(this.pattern, this.flags)
        
        if (this.globalFlag) {
          let match
          while ((match = regex.exec(this.testText)) !== null) {
            this.matches.push({
              match: match[0],
              index: match.index,
              groups: match
            })
            
            // 避免無限循環
            if (!this.globalFlag) break
            if (match.index === regex.lastIndex) {
              regex.lastIndex++
            }
          }
        } else {
          const match = regex.exec(this.testText)
          if (match) {
            this.matches.push({
              match: match[0],
              index: match.index,
              groups: match
            })
          }
        }
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>