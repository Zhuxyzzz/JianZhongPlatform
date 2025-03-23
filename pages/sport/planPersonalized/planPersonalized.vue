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

    <!-- 3. 计划列表 -->
    <view class="plan-list-section">
      <view class="section-header">
        <text class="section-title">个性化运动计划</text>
        <button class="refresh-button" @tap="generatePlan">生成/更新计划</button>
      </view>

      <view v-if="planList.length === 0" class="no-plan-tips">
        <text>暂无运动项目，请先选择运动强度并点击生成计划</text>
      </view>

      <view
        class="plan-item"
        v-for="(item, index) in planList"
        :key="index"
      >
        <image :src="item.img" class="plan-item-image" mode="aspectFill" />
        <view class="plan-item-info">
          <text class="plan-item-title">{{ item.name }}</text>
          <text class="plan-item-desc">{{ item.desc }}</text>
          <view class="plan-item-meta">
            <text>时长: {{ item.duration }} 分钟</text>
            <text>消耗: {{ item.calories }} kcal</text>
          </view>
        </view>
        <view class="plan-item-actions">
          <button size="mini" type="default" @tap.stop="removeItem(index)">删除</button>
          <button size="mini" type="primary" @click="startExercise(item)">开始</button>
        </view>
      </view>
    </view>

    <!-- 4. 提示与说明 -->
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
		user_avator:'../../../static/sports/images/user_avatar.png',
        name: '小明',
        weight: 70,
        height: 175,
        goal: '减脂 5kg',
        period: 30, // 减重周期
      },
      intensityModes: [
        { label: '轻度', value: 'light', icon: '../../../static/sports/images/planPersonalization/icon_light.png' },
        { label: '中度', value: 'medium', icon: '../../../static/sports/images/planPersonalization/icon_medium.png' },
        { label: '高强度', value: 'high', icon: '../../../static/sports/images/planPersonalization/icon_high.png' },
      ],
      selectedIntensity: null,
      planList: [] // 生成的运动计划列表
    }
  },
  computed: {
    computedBMI() {
      if (this.userInfo.height <= 0) return '--';
      const h = this.userInfo.height / 100; // 转化为米
      const bmi = (this.userInfo.weight / (h * h)).toFixed(1);
      return bmi;
    }
  },
  methods: {
    // 选择运动强度
    selectIntensity(val) {
      this.selectedIntensity = val;
    },
    // 生成/更新运动计划
    generatePlan() {
      if (!this.selectedIntensity) {
        uni.showToast({
          title: '请先选择运动强度',
          icon: 'none'
        });
        return;
      }
      // 根据 selectedIntensity + 用户信息生成个性化运动计划
      // 这里演示写死一些数据，实际项目中可通过接口请求或本地算法生成
      const basePlan = {
        light: [
          { 
            name: '轻松慢跑', 
            desc: '以慢跑为主，提升心肺功能', 
            duration: 20, 
            calories: 120, 
            img: '../../../static/sports/images/planPersonalization/jogging1.jpg'
          },
          { 
            name: '基础瑜伽', 
            desc: '缓解疲劳，增强柔韧性', 
            duration: 15, 
            calories: 80, 
            img: '../../../static/sports/images/planPersonalization/Yoga.jpg'
          }
        ],
        medium: [
          { 
            name: '中速跑步', 
            desc: '中等速度的跑步，锻炼耐力', 
            duration: 30, 
            calories: 220, 
            img: '../../../static/sports/images/planPersonalization/jogging2.png'
          },
          { 
            name: '全身燃脂 HIIT', 
            desc: '间歇性训练，提高燃脂效率', 
            duration: 15, 
            calories: 150, 
            img: '../../../static/sports/images/planPersonalization/HIIT.jpg'
          }
        ],
        high: [
          { 
            name: '高强度间歇跑', 
            desc: '跑步速度与休息交替，快速燃脂', 
            duration: 20, 
            calories: 250, 
            img: '../../../static/sports/images/planPersonalization/jogging3.png'
          },
          { 
            name: '力量训练（自重）', 
            desc: '俯卧撑、深蹲、平板支撑等', 
            duration: 20, 
            calories: 180, 
            img: '../../../static/sports/images/recommend2.jpg'
          }
        ]
      };
      this.planList = basePlan[this.selectedIntensity];
      uni.showToast({
        title: '已生成运动计划',
        icon: 'none'
      });
    },
    // 删除单个运动项目
    removeItem(index) {
      this.planList.splice(index, 1);
      uni.showToast({
        title: '已删除该运动',
        icon: 'none'
      });
    },
    // 开始运动
    startExercise(item) {
      uni.navigateTo({
        url: `/pages/sport/planPersonalized/exercise?name=${encodeURIComponent(item.name)}&desc=${encodeURIComponent(item.desc)}&duration=${item.duration}&calories=${item.calories}&img=${encodeURIComponent(item.img)}`
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

/* 1. 顶部信息概览 */
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
  color: #ff7b54; /* 可根据主题色调整 */
}

/* 2. 运动强度选择 */
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
  background-color: #ffe9e1; /* 选中状态的背景色可自定义 */
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

/* 3. 计划列表 */
.plan-list-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 10rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  justify-content: space-between;
}
.plan-item-actions button {
  margin-bottom: 5rpx;
  width: 100rpx;
  text-align: center;
}

/* 4. 提示与说明 */
.note-section {
  padding: 10rpx;
}
.note-text {
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
}
</style>
