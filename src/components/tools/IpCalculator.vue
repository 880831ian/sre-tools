<template>
  <div class="ip-calculator">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">IP 地址 / CIDR</label>
          <input 
            type="text" 
            class="form-control font-monospace" 
            v-model="ipInput"
            placeholder="192.168.1.0/24 或 192.168.1.1"
            @input="calculateSubnet"
          >
          <div class="form-hint">
            輸入 IP 地址和 CIDR 記號，例如: 192.168.1.0/24
          </div>
        </div>
        
        <div class="row">
          <div class="col-sm-6">
            <div class="mb-3">
              <label class="form-label">子網路遮罩</label>
              <select class="form-select" v-model="selectedCidr" @change="updateCidr">
                <option v-for="cidr in cidrOptions" :key="cidr.value" :value="cidr.value">
                  /{{ cidr.value }} - {{ cidr.mask }} ({{ cidr.hosts }} 主機)
                </option>
              </select>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="mb-3">
              <label class="form-label">IP 版本</label>
              <div class="form-selectgroup form-selectgroup-boxes">
                <label class="form-selectgroup-item">
                  <input type="radio" class="form-selectgroup-input" value="4" v-model="ipVersion" @change="calculateSubnet">
                  <span class="form-selectgroup-label">IPv4</span>
                </label>
                <label class="form-selectgroup-item">
                  <input type="radio" class="form-selectgroup-input" value="6" v-model="ipVersion" @change="calculateSubnet">
                  <span class="form-selectgroup-label">IPv6</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">快速選擇</h3>
          </div>
          <div class="card-body">
            <div class="btn-group-vertical w-100">
              <button class="btn btn-outline-primary" @click="setExample('192.168.1.0/24')">
                私有網路 Class C (192.168.1.0/24)
              </button>
              <button class="btn btn-outline-primary" @click="setExample('10.0.0.0/8')">
                私有網路 Class A (10.0.0.0/8)
              </button>
              <button class="btn btn-outline-primary" @click="setExample('172.16.0.0/12')">
                私有網路 Class B (172.16.0.0/12)
              </button>
              <button class="btn btn-outline-primary" @click="setExample('127.0.0.0/8')">
                本地回環 (127.0.0.0/8)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="alert alert-danger mt-4">
      <i class="ti ti-alert-circle me-2"></i>
      {{ error }}
    </div>
    
    <div v-if="result && !error" class="row mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-network me-2"></i>
              網路資訊
            </h3>
          </div>
          <div class="card-body">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td><strong>網路地址</strong></td>
                  <td><code>{{ result.networkAddress }}</code></td>
                </tr>
                <tr>
                  <td><strong>廣播地址</strong></td>
                  <td><code>{{ result.broadcastAddress }}</code></td>
                </tr>
                <tr>
                  <td><strong>子網路遮罩</strong></td>
                  <td><code>{{ result.subnetMask }}</code></td>
                </tr>
                <tr>
                  <td><strong>反向遮罩</strong></td>
                  <td><code>{{ result.wildcardMask }}</code></td>
                </tr>
                <tr>
                  <td><strong>CIDR 記號</strong></td>
                  <td><code>{{ result.cidr }}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-calculator me-2"></i>
              統計資訊
            </h3>
          </div>
          <div class="card-body">
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td><strong>總 IP 數量</strong></td>
                  <td><span class="badge bg-blue">{{ result.totalIps }}</span></td>
                </tr>
                <tr>
                  <td><strong>可用主機數</strong></td>
                  <td><span class="badge bg-green">{{ result.usableIps }}</span></td>
                </tr>
                <tr>
                  <td><strong>第一個可用 IP</strong></td>
                  <td><code>{{ result.firstUsableIp }}</code></td>
                </tr>
                <tr>
                  <td><strong>最後可用 IP</strong></td>
                  <td><code>{{ result.lastUsableIp }}</code></td>
                </tr>
                <tr>
                  <td><strong>IP 類別</strong></td>
                  <td><span class="badge bg-purple">{{ result.ipClass }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="result && !error" class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-list me-2"></i>
              子網路劃分建議
            </h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>子網路大小</th>
                    <th>CIDR</th>
                    <th>子網路遮罩</th>
                    <th>可用主機數</th>
                    <th>子網路數量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subnet in subnetSuggestions" :key="subnet.cidr">
                    <td>/{{ subnet.cidr }}</td>
                    <td><code>{{ result.networkAddress.split('.').slice(0, 3).join('.') }}.0/{{ subnet.cidr }}</code></td>
                    <td><code>{{ subnet.mask }}</code></td>
                    <td>{{ subnet.hosts }}</td>
                    <td>{{ subnet.subnets }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IpCalculator',
  data() {
    return {
      ipInput: '192.168.1.0/24',
      ipVersion: '4',
      selectedCidr: 24,
      result: null,
      error: null,
      cidrOptions: [
        { value: 8, mask: '255.0.0.0', hosts: '16,777,214' },
        { value: 16, mask: '255.255.0.0', hosts: '65,534' },
        { value: 24, mask: '255.255.255.0', hosts: '254' },
        { value: 25, mask: '255.255.255.128', hosts: '126' },
        { value: 26, mask: '255.255.255.192', hosts: '62' },
        { value: 27, mask: '255.255.255.224', hosts: '30' },
        { value: 28, mask: '255.255.255.240', hosts: '14' },
        { value: 29, mask: '255.255.255.248', hosts: '6' },
        { value: 30, mask: '255.255.255.252', hosts: '2' }
      ],
      subnetSuggestions: []
    }
  },
  mounted() {
    this.calculateSubnet()
  },
  methods: {
    setExample(example) {
      this.ipInput = example
      this.calculateSubnet()
    },
    updateCidr() {
      const parts = this.ipInput.split('/')
      if (parts.length === 2) {
        this.ipInput = `${parts[0]}/${this.selectedCidr}`
      } else {
        this.ipInput = `${this.ipInput}/${this.selectedCidr}`
      }
      this.calculateSubnet()
    },
    calculateSubnet() {
      this.error = null
      this.result = null
      
      if (!this.ipInput.trim()) {
        return
      }
      
      try {
        if (this.ipVersion === '4') {
          this.calculateIPv4()
        } else {
          this.calculateIPv6()
        }
      } catch (e) {
        this.error = e.message
      }
    },
    calculateIPv4() {
      let ip, cidr
      
      if (this.ipInput.includes('/')) {
        [ip, cidr] = this.ipInput.split('/')
        cidr = parseInt(cidr)
      } else {
        ip = this.ipInput
        cidr = 24 // 預設
      }
      
      if (!this.isValidIPv4(ip)) {
        throw new Error('無效的 IPv4 地址')
      }
      
      if (cidr < 0 || cidr > 32) {
        throw new Error('CIDR 必須在 0-32 之間')
      }
      
      this.selectedCidr = cidr
      
      const ipParts = ip.split('.').map(Number)
      const ipInt = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
      
      const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0
      const networkInt = (ipInt & maskInt) >>> 0
      const broadcastInt = (networkInt | (0xFFFFFFFF >>> cidr)) >>> 0
      
      const networkAddress = this.intToIP(networkInt)
      const broadcastAddress = this.intToIP(broadcastInt)
      const subnetMask = this.intToIP(maskInt)
      const wildcardMask = this.intToIP(~maskInt >>> 0)
      
      const totalIps = Math.pow(2, 32 - cidr)
      const usableIps = totalIps > 2 ? totalIps - 2 : totalIps
      
      const firstUsableIp = totalIps > 1 ? this.intToIP(networkInt + 1) : networkAddress
      const lastUsableIp = totalIps > 1 ? this.intToIP(broadcastInt - 1) : broadcastAddress
      
      const ipClass = this.getIPClass(ipParts[0])
      
      this.result = {
        networkAddress,
        broadcastAddress,
        subnetMask,
        wildcardMask,
        cidr: `/${cidr}`,
        totalIps: totalIps.toLocaleString(),
        usableIps: usableIps.toLocaleString(),
        firstUsableIp,
        lastUsableIp,
        ipClass
      }
      
      this.generateSubnetSuggestions(cidr)
    },
    calculateIPv6() {
      // IPv6 計算的簡化版本
      this.result = {
        networkAddress: this.ipInput,
        broadcastAddress: 'N/A (IPv6 不使用廣播)',
        subnetMask: 'N/A',
        wildcardMask: 'N/A',
        cidr: '/64',
        totalIps: '18,446,744,073,709,551,616',
        usableIps: '18,446,744,073,709,551,616',
        firstUsableIp: 'N/A',
        lastUsableIp: 'N/A',
        ipClass: 'IPv6'
      }
    },
    isValidIPv4(ip) {
      const parts = ip.split('.')
      if (parts.length !== 4) return false
      
      return parts.every(part => {
        const num = parseInt(part)
        return num >= 0 && num <= 255 && part === num.toString()
      })
    },
    intToIP(int) {
      return [
        (int >>> 24) & 0xFF,
        (int >>> 16) & 0xFF,
        (int >>> 8) & 0xFF,
        int & 0xFF
      ].join('.')
    },
    getIPClass(firstOctet) {
      if (firstOctet >= 1 && firstOctet <= 126) return 'Class A'
      if (firstOctet >= 128 && firstOctet <= 191) return 'Class B'
      if (firstOctet >= 192 && firstOctet <= 223) return 'Class C'
      if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)'
      if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)'
      return 'Unknown'
    },
    generateSubnetSuggestions(currentCidr) {
      this.subnetSuggestions = []
      
      for (let cidr = currentCidr + 1; cidr <= Math.min(currentCidr + 4, 30); cidr++) {
        const hosts = Math.pow(2, 32 - cidr) - 2
        const subnets = Math.pow(2, cidr - currentCidr)
        const mask = this.intToIP((0xFFFFFFFF << (32 - cidr)) >>> 0)
        
        this.subnetSuggestions.push({
          cidr,
          mask,
          hosts: hosts.toLocaleString(),
          subnets: subnets.toLocaleString()
        })
      }
    }
  }
}
</script>