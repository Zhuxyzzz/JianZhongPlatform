<template>
  <view class="sport-record-container">
    <!-- 1. 顶部数据概览 -->
    <view class="summary-section">
      <view class="summary-item">
        <image class="summary-icon" src="../../../static/sports/images/sportsRecord/step.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalSteps }}</text>
          <text class="summary-label">步数</text>
        </view>
      </view>
      <view class="summary-item">
        <image class="summary-icon" src="../../../static/sports/images/sportsRecord/mile.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalDistance }}</text>
          <text class="summary-label">公里</text>
        </view>
      </view>
      <view class="summary-item">
        <image class="summary-icon" src="../../../static/sports/images/sportsRecord/cal.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalCalories }}</text>
          <text class="summary-label">千卡</text>
        </view>
      </view>
    </view>

    <!-- 2. 月历区域（从注册日开始到今天，可导航月份） -->
    <view class="calendar-section">
      <view class="calendar-header">
        <button class="nav-btn" @tap="prevMonth" :disabled="!canPrevMonth">上一月</button>
        <text class="calendar-title">{{ currentYear }}年{{ currentMonth | padMonth }}月</text>
        <button class="nav-btn" @tap="nextMonth" :disabled="!canNextMonth">下一月</button>
      </view>
      <view class="calendar-container">
        <!-- 显示星期标题 -->
        <view class="week-header">
          <text class="week-cell" v-for="(w, index) in weekDays" :key="index">{{ w }}</text>
        </view>
        <!-- 日历网格 -->
        <view class="calendar-grid">
          <!-- 占位空格 -->
          <view v-for="n in firstWeekEmpty" :key="'empty-'+n" class="calendar-cell empty"></view>
          <!-- 正常日期 -->
          <view
            v-for="(cell, index) in calendarDays"
            :key="index"
            class="calendar-cell"
            :class="{ selected: cell.date === selectedDate, disabled: cell.disabled }"
            @tap="!cell.disabled && selectDate(cell.date)"
          >
            <text class="cell-day">{{ cell.day }}</text>
            <!-- 如果该天有记录，则显示醒目的红色圆点 -->
            <view v-if="hasRecord(cell.date)" class="record-indicator"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 3. 运动记录列表（仅展示选中日期的记录） -->
    <view class="record-section">
      <view class="record-header">
        <text class="record-title">运动记录 ({{ selectedDate }})</text>
        <button class="add-record-btn" @tap="showAddRecord = true">添加记录</button>
      </view>

      <view v-if="filteredRecordList.length === 0" class="no-record-tips">
        <text>暂无运动记录</text>
      </view>

      <view
        v-for="(item, index) in filteredRecordList"
        :key="index"
        class="record-item"
      >
        <view class="record-left">
          <text class="record-type">{{ item.type }}</text>
          <!-- 显示记录创建时刻 -->
          <text class="record-date">{{ item.recordedTime }}</text>
        </view>
        <view class="record-right">
          <text class="record-duration">{{ item.duration }} 分钟</text>
          <text
            v-if="exerciseDetails[item.type] && exerciseDetails[item.type].requiresDistance"
            class="record-distance"
          >
            {{ item.distance }} 公里
          </text>
          <text class="record-calories">{{ item.calories }} 千卡</text>
          <!-- 仅显示可删除记录的删除按钮 -->
          <button v-if="item.canDelete" class="delete-btn" @tap="deleteRecord(item)">删除</button>
        </view>
      </view>
    </view>

    <!-- 4. 添加记录弹窗 -->
    <view class="add-record-popup" v-if="showAddRecord">
      <view class="popup-content">
        <text class="popup-title">添加运动记录</text>
        <view class="popup-form">
          <!-- 选择运动类型 -->
          <picker
            mode="selector"
            :range="typeOptions"
            :value="form.typeIndex"
            @change="onTypeChange"
          >
            <view class="form-item">
              <text>运动类型</text>
              <text class="form-value">
                {{ typeOptions[form.typeIndex] }}
              </text>
            </view>
          </picker>
          <!-- 输入运动时长 -->
          <view class="form-item">
            <text>运动时长(分钟)</text>
            <input
              type="number"
              v-model="form.duration"
              placeholder="请输入时长"
            />
          </view>
          <!-- 输入运动距离（仅当该类型需要距离时显示） -->
          <view class="form-item" v-if="requiresDistance">
            <text>运动距离(公里)</text>
            <input
              type="digit"
              v-model="form.distance"
              placeholder="请输入距离"
            />
          </view>
          <!-- 自动计算卡路里显示（只读） -->
          <view class="form-item">
            <text>预计消耗热量</text>
            <text class="form-value">
              {{ computedFormCalories }} 千卡
            </text>
          </view>
        </view>
        <view class="popup-actions">
          <button @tap="cancelAddRecord" type="default">取消</button>
          <button @tap="confirmAddRecord" type="primary">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 用户信息（示例：体重70kg）
      userInfo: {
        weight: 70
      },
      // 注册日期（从此日期开始记录，格式：YYYY-MM-DD）
      registrationDate: '2025-02-01',
      // 数据概览
      totalSteps: 0,
      totalDistance: 0,
      totalCalories: 0,
      // 记录列表（自动记录与用户添加的记录混合在此）
      // 每条记录包含：
      // - associatedDate：记录所属日期（用于归类，例如“2025-03-28”）
      // - recordedTime：记录实际添加的时间（例如“2025-03-29 11:30”）
      // - canDelete：标识记录是否可删除
      recordList: [
        {
          type: '跑步',
          associatedDate: '2025-03-20',
          recordedTime: '2025-03-20 10:30',
          duration: 30,
          distance: 5,
          calories: 350,
          canDelete: false
        },
        {
          type: '健身',
          associatedDate: '2025-03-21',
          recordedTime: '2025-03-21 09:20',
          duration: 40,
          distance: 0,
          calories: 280,
          canDelete: false
        }
      ],
      // 添加记录弹窗显示标志
      showAddRecord: false,
      // 可选运动类型
      typeOptions: ['跑步', '健走', '骑行', '游泳', '健身', '其他'],
      // 表单数据
      form: {
        typeIndex: 0,
        duration: '',
        distance: ''
      },
      // 各运动类型详细属性：是否需要距离、对应MET值
      exerciseDetails: {
        '跑步': { requiresDistance: true, MET: 9.8 },
        '健走': { requiresDistance: true, MET: 3.8 },
        '骑行': { requiresDistance: true, MET: 7.5 },
        '游泳': { requiresDistance: true, MET: 8.0 },
        '健身': { requiresDistance: false, MET: 6.0 },
        '其他': { requiresDistance: false, MET: 5.0 }
      },
      // 日历数据（本月日历）
      calendarDays: [],
      selectedDate: '', // 格式 "YYYY-MM-DD"，用于过滤记录（匹配 record.associatedDate）
      // 当前显示的日历月份与年份
      currentYear: 0,
      currentMonth: 0,
      weekDays: ['日','一','二','三','四','五','六']
    };
  },
  filters: {
    // 将数字月份格式化为两位数字显示
    padMonth(value) {
      return String(value).padStart(2, '0');
    }
  },
  computed: {
    // 当前运动类型是否需要输入距离
    requiresDistance() {
      const type = this.typeOptions[this.form.typeIndex];
      return this.exerciseDetails[type]
        ? this.exerciseDetails[type].requiresDistance
        : false;
    },
    // 根据MET公式计算预计消耗热量：MET × 体重 × (时长/60)
    computedFormCalories() {
      const type = this.typeOptions[this.form.typeIndex];
      const details = this.exerciseDetails[type];
      const duration = Number(this.form.duration) || 0;
      if (details && duration > 0) {
        const calories = details.MET * this.userInfo.weight * (duration / 60);
        return calories.toFixed(0);
      }
      return 0;
    },
    // 根据记录的关联日期过滤出当天的记录
    filteredRecordList() {
      return this.recordList.filter(
        record => record.associatedDate === this.selectedDate
      );
    },
    // 是否允许导航到上一月（当前显示月份不早于注册月份）
    canPrevMonth() {
      const reg = new Date(this.registrationDate);
      const current = new Date(this.currentYear, this.currentMonth - 1);
      return current > new Date(reg.getFullYear(), reg.getMonth());
    },
    // 是否允许导航到下一月（不超过今天所在的月份）
    canNextMonth() {
      const today = new Date();
      const current = new Date(this.currentYear, this.currentMonth - 1);
      return current < new Date(today.getFullYear(), today.getMonth());
    },
    // 本月第一天对应的星期（0-6，0为周日）
    firstWeekEmpty() {
      const firstDate = new Date(this.currentYear, this.currentMonth - 1, 1);
      return firstDate.getDay();
    }
  },
  onLoad() {
    this.updateSummaryData();
    // 初始化当前日期：如果今天早于注册日则选注册日，否则选今天
    const today = this.getToday();
    this.selectedDate = (today >= this.registrationDate) ? today : this.registrationDate;
    // 初始化当前日历月份为当前日期所在月份
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
    this.generateCalendar();
  },
  methods: {
    // 运动类型选择变化
    onTypeChange(e) {
      this.form.typeIndex = Number(e.detail.value);
      if (!this.requiresDistance) {
        this.form.distance = '';
      }
    },
    // 更新顶部数据概览（步数、距离、热量）
    updateSummaryData() {
      let totalSteps = 0;
      let totalDistance = 0;
      let totalCalories = 0;
      this.recordList.forEach(item => {
        const type = item.type;
        if (this.exerciseDetails[type] && this.exerciseDetails[type].requiresDistance) {
          totalDistance += Number(item.distance);
          totalSteps += Number(item.distance) * 1300;
        }
        totalCalories += Number(item.calories);
      });
      this.totalDistance = totalDistance.toFixed(1);
      this.totalCalories = totalCalories.toFixed(0);
      this.totalSteps = totalSteps.toFixed(0);
    },
    // 取消添加记录
    cancelAddRecord() {
      this.showAddRecord = false;
      this.resetForm();
    },
    // 确认添加记录
    // 关联日期采用当前选中日期，记录时间为实际记录时刻，且用户添加的数据可删除
    confirmAddRecord() {
      if (!this.form.duration) {
        uni.showToast({
          title: '请填写运动时长',
          icon: 'none'
        });
        return;
      }
      if (this.requiresDistance && !this.form.distance) {
        uni.showToast({
          title: '请填写运动距离',
          icon: 'none'
        });
        return;
      }
      const record = {
        type: this.typeOptions[this.form.typeIndex],
        associatedDate: this.selectedDate,
        recordedTime: this.getNow(),
        duration: Number(this.form.duration),
        distance: this.requiresDistance ? Number(this.form.distance) : 0,
        calories: Number(this.computedFormCalories),
        canDelete: true  // 用户手动添加的数据可删除
      };
      this.recordList.unshift(record);
      this.showAddRecord = false;
      this.resetForm();
      this.updateSummaryData();
    },
    // 删除记录（仅允许删除 canDelete 为 true 的记录）
    deleteRecord(item) {
      const idx = this.recordList.indexOf(item);
      if (idx !== -1 && item.canDelete) {
        this.recordList.splice(idx, 1);
        this.updateSummaryData();
      }
    },
    // 重置添加记录表单
    resetForm() {
      this.form.typeIndex = 0;
      this.form.duration = '';
      this.form.distance = '';
    },
    // 获取今天日期（格式 YYYY-MM-DD）
    getToday() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    // 获取当前时间（格式 YYYY-MM-DD HH:mm）
    getNow() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    },
    // 生成当前月的日历数据
    generateCalendar() {
      let days = [];
      // 本月总天数
      const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = String(d).padStart(2, '0');
        const monthStr = String(this.currentMonth).padStart(2, '0');
        const dateStr = `${this.currentYear}-${monthStr}-${dayStr}`;
        // 判断是否可选：不能早于注册日期，也不能晚于今天
        const disabled = dateStr < this.registrationDate || dateStr > this.getToday();
        days.push({
          date: dateStr,
          day: d,
          disabled
        });
      }
      this.calendarDays = days;
    },
    // 点击日历单元格，更新选中日期（仅选中可用日期）
    selectDate(date) {
      this.selectedDate = date;
    },
    // 判断指定日期是否存在运动记录（比较 record.associatedDate）
    hasRecord(date) {
      return this.recordList.some(record => record.associatedDate === date);
    },
    // 导航到上一月
    prevMonth() {
      if (!this.canPrevMonth) return;
      if (this.currentMonth === 1) {
        this.currentYear--;
        this.currentMonth = 12;
      } else {
        this.currentMonth--;
      }
      this.generateCalendar();
      const firstDay = this.calendarDays.find(cell => !cell.disabled);
      if (firstDay) {
        this.selectedDate = firstDay.date;
      }
    },
    // 导航到下一月
    nextMonth() {
      if (!this.canNextMonth) return;
      if (this.currentMonth === 12) {
        this.currentYear++;
        this.currentMonth = 1;
      } else {
        this.currentMonth++;
      }
      this.generateCalendar();
      const available = this.calendarDays.filter(cell => !cell.disabled);
      if (available.length) {
        this.selectedDate = available[available.length - 1].date;
      }
    },
    // 外部调用：添加自动记录（例如定制计划来的记录，其 canDelete 为 false）
    addAutoRecord(record) {
      // record 对象应包含：type, associatedDate, recordedTime, duration, distance, calories, canDelete 等属性
      this.recordList.unshift(record);
      this.updateSummaryData();
    }
  }
};
</script>

