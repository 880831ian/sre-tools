<template>
  <div class="cron-parser">
    <div class="row">
      <div class="col-md-8">
        <div class="mb-3">
          <label class="form-label">Cron 表達式</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control font-monospace"
              v-model="cronExpression"
              placeholder="* * * * *"
              @input="parseCron"
              :class="{ 'is-invalid': error }"
            />
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              範例
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click="setCron('0 0 * * *')"
                  >每天午夜 (0 0 * * *)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click="setCron('0 */6 * * *')"
                  >每 6 小時 (0 */6 * * *)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click="setCron('0 9 * * 1-5')"
                  >工作日早上 9 點 (0 9 * * 1-5)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click="setCron('*/15 * * * *')"
                  >每 15 分鐘 (*/15 * * * *)</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="setCron('0 0 1 * *')"
                  >每月第一天 (0 0 1 * *)</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="setCron('30 2 * * 0')"
                  >每週日凌晨 2:30 (30 2 * * 0)</a
                >
              </li>
            </ul>
          </div>
          <div class="form-hint">格式: 分鐘 小時 日期 月份 星期</div>
        </div>

        <div class="row">
          <div class="col-sm-6 col-lg-2 mb-3">
            <label class="form-label">分鐘</label>
            <input
              type="text"
              class="form-control"
              v-model="parts.minute"
              @input="updateFromParts"
              placeholder="0-59"
              :class="{ 'is-invalid': validationErrors.minute }"
            />
            <small class="text-muted">0-59</small>
            <div v-if="validationErrors.minute" class="invalid-feedback">
              {{ validationErrors.minute }}
            </div>
          </div>
          <div class="col-sm-6 col-lg-2 mb-3">
            <label class="form-label">小時</label>
            <input
              type="text"
              class="form-control"
              v-model="parts.hour"
              @input="updateFromParts"
              placeholder="0-23"
              :class="{ 'is-invalid': validationErrors.hour }"
            />
            <small class="text-muted">0-23</small>
            <div v-if="validationErrors.hour" class="invalid-feedback">
              {{ validationErrors.hour }}
            </div>
          </div>
          <div class="col-sm-6 col-lg-2 mb-3">
            <label class="form-label">日期</label>
            <input
              type="text"
              class="form-control"
              v-model="parts.day"
              @input="updateFromParts"
              placeholder="1-31"
              :class="{ 'is-invalid': validationErrors.day }"
            />
            <small class="text-muted">1-31</small>
            <div v-if="validationErrors.day" class="invalid-feedback">
              {{ validationErrors.day }}
            </div>
          </div>
          <div class="col-sm-6 col-lg-3 mb-3">
            <label class="form-label">月份</label>
            <input
              type="text"
              class="form-control"
              v-model="parts.month"
              @input="updateFromParts"
              placeholder="1-12"
              :class="{ 'is-invalid': validationErrors.month }"
            />
            <small class="text-muted">1-12 或 JAN-DEC</small>
            <div v-if="validationErrors.month" class="invalid-feedback">
              {{ validationErrors.month }}
            </div>
          </div>
          <div class="col-sm-6 col-lg-3 mb-3">
            <label class="form-label">星期</label>
            <input
              type="text"
              class="form-control"
              v-model="parts.weekday"
              @input="updateFromParts"
              placeholder="0-7"
              :class="{ 'is-invalid': validationErrors.weekday }"
            />
            <small class="text-muted">0-7 或 SUN-SAT</small>
            <div v-if="validationErrors.weekday" class="invalid-feedback">
              {{ validationErrors.weekday }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="ti ti-clock me-2"></i>
              執行說明
            </h3>
          </div>
          <div class="card-body">
            <div v-if="description && !error" class="alert alert-success">
              <i class="ti ti-check-circle me-2"></i>
              <strong>{{ description }}</strong>
            </div>
            <div v-if="error" class="alert alert-danger">
              <i class="ti ti-alert-circle me-2"></i>
              {{ error }}
            </div>
            <div v-if="!error && cronExpression && nextRuns.length > 0">
              <h5>下次執行時間</h5>
              <div class="list-group list-group-flush">
                <div
                  v-for="(time, index) in nextRuns"
                  :key="index"
                  class="list-group-item px-0 py-2"
                >
                  <div class="d-flex align-items-center">
                    <span class="badge me-2">{{ index + 1 }}</span>
                    <div>
                      <div class="fw-medium">{{ time.formatted }}</div>
                      <small class="text-muted">{{ time.relative }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="!error && cronExpression" class="text-muted">
              <i class="ti ti-clock me-2"></i>
              計算下次執行時間中...
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Cron 語法說明</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>欄位</th>
                    <th>允許值</th>
                    <th>特殊字符</th>
                    <th>說明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>分鐘</td>
                    <td>0-59</td>
                    <td>* , - /</td>
                    <td>每分鐘的第幾分鐘執行</td>
                  </tr>
                  <tr>
                    <td>小時</td>
                    <td>0-23</td>
                    <td>* , - /</td>
                    <td>每天的第幾小時執行</td>
                  </tr>
                  <tr>
                    <td>日期</td>
                    <td>1-31</td>
                    <td>* , - /</td>
                    <td>每月的第幾天執行</td>
                  </tr>
                  <tr>
                    <td>月份</td>
                    <td>1-12 或 JAN-DEC</td>
                    <td>* , - /</td>
                    <td>每年的第幾月執行</td>
                  </tr>
                  <tr>
                    <td>星期</td>
                    <td>0-7 或 SUN-SAT</td>
                    <td>* , - /</td>
                    <td>每週的第幾天執行 (0和7都代表星期日)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br />
            <h5>特殊字符說明</h5>
            <ul>
              <li><code>*</code> - 匹配所有值</li>
              <li><code>,</code> - 分隔多個值 (例: 1,3,5)</li>
              <li><code>-</code> - 指定範圍 (例: 1-5)</li>
              <li><code>/</code> - 指定間隔 (例: */5 表示每5個單位)</li>
            </ul>

            <h5>常用範例</h5>
            <div class="row">
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li><code>0 0 * * *</code> - 每天午夜</li>
                  <li><code>0 */2 * * *</code> - 每2小時</li>
                  <li><code>*/30 * * * *</code> - 每30分鐘</li>
                  <li><code>0 9-17 * * 1-5</code> - 工作日9-17點</li>
                </ul>
              </div>
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li><code>0 0 1 * *</code> - 每月1號</li>
                  <li><code>0 0 * * 0</code> - 每週日</li>
                  <li><code>0 2 * * 1</code> - 每週一凌晨2點</li>
                  <li><code>15 10 * * *</code> - 每天10:15</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CronParser",
  data() {
    return {
      cronExpression: "0 9 * * 1-5",
      parts: {
        minute: "0",
        hour: "9",
        day: "*",
        month: "*",
        weekday: "1-5",
      },
      description: "",
      error: null,
      nextRuns: [],
      validationErrors: {},
    };
  },
  mounted() {
    this.parseCron();
  },
  methods: {
    setCron(expression) {
      this.cronExpression = expression;
      this.parseCron();
    },

    updateFromParts() {
      // 驗證各個部分
      this.validateParts();

      if (Object.keys(this.validationErrors).length === 0) {
        this.cronExpression = `${this.parts.minute} ${this.parts.hour} ${this.parts.day} ${this.parts.month} ${this.parts.weekday}`;
        this.parseCron();
      }
    },

    validateParts() {
      this.validationErrors = {};

      // 驗證分鐘
      if (!this.validateCronField(this.parts.minute, 0, 59)) {
        this.validationErrors.minute = "分鐘必須在 0-59 範圍內";
      }

      // 驗證小時
      if (!this.validateCronField(this.parts.hour, 0, 23)) {
        this.validationErrors.hour = "小時必須在 0-23 範圍內";
      }

      // 驗證日期
      if (!this.validateCronField(this.parts.day, 1, 31)) {
        this.validationErrors.day = "日期必須在 1-31 範圍內";
      }

      // 驗證月份
      if (
        !this.validateCronField(this.parts.month, 1, 12, [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ])
      ) {
        this.validationErrors.month = "月份必須在 1-12 範圍內或使用 JAN-DEC";
      }

      // 驗證星期
      if (
        !this.validateCronField(this.parts.weekday, 0, 7, [
          "SUN",
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT",
        ])
      ) {
        this.validationErrors.weekday = "星期必須在 0-7 範圍內或使用 SUN-SAT";
      }
    },

    validateCronField(field, min, max, aliases = []) {
      if (!field || field.trim() === "") return false;

      // 允許 *
      if (field === "*") return true;

      // 處理逗號分隔的值
      const parts = field.split(",");

      for (const part of parts) {
        const trimmedPart = part.trim();

        // 處理範圍 (例: 1-5)
        if (trimmedPart.includes("-")) {
          const [start, end] = trimmedPart.split("-");
          const startNum = this.parseValue(start, aliases);
          const endNum = this.parseValue(end, aliases);

          if (
            startNum === null ||
            endNum === null ||
            startNum < min ||
            endNum > max ||
            startNum > endNum
          ) {
            return false;
          }
        }
        // 處理間隔 (例: */5, 0-23/2)
        else if (trimmedPart.includes("/")) {
          const [range, step] = trimmedPart.split("/");
          const stepNum = parseInt(step);

          if (isNaN(stepNum) || stepNum <= 0) return false;

          if (range === "*") {
            // */5 格式
            continue;
          } else if (range.includes("-")) {
            // 0-23/2 格式
            const [start, end] = range.split("-");
            const startNum = this.parseValue(start, aliases);
            const endNum = this.parseValue(end, aliases);

            if (
              startNum === null ||
              endNum === null ||
              startNum < min ||
              endNum > max
            ) {
              return false;
            }
          } else {
            // 單個數字/步長
            const num = this.parseValue(range, aliases);
            if (num === null || num < min || num > max) return false;
          }
        }
        // 處理單個值
        else {
          const num = this.parseValue(trimmedPart, aliases);
          if (num === null || num < min || num > max) return false;
        }
      }

      return true;
    },

    parseValue(value, aliases = []) {
      // 嘗試解析為數字
      const num = parseInt(value);
      if (!isNaN(num)) return num;

      // 嘗試解析為別名
      const upperValue = value.toUpperCase();
      const aliasIndex = aliases.indexOf(upperValue);
      if (aliasIndex !== -1) {
        return aliasIndex + (aliases.includes("SUN") ? 0 : 1); // 星期從0開始，月份從1開始
      }

      return null;
    },

    parseCron() {
      this.error = null;
      this.description = "";
      this.nextRuns = [];

      if (!this.cronExpression.trim()) {
        return;
      }

      const parts = this.cronExpression.trim().split(/\s+/);

      if (parts.length !== 5) {
        this.error = "Cron 表達式必須包含 5 個部分 (分鐘 小時 日期 月份 星期)";
        return;
      }

      // 更新各部分
      this.parts.minute = parts[0];
      this.parts.hour = parts[1];
      this.parts.day = parts[2];
      this.parts.month = parts[3];
      this.parts.weekday = parts[4];

      // 驗證各部分
      this.validateParts();

      if (Object.keys(this.validationErrors).length > 0) {
        this.error = "請檢查各欄位的輸入格式";
        return;
      }

      // 生成描述
      this.generateDescription();

      // 計算下次執行時間
      this.calculateNextRuns();
    },

    generateDescription() {
      try {
        const minute = this.parts.minute;
        const hour = this.parts.hour;
        const day = this.parts.day;
        const month = this.parts.month;
        const weekday = this.parts.weekday;

        // 處理時間部分（小時:分鐘）
        let timeDesc = "";
        if (hour === "*" && minute === "*") {
          timeDesc = "每分鐘";
        } else if (hour === "*") {
          if (minute.includes("/")) {
            const interval = minute.split("/")[1];
            timeDesc = `每 ${interval} 分鐘`;
          } else if (minute.includes(",")) {
            const minutes = minute.split(",").map((m) => m.padStart(2, "0"));
            timeDesc = `每小時的第 ${minutes.join("、")} 分鐘`;
          } else {
            timeDesc = `每小時的第 ${minute.padStart(2, "0")} 分鐘`;
          }
        } else if (minute === "*") {
          if (hour.includes("/")) {
            const interval = hour.split("/")[1];
            timeDesc = `每 ${interval} 小時`;
          } else if (hour.includes(",")) {
            timeDesc = `在 ${hour} 點的每分鐘`;
          } else {
            timeDesc = `在 ${hour} 點的每分鐘`;
          }
        } else if (hour.includes("/")) {
          // 小時有間隔，例如 */6
          const interval = hour.split("/")[1];
          const minuteStr = minute === "0" ? "0" : minute.padStart(2, "0");
          timeDesc = `在每 ${interval} 小時的第 ${minuteStr} 分鐘`;
        } else {
          // 有具體的小時和分鐘
          const hourStr = hour.includes(",")
            ? hour
            : hour.includes("-")
            ? hour
            : hour.padStart(2, "0");
          const minuteStr = minute.includes(",")
            ? minute
            : minute.includes("-")
            ? minute
            : minute.padStart(2, "0");

          if (hour.includes(",") || hour.includes("-")) {
            timeDesc = `在 ${hourStr} 點的第 ${minuteStr} 分`;
          } else if (minute.includes(",") || minute.includes("-")) {
            timeDesc = `在 ${hourStr}:${minuteStr} 分`;
          } else {
            timeDesc = `在 ${hourStr}:${minuteStr}`;
          }
        }

        // 處理日期部分
        let dateDesc = "";
        // */1 等同於 *（每天）
        const isEveryDay = day === "*" || day === "*/1";
        const hasDay = !isEveryDay;
        const hasWeekday = weekday !== "*";

        if (hasDay && hasWeekday) {
          dateDesc = `每月第 ${day} 天且為${this.formatWeekday(weekday)}`;
        } else if (isEveryDay && hasWeekday) {
          // 每天但只在特定星期執行
          dateDesc = `${this.formatWeekday(weekday)}`;
        } else if (hasDay) {
          if (day === "1") {
            dateDesc = "每月第一天";
          } else if (day.includes(",")) {
            dateDesc = `每月第 ${day} 天`;
          } else if (day.includes("-")) {
            dateDesc = `每月第 ${day} 天`;
          } else {
            dateDesc = `每月第 ${day} 天`;
          }
        } else if (hasWeekday) {
          dateDesc = this.formatWeekday(weekday);
        } else {
          dateDesc = "每天";
        }

        // 處理月份部分
        let monthDesc = "";
        if (month !== "*") {
          if (month.includes(",")) {
            monthDesc = `在 ${this.formatMonth(month)} 月`;
          } else if (month.includes("-")) {
            const [start, end] = month.split("-");
            monthDesc = `在 ${this.formatMonth(start)} 月到 ${this.formatMonth(
              end
            )} 月`;
          } else {
            monthDesc = `在 ${this.formatMonth(month)} 月`;
          }
        }

        // 組合描述
        let desc = timeDesc;

        if (monthDesc) {
          desc = `${desc}，${monthDesc}的${dateDesc}`;
        } else {
          desc = `${desc}，${dateDesc}`;
        }

        this.description = desc;
      } catch (e) {
        this.error = "無法解析 Cron 表達式";
      }
    },

    formatWeekday(weekday) {
      const weekdayMap = {
        0: "星期日",
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六",
        7: "星期日",
      };

      if (weekday === "1-5") {
        return "每週一到週五（工作日）";
      } else if (weekday === "0,6" || weekday === "6,0") {
        return "每週六和週日（週末）";
      } else if (weekday.includes(",")) {
        const days = weekday.split(",").map((d) => weekdayMap[d] || `第${d}天`);
        return days.join("、");
      } else if (weekday.includes("-")) {
        const [start, end] = weekday.split("-");
        return `每週${weekdayMap[start] || start}到${weekdayMap[end] || end}`;
      } else {
        return weekdayMap[weekday] || `每週第 ${weekday} 天`;
      }
    },

    formatMonth(month) {
      const monthMap = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "七",
        8: "八",
        9: "九",
        10: "十",
        11: "十一",
        12: "十二",
      };

      if (month.includes(",")) {
        return month
          .split(",")
          .map((m) => monthMap[m] || m)
          .join("、");
      }

      return monthMap[month] || month;
    },

    calculateNextRuns() {
      try {
        const now = new Date();
        const runs = [];

        // 重新計算下次執行時間，確保所有欄位變更都會更新
        let currentTime = new Date(now);

        for (let i = 0; i < 5; i++) {
          const nextTime = this.getNextExecution(currentTime);
          if (nextTime) {
            runs.push({
              formatted: nextTime.toLocaleString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              relative: this.getRelativeTime(nextTime, now),
            });
            // 下一次計算從這次結果的下一分鐘開始
            currentTime = new Date(nextTime.getTime() + 60000);
          }
        }

        this.nextRuns = runs;
      } catch (e) {
        console.warn("計算下次執行時間失敗:", e);
      }
    },

    getNextExecution(baseTime) {
      // 解析各個部分
      const minute = this.parseCronValue(this.parts.minute, 0, 59);
      const hour = this.parseCronValue(this.parts.hour, 0, 23);
      const day = this.parseCronValue(this.parts.day, 1, 31);
      const month = this.parseCronValue(this.parts.month, 1, 12);
      const weekday = this.parseCronValue(this.parts.weekday, 0, 7);

      // 從當前時間的下一分鐘開始查找
      let checkTime = new Date(baseTime);
      checkTime.setSeconds(0, 0);
      checkTime.setMinutes(checkTime.getMinutes() + 1);

      // 最多查找未來 2 年（避免無限循環）
      const maxIterations = 365 * 2 * 24 * 60; // 2年的分鐘數
      let iterations = 0;

      while (iterations < maxIterations) {
        iterations++;

        // 檢查月份
        if (!this.matchesCronValue(checkTime.getMonth() + 1, month)) {
          // 跳到下個月的第一天
          checkTime.setMonth(checkTime.getMonth() + 1, 1);
          checkTime.setHours(0, 0, 0, 0);
          continue;
        }

        // 檢查日期和星期（OR 關係）
        const dayMatches =
          day.type === "all" || this.matchesCronValue(checkTime.getDate(), day);
        const weekdayMatches =
          weekday.type === "all" ||
          this.matchesCronValue(checkTime.getDay(), weekday);

        // 如果日期和星期都是 *，則匹配所有日期
        // 如果只有日期指定（星期是 *），則只檢查日期
        // 如果只有星期指定（日期是 *），則只檢查星期
        // 如果兩者都指定，則需要滿足其中一個（OR）
        let dayWeekdayMatch = false;
        if (day.type === "all" && weekday.type === "all") {
          dayWeekdayMatch = true;
        } else if (day.type === "all") {
          dayWeekdayMatch = weekdayMatches;
        } else if (weekday.type === "all") {
          dayWeekdayMatch = dayMatches;
        } else {
          dayWeekdayMatch = dayMatches || weekdayMatches;
        }

        if (!dayWeekdayMatch) {
          // 跳到下一天
          checkTime.setDate(checkTime.getDate() + 1);
          checkTime.setHours(0, 0, 0, 0);
          continue;
        }

        // 檢查小時
        if (!this.matchesCronValue(checkTime.getHours(), hour)) {
          // 跳到下一個匹配的小時
          const nextHour = this.getNextMatchingValue(
            checkTime.getHours(),
            hour,
            23
          );
          if (nextHour !== null && nextHour > checkTime.getHours()) {
            checkTime.setHours(nextHour, 0, 0, 0);
          } else {
            // 跳到下一天的第一個匹配小時
            checkTime.setDate(checkTime.getDate() + 1);
            checkTime.setHours(0, 0, 0, 0);
          }
          continue;
        }

        // 檢查分鐘
        if (!this.matchesCronValue(checkTime.getMinutes(), minute)) {
          // 跳到下一個匹配的分鐘
          const nextMinute = this.getNextMatchingValue(
            checkTime.getMinutes(),
            minute,
            59
          );
          if (nextMinute !== null && nextMinute > checkTime.getMinutes()) {
            checkTime.setMinutes(nextMinute, 0, 0);
          } else {
            // 跳到下一個小時的第一個匹配分鐘
            checkTime.setHours(checkTime.getHours() + 1, 0, 0, 0);
          }
          continue;
        }

        // 找到匹配的時間
        return checkTime;
      }

      return null;
    },

    getNextMatchingValue(current, cronValue, max) {
      if (cronValue.type === "all") {
        return current;
      }

      for (const value of cronValue.values) {
        if (value > current) {
          return value;
        }
      }

      return null;
    },

    parseCronValue(value, min, max) {
      if (value === "*") return { type: "all" };

      const values = [];
      const parts = value.split(",");

      // 月份別名映射
      const monthMap = {
        JAN: 1,
        FEB: 2,
        MAR: 3,
        APR: 4,
        MAY: 5,
        JUN: 6,
        JUL: 7,
        AUG: 8,
        SEP: 9,
        OCT: 10,
        NOV: 11,
        DEC: 12,
      };

      // 星期別名映射
      const weekdayMap = {
        SUN: 0,
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
      };

      // 解析值（支持數字和別名）
      const parseValueWithAlias = (val) => {
        const num = parseInt(val);
        if (!isNaN(num)) return num;

        const upper = val.toUpperCase();
        if (monthMap[upper] !== undefined) return monthMap[upper];
        if (weekdayMap[upper] !== undefined) return weekdayMap[upper];

        return null;
      };

      for (const part of parts) {
        if (part.includes("/")) {
          const [range, step] = part.split("/");
          const stepNum = parseInt(step);

          if (range === "*") {
            // */1 等同於 *，直接返回 all
            if (stepNum === 1) {
              return { type: "all" };
            }
            for (let i = min; i <= max; i += stepNum) {
              values.push(i);
            }
          } else if (range.includes("-")) {
            const [start, end] = range.split("-");
            const startNum = parseValueWithAlias(start);
            const endNum = parseValueWithAlias(end);
            if (startNum !== null && endNum !== null) {
              for (let i = startNum; i <= endNum; i += stepNum) {
                values.push(i);
              }
            }
          }
        } else if (part.includes("-")) {
          const [start, end] = part.split("-");
          const startNum = parseValueWithAlias(start);
          const endNum = parseValueWithAlias(end);
          if (startNum !== null && endNum !== null) {
            for (let i = startNum; i <= endNum; i++) {
              values.push(i);
            }
          }
        } else {
          const num = parseValueWithAlias(part);
          if (num !== null) {
            values.push(num);
          }
        }
      }

      return { type: "values", values };
    },

    matchesCronValue(actual, cronValue) {
      if (cronValue.type === "all") return true;
      return cronValue.values.includes(actual);
    },

    parseSimpleValue(value) {
      if (value === "*") return null;
      const num = parseInt(value);
      return isNaN(num) ? null : num;
    },

    getRelativeTime(future, now) {
      const diff = future.getTime() - now.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days} 天後`;
      } else if (hours > 0) {
        return `${hours} 小時後`;
      } else if (minutes > 0) {
        return `${minutes} 分鐘後`;
      } else {
        return "即將執行";
      }
    },
  },
};
</script>

<style scoped>
.list-group-item {
  border: none;
  border-bottom: 1px solid #dee2e6;
}

.list-group-item:last-child {
  border-bottom: none;
}
</style>
