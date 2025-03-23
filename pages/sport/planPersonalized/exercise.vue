<template>
  <view class="exercise-container">
    <!-- 1. 运动项目信息展示 -->
    <view class="exercise-header">
      <image :src="exercise.img" class="exercise-image" mode="aspectFill"></image>
      <text class="exercise-title">{{ exercise.name }}</text>
      <text class="exercise-desc">{{ exercise.desc }}</text>
    </view>

    <!-- 2. 计时器展示 -->
    <view class="timer-section">
      <!-- 倒计时状态下显示倒计时数字 -->
      <text v-if="isCountdown" class="timer-display">倒计时：{{ countdown }}</text>
      <!-- 运动进行时显示运动计时 -->
      <text v-else class="timer-display">{{ timerDisplay }}</text>
      <!-- 控制按钮 -->
      <view class="control-buttons">
        <!-- 运动未开始时，显示“开始运动” -->
        <button v-if="!isCountdown && !isRunning" @tap="startCountdown">开始运动</button>
        <!-- 运动进行中显示重置和结束按钮 -->
        <button v-if="isRunning" @tap="resetTimer">重置运动</button>
        <button v-if="isRunning" @tap="endExercise('手动结束')">结束运动</button>
      </view>
    </view>

    <!-- 3. 运动信息展示 -->
    <view class="exercise-info">
      <text>总时长: {{ exercise.duration }} 分钟</text>
      <text>预计消耗: {{ exercise.calories }} kcal</text>
    </view>

    <!-- 4. 运动记录列表 -->
    <view class="record-section">
      <text class="section-title">运动记录</text>
      <view v-if="records.length === 0" class="no-records">
        <text>暂无记录</text>
      </view>
      <view v-for="(record, index) in records" :key="record.id" class="record-item">
        <text>{{ record.timestamp }} - {{ record.name }} - 时长: {{ record.duration }} 秒 - {{ record.reason }}</text>
        <button @tap="deleteRecord(index)">删除</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      exercise: {
        name: '',
        desc: '',
        duration: 0,  // 运动时长，单位：分钟
        calories: 0,
        img: ''
      },
      timer: null,         // 运动计时器引用
      remainingTime: 0,    // 剩余运动时间（秒）
      isRunning: false,    // 是否处于运动计时中
      countdown: 3,        // 三秒倒计时的计数器
      isCountdown: false,  // 是否正在倒计时
      records: []          // 运动记录列表
    }
  },
  computed: {
    // 将剩余秒数格式化为 MM:SS 格式
    timerDisplay() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  },
  onLoad(options) {
    // 从 URL 参数中获取运动项目信息
    this.exercise.name = options.name || '运动项目';
    this.exercise.desc = options.desc || '运动描述';
    this.exercise.duration = parseInt(options.duration) || 0;
    this.exercise.calories = parseInt(options.calories) || 0;
    this.exercise.img = decodeURIComponent(options.img) || '';
    // 将运动时长转换为秒，作为计时器初始时间
    this.remainingTime = this.exercise.duration * 60;
  },
  methods: {
    // 开始三秒倒计时，倒计时结束后启动运动计时器
    startCountdown() {
      if (this.isCountdown || this.isRunning) return;
      this.isCountdown = true;
      this.countdown = 3;
      const countdownTimer = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
        } else {
          clearInterval(countdownTimer);
          this.isCountdown = false;
          this.startExerciseTimer();
        }
      }, 1000);
    },
    // 开始运动计时器
    startExerciseTimer() {
      if (this.remainingTime <= 0) return;
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          // 计时结束后自动结束运动
          this.endExercise('完成运动');
        }
      }, 1000);
    },
    // 清除计时器并更新状态
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.isRunning = false;
    },
    // 重置运动计时器
    resetTimer() {
      this.stopTimer();
      this.remainingTime = this.exercise.duration * 60;
      uni.showToast({
        title: '运动已重置',
        icon: 'none'
      });
    },
    // 结束运动并记录本次运动情况
    endExercise(reason = '结束运动') {
      this.stopTimer();
      const exercisedTime = this.exercise.duration * 60 - this.remainingTime;
      const record = {
        id: new Date().getTime(),
        name: this.exercise.name,
        reason: reason,
        duration: exercisedTime, // 运动时长（秒）
        timestamp: new Date().toLocaleString()
      };
      this.records.push(record);
      // 重置剩余时间为初始值，方便下次运动
      this.remainingTime = this.exercise.duration * 60;
      uni.showToast({
        title: '运动已结束',
        icon: 'none'
      });
    },
    // 删除某条运动记录
    deleteRecord(index) {
      this.records.splice(index, 1);
      uni.showToast({
        title: '记录已删除',
        icon: 'none'
      });
    }
  },
  onUnload() {
    // 页面卸载时清除计时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script>

<style scoped>
.exercise-container {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5;
}

/* 运动项目信息 */
.exercise-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}
.exercise-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.exercise-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 5rpx;
}
.exercise-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 20rpx;
}

/* 计时器 */
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}
.timer-display {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.control-buttons {
  display: flex;
  flex-direction: row;
}
.control-buttons button {
  margin: 0 10rpx;
}

/* 运动信息 */
.exercise-info {
  display: flex;
  justify-content: space-around;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

/* 记录列表 */
.record-section {
  background-color: #fff;
  padding: 10rpx;
  border-radius: 8rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.no-records {
  text-align: center;
  color: #999;
  font-size: 24rpx;
}
.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.record-item:last-child {
  border-bottom: none;
}
</style>
