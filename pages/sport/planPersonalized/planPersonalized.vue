<template> 
  <view class="plan-personalized-container">
    <!-- 1. 顶部信息概览 -->
    <view class="user-info-section">
      <view class="user-info-left">
        <image class="avatar" :src="userInfo.user_avator" mode="aspectFit"></image>
      </view>
      <view class="user-info-right">
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-stats">体重: {{ userInfo.weight }}kg | 身高: {{ userInfo.height }}cm</text>
        <text class="user-stats">BMI: {{ computedBMI }}</text>
        <text class="user-goal">目标: {{ userInfo.goal }} ({{ userInfo.period }}天)</text>
      </view>
    </view>

    <!-- 2. 运动强度选择 -->
    <view class="intensity-section">
      <text class="section-title">选择运动强度</text>
      <view class="intensity-options">
        <view
          v-for="(mode, idx) in intensityModes"
          :key="idx"
          class="intensity-item"
          :class="{ active: selectedIntensity === mode.value }"
          @tap="selectIntensity(mode.value)"
        >
          <image :src="mode.icon" class="intensity-icon" mode="aspectFit" />
          <text>{{ mode.label }}</text>
        </view>
      </view>
    </view>

    <!-- 3. 生成计划按钮 -->
    <view class="plan-list-section">
      <view class="section-header">
        <text class="section-title">个性化训练计划</text>
        <button class="refresh-button" @tap="generatePlan">生成/更新计划</button>
      </view>
      <view v-if="dailyPlanList.length === 0" class="no-plan-tips">
        <text>暂无训练计划，请先选择运动强度并点击生成计划</text>
      </view>
    </view>
    
    <!-- 4. 日历 -->
    <view class="calendar-section" v-if="dailyPlanList.length > 0">
      <text class="section-title">训练日历</text>
      <view class="calendar-container">
        <view 
          v-for="(day, index) in dailyPlanList" 
          :key="index" 
          class="calendar-day" 
          :class="{
            selected: day.date === selectedDate,
            'start-day': day.date === dailyPlanList[0].date,
            'end-day': day.date === dailyPlanList[dailyPlanList.length - 1].date
          }"
          @tap="selectDate(day.date)"
        >
          <text class="calendar-day-label">{{ formatCalendarDate(day.date) }}</text>
          <!-- 根据当天训练完成状态显示标记 -->
          <text v-if="isDayCompleted(day)" class="completed-indicator">✓</text>
          <text v-else class="incomplete-indicator">✗</text>
        </view>
      </view>
    </view>
    
    <!-- 5. 当天训练计划详情 -->
    <view class="daily-plan-section" v-if="selectedDayPlan">
      <text class="section-title">训练计划详情 ({{ selectedDate }})</text>
      <view class="plan-item">
        <image :src="selectedDayPlan.plan.img" class="plan-item-image" mode="aspectFill" />
        <view class="plan-item-info">
          <text class="plan-item-title">{{ selectedDayPlan.plan.name }}</text>
          <text class="plan-item-desc">{{ selectedDayPlan.plan.desc }}</text>
          <view class="plan-item-meta">
            <text>时长: {{ selectedDayPlan.plan.duration }} 分钟</text>
            <text>消耗: {{ selectedDayPlan.plan.calories }} kcal</text>
          </view>
        </view>
        <view class="plan-item-actions">
          <!-- 若未完成则显示开始按钮，否则显示已完成 -->
          <button v-if="!selectedDayPlan.plan.completed" size="mini" type="primary" @tap="startExercise(selectedDayPlan)">开始</button>
          <text v-else class="completed-text">已完成</text>
        </view>
      </view>
      <!-- 完成按钮，用于标记当天训练完成 -->
      <view v-if="!selectedDayPlan.plan.completed" class="complete-button-container">
        <button @tap="markCompleted">标记为已完成</button>
      </view>
    </view>
    
    <!-- 6. 提示与说明 -->
    <view class="note-section">
      <text class="note-text">提示：请根据自身身体状况与医生建议选择合适的运动强度。若感到不适，请立即停止并寻求医生帮助。</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        user_avator: '../../../static/sports/images/user_avatar.png',
        name: '小明',
        weight: 70,
        height: 175,
        goal: '减脂 5kg',
        period: 30 // 训练周期（天）
      },
      intensityModes: [
        { label: '轻度', value: 'light', icon: '../../../static/sports/images/planPersonalization/icon_light.png' },
        { label: '中度', value: 'medium', icon: '../../../static/sports/images/planPersonalization/icon_medium.png' },
        { label: '高强度', value: 'high', icon: '../../../static/sports/images/planPersonalization/icon_high.png' }
      ],
      selectedIntensity: null,
      dailyPlanList: [], // 每天的训练计划列表
      selectedDate: ''   // 当前选中的日期，格式 YYYY-MM-DD
    }
  },
  computed: {
    computedBMI() {
      if (this.userInfo.height <= 0) return '--';
      const h = this.userInfo.height / 100;
      return (this.userInfo.weight / (h * h)).toFixed(1);
    },
    // 返回当前选中日期对应的训练计划
    selectedDayPlan() {
      return this.dailyPlanList.find(day => day.date === this.selectedDate);
    }
  },
  methods: {
    // 选择运动强度
    selectIntensity(val) {
      this.selectedIntensity = val;
    },
    // 格式化日期为 YYYY-MM-DD 格式
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    // 将 "YYYY-MM-DD" 格式转为 "YYYY年MM月DD日" 显示
    formatCalendarDate(dateStr) {
      const parts = dateStr.split('-');
      return `${parts[0]}年${parts[1]}月${parts[2]}日`;
    },
    // 生成/更新训练计划（每日计划）
    generatePlan() {
      if (!this.selectedIntensity) {
        uni.showToast({
          title: '请先选择运动强度',
          icon: 'none'
        });
        return;
      }
      // 定义不同运动强度下的每日训练模板
      const dailyTemplates = {
        light: [
          { 
            name: '体能恢复', 
            desc: '低强度恢复体能，适合刚开始训练', 
            duration: 20, 
            calories: 100, 
            img: '../../../static/sports/images/planPersonalization/recovery.jpg'
          },
          { 
            name: '强化核心', 
            desc: '针对核心肌群的低强度训练', 
            duration: 25, 
            calories: 120, 
            img: '../../../static/sports/images/planPersonalization/core.jpg'
          },
          { 
            name: '放松身体', 
            desc: '舒缓肌肉，进行拉伸放松', 
            duration: 15, 
            calories: 80, 
            img: '../../../static/sports/images/planPersonalization/relax.jpg'
          },
          { 
            name: '轻松跑', 
            desc: '轻松跑步，促进血液循环', 
            duration: 20, 
            calories: 110, 
            img: '../../../static/sports/images/planPersonalization/jogging.jpg'
          }
        ],
        medium: [
          { 
            name: '体能恢复', 
            desc: '中等强度恢复体能训练', 
            duration: 25, 
            calories: 120, 
            img: '../../../static/sports/images/planPersonalization/recovery.jpg'
          },
          { 
            name: '强化核心', 
            desc: '针对核心的中等强度训练', 
            duration: 30, 
            calories: 150, 
            img: '../../../static/sports/images/planPersonalization/core.jpg'
          },
          { 
            name: '放松身体', 
            desc: '中等强度放松拉伸', 
            duration: 20, 
            calories: 90, 
            img: '../../../static/sports/images/planPersonalization/relax.jpg'
          },
          { 
            name: '轻松跑', 
            desc: '轻松跑步，提升耐力', 
            duration: 25, 
            calories: 130, 
            img: '../../../static/sports/images/planPersonalization/jogging.jpg'
          }
        ],
        high: [
          { 
            name: '体能恢复', 
            desc: '高强度体能恢复训练', 
            duration: 30, 
            calories: 150, 
            img: '../../../static/sports/images/planPersonalization/recovery.jpg'
          },
          { 
            name: '强化核心', 
            desc: '高强度核心训练，挑战极限', 
            duration: 35, 
            calories: 180, 
            img: '../../../static/sports/images/planPersonalization/core.jpg'
          },
          { 
            name: '放松身体', 
            desc: '高强度后适当放松，避免拉伤', 
            duration: 25, 
            calories: 100, 
            img: '../../../static/sports/images/planPersonalization/relax.jpg'
          },
          { 
            name: '轻松跑', 
            desc: '高强度下轻松跑，平衡训练', 
            duration: 30, 
            calories: 140, 
            img: '../../../static/sports/images/planPersonalization/jogging.jpg'
          }
        ]
      };
      
      // 以当前日期为计划开始日期
      const startDate = new Date();
      const period = this.userInfo.period;
      this.dailyPlanList = [];
      
      // 根据选定运动强度的模板生成每天的计划（模板循环使用）
      const template = dailyTemplates[this.selectedIntensity];
      for (let i = 0; i < period; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = this.formatDate(currentDate);
        const templateIndex = i % template.length;
        // 克隆模板数据并添加 completed 状态
        const planItem = Object.assign({}, template[templateIndex], { completed: false });
        this.dailyPlanList.push({
          date: formattedDate,
          plan: planItem
        });
      }
      
      // 默认选中第一天
      this.selectedDate = this.dailyPlanList[0].date;
      
      uni.showToast({
        title: '已生成训练计划',
        icon: 'none'
      });
    },
    // 点击日历选择日期
    selectDate(date) {
      this.selectedDate = date;
    },
    // 判断某一天的训练是否完成（本示例每天仅一项计划）
    isDayCompleted(day) {
      return day.plan.completed;
    },
    // 标记当前选中日的训练为完成
    markCompleted() {
      const day = this.dailyPlanList.find(item => item.date === this.selectedDate);
      if (day) {
        day.plan.completed = true;
        uni.showToast({
          title: '该日训练已完成',
          icon: 'none'
        });
      }
    },
    // 开始训练（可跳转到具体训练页面，完成后调用 markCompleted 标记完成）
    startExercise(dayPlan) {
      uni.navigateTo({
        url: `/pages/sport/planPersonalized/exercise?date=${dayPlan.date}&name=${encodeURIComponent(dayPlan.plan.name)}&desc=${encodeURIComponent(dayPlan.plan.desc)}&duration=${dayPlan.plan.duration}&calories=${dayPlan.plan.calories}&img=${encodeURIComponent(dayPlan.plan.img)}`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-personalized-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 10rpx;
}

/* 顶部信息 */
.user-info-section {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 10rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.user-info-left {
  margin-right: 10rpx;
}
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
}
.user-info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 5rpx;
}
.user-stats {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 3rpx;
}
.user-goal {
  font-size: 24rpx;
  color: #ff7b54;
}

/* 运动强度选择 */
.intensity-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.intensity-options {
  display: flex;
  justify-content: space-between;
}
.intensity-item {
  width: 32%;
  background-color: #fafafa;
  border-radius: 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}
.intensity-item.active {
  background-color: #ffe9e1;
  border: 1rpx solid #ff7b54;
}
.intensity-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 5rpx;
}
.intensity-item text {
  font-size: 24rpx;
  color: #333;
}

/* 计划列表 */
.plan-list-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.refresh-button {
  padding: 0 10rpx;
  font-size: 24rpx;
}
.no-plan-tips {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 20rpx 0;
}

/* 日历样式 */
.calendar-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.calendar-container {
  display: flex;
  flex-wrap: wrap;
}
.calendar-day {
  width: 14.28%;
  padding: 5rpx;
  text-align: center;
  border: 1rpx solid #eee;
  margin-bottom: 5rpx;
  border-radius: 4rpx;
}
.calendar-day.selected {
  border-color: #ff7b54;
}
.calendar-day-label {
  font-size: 20rpx;
  margin-bottom: 3rpx;
}

/* 标记完成状态 */
.completed-indicator {
  font-size: 20rpx;
  color: green;
}
.incomplete-indicator {
  font-size: 20rpx;
  color: red;
}

/* 训练计划开始与结束标识 */
.start-day {
  background-color: green !important;
  color: #fff;
}
.end-day {
  background-color: red !important;
  color: #fff;
}

/* 当天训练计划详情 */
.daily-plan-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.plan-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 10rpx;
}
.plan-item:last-child {
  border-bottom: none;
}
.plan-item-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.plan-item-info {
  flex: 1;
}
.plan-item-title {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
}
.plan-item-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}
.plan-item-meta text {
  font-size: 22rpx;
  color: #999;
  margin-right: 20rpx;
}
.plan-item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.completed-text {
  font-size: 24rpx;
  color: green;
}
.complete-button-container {
  text-align: center;
  margin-top: 10rpx;
}

/* 提示与说明 */
.note-section {
  padding: 10rpx;
}
.note-text {
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
}
</style>