<style scoped lang="scss">
.sport-record-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 10rpx;
}

/* 顶部数据概览 */
.summary-section {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.summary-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 6rpx;
}
.summary-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.summary-value {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.summary-label {
  font-size: 24rpx;
  color: #666;
}

/* 日历区域 */
.calendar-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.calendar-title {
  font-size: 28rpx;
  font-weight: bold;
}
.nav-btn {
  font-size: 24rpx;
  padding: 0 10rpx;
}
.nav-btn:disabled {
  color: #ccc;
}
.calendar-container {
  display: flex;
  flex-direction: column;
}
.week-header {
  display: flex;
}
.week-cell {
  width: calc(100% / 7);
  text-align: center;
  font-size: 24rpx;
  color: #666;
}
.calendar-grid {
  display: flex;
  flex-wrap: wrap;
}
.calendar-cell {
  width: calc(100% / 7);
  height: 60rpx;
  border: 1rpx solid #eee;
  text-align: center;
  position: relative;
  padding-top: 4rpx;
}
.calendar-cell.empty {
  background-color: #f9f9f9;
  border: none;
}
.calendar-cell.disabled {
  color: #ccc;
}
.cell-day {
  font-size: 24rpx;
}
.calendar-cell.selected {
  background-color: #ffe9e1;
  border-color: #ff7b54;
}
/* 更醒目的记录标识 */
.record-indicator {
  width: 12rpx;
  height: 12rpx;
  background-color: red;
  border: 2rpx solid #fff;
  border-radius: 50%;
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
}

/* 运动记录列表 */
.record-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.record-title {
  font-size: 28rpx;
  font-weight: bold;
}
.add-record-btn {
  font-size: 24rpx;
  padding: 0 10rpx;
}
.no-record-tips {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin-top: 40rpx;
}
.record-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 10rpx 0;
}
.record-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.record-type {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}
.record-date {
  font-size: 22rpx;
  color: #999;
}
.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.record-duration,
.record-distance,
.record-calories {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}
.delete-btn {
  font-size: 22rpx;
  color: #ff4d4f;
  border: none;
  background: none;
}

/* 添加记录弹窗 */
.add-record-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  width: 80%;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
}
.popup-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.popup-form {
  margin-bottom: 20rpx;
}
.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.form-item text {
  font-size: 24rpx;
  color: #333;
}
.form-item input {
  width: 300rpx;
  margin-left: 10rpx;
  border: 1rpx solid #ddd;
  border-radius: 4rpx;
  padding: 6rpx;
  font-size: 24rpx;
}
.form-value {
  font-size: 24rpx;
  color: #333;
}
.popup-actions {
  display: flex;
  justify-content: flex-end;
}
.popup-actions button {
  margin-left: 10rpx;
  font-size: 24rpx;
}
</style>
