<template>
  <view class="sport-record-container">
    <!-- 1. 顶部数据概览 -->
    <view class="summary-section">
      <view class="summary-item">
        <image class="summary-icon" src="/static/images/icon_steps.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalSteps }}</text>
          <text class="summary-label">步数</text>
        </view>
      </view>
      <view class="summary-item">
        <image class="summary-icon" src="/static/images/icon_distance.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalDistance }}</text>
          <text class="summary-label">公里</text>
        </view>
      </view>
      <view class="summary-item">
        <image class="summary-icon" src="/static/images/icon_calorie.png" mode="aspectFit" />
        <view class="summary-info">
          <text class="summary-value">{{ totalCalories }}</text>
          <text class="summary-label">千卡</text>
        </view>
      </view>
    </view>

    <!-- 2. 运动记录列表 -->
    <view class="record-section">
      <view class="record-header">
        <text class="record-title">运动记录</text>
        <button class="add-record-btn" @tap="showAddRecord = true">添加记录</button>
      </view>

      <view v-if="recordList.length === 0" class="no-record-tips">
        <text>暂无运动记录</text>
      </view>

      <view
        v-for="(item, index) in recordList"
        :key="index"
        class="record-item"
      >
        <view class="record-left">
          <text class="record-type">{{ item.type }}</text>
          <text class="record-date">{{ item.date }}</text>
        </view>
        <view class="record-right">
          <text class="record-duration">{{ item.duration }} 分钟</text>
          <!-- 如果该运动类型需要距离，则显示距离；否则不显示 -->
          <text
            v-if="exerciseDetails[item.type] && exerciseDetails[item.type].requiresDistance"
            class="record-distance"
          >
            {{ item.distance }} 公里
          </text>
          <text class="record-calories">{{ item.calories }} 千卡</text>
        </view>
      </view>
    </view>

    <!-- 3. 添加记录弹窗 -->
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
          <view
            class="form-item"
            v-if="requiresDistance"
          >
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
      // 用户基本信息（示例：体重70kg）
      userInfo: {
        weight: 70
      },
      // 顶部数据概览
      totalSteps: 0,
      totalDistance: 0,
      totalCalories: 0,
      // 运动记录列表（示例数据）
      recordList: [
        {
          type: '跑步',
          date: '2025-03-20',
          duration: 30,
          distance: 5,
          calories: 350
        },
        {
          type: '健身',
          date: '2025-03-21',
          duration: 40,
          distance: 0,
          calories: 280
        }
      ],
      // 添加记录弹窗
      showAddRecord: false,
      // 可选运动类型
      typeOptions: ['跑步', '健走', '骑行', '游泳', '健身', '其他'],
      // 表单数据
      form: {
        typeIndex: 0,
        duration: '',
        distance: ''
      },
      // 每种运动类型的详细属性：是否需要距离、对应MET值
      exerciseDetails: {
        '跑步': { requiresDistance: true, MET: 9.8 },
        '健走': { requiresDistance: true, MET: 3.8 },
        '骑行': { requiresDistance: true, MET: 7.5 },
        '游泳': { requiresDistance: true, MET: 8.0 },
        '健身': { requiresDistance: false, MET: 6.0 },
        '其他': { requiresDistance: false, MET: 5.0 }
      }
    };
  },
  computed: {
    // 当前选择的运动是否需要输入距离
    requiresDistance() {
      const type = this.typeOptions[this.form.typeIndex];
      if (this.exerciseDetails[type]) {
        return this.exerciseDetails[type].requiresDistance;
      }
      return false;
    },
    // 采用 MET 公式计算卡路里：MET × 体重 × (时长 / 60)
    computedFormCalories() {
      const type = this.typeOptions[this.form.typeIndex];
      const details = this.exerciseDetails[type];
      const duration = Number(this.form.duration) || 0;
      if (details && duration > 0) {
        const calories = details.MET * this.userInfo.weight * (duration / 60);
        return calories.toFixed(0);
      }
      return 0;
    }
  },
  onLoad() {
    this.updateSummaryData();
  },
  methods: {
    // 选择运动类型
    onTypeChange(e) {
      this.form.typeIndex = Number(e.detail.value);
      // 如果该类型不需要距离，则重置距离为空
      if (!this.requiresDistance) {
        this.form.distance = '';
      }
    },
    // 更新顶部数据概览
    updateSummaryData() {
      let totalSteps = 0;
      let totalDistance = 0;
      let totalCalories = 0;
      this.recordList.forEach(item => {
        const type = item.type;
        // 判断 exerciseDetails[type] 存在且 requiresDistance 为 true 才累加距离
        if (
          this.exerciseDetails[type] &&
          this.exerciseDetails[type].requiresDistance
        ) {
          totalDistance += Number(item.distance);
          // 步数简单换算：1公里≈1300步
          totalSteps += Number(item.distance) * 1300;
        }
        totalCalories += Number(item.calories);
      });
      this.totalDistance = totalDistance.toFixed(1);
      this.totalCalories = totalCalories.toFixed(0);
      this.totalSteps = totalSteps.toFixed(0);
    },
    // 取消添加
    cancelAddRecord() {
      this.showAddRecord = false;
      this.resetForm();
    },
    // 确认添加
    confirmAddRecord() {
      // 校验
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
      const dateStr = this.getToday();
      const calories = Number(this.computedFormCalories);
      // 生成记录
      const record = {
        type: this.typeOptions[this.form.typeIndex],
        date: dateStr,
        duration: Number(this.form.duration),
        distance: this.requiresDistance ? Number(this.form.distance) : 0,
        calories
      };
      // 加入列表
      this.recordList.unshift(record);
      // 关闭弹窗 & 重置
      this.showAddRecord = false;
      this.resetForm();
      this.updateSummaryData();
    },
    // 重置表单
    resetForm() {
      this.form.typeIndex = 0;
      this.form.duration = '';
      this.form.distance = '';
    },
    // 获取今天日期
    getToday() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }
};
</script>

<style scoped lang="scss">
.sport-record-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
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
