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

    <!-- 3.1 显示大模型返回的 planSummary -->
    <view v-if="planSummary" class="plan-summary-section">
      <text class="plan-summary-text">{{ planSummary }}</text>
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
        <image 
          :src="selectedDayPlan.plan.img || '../../../static/sports/images/planPersonalization/default.jpg'"
          class="plan-item-image" 
          mode="aspectFill" 
        />
        <view class="plan-item-info">
          <text class="plan-item-title">{{ selectedDayPlan.plan.name }}</text></br>
          <text class="plan-item-desc">{{ selectedDayPlan.plan.desc }}</text>
          <view class="plan-item-meta">
            <text>时长: {{ selectedDayPlan.plan.duration }} 分钟</text>
            <text>消耗: {{ selectedDayPlan.plan.calories }} kcal</text>
          </view>
        </view>
        <view class="plan-item-actions">
          <!-- 若未完成则显示开始按钮，否则显示已完成 -->
          <button 
            v-if="!selectedDayPlan.plan.completed" 
            size="mini" 
            type="primary" 
            @tap="startExercise(selectedDayPlan)"
          >
            开始
          </button>
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
      <text class="note-text">
        提示：请根据自身身体状况与医生建议选择合适的运动强度。若感到不适，请立即停止并寻求医生帮助。
      </text>
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
      dailyPlanList: [],      // 每天的训练计划列表
      selectedDate: '',       // 当前选中的日期，格式 YYYY-MM-DD
      planSummary: ''         // 大模型返回的训练概览
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
    // 格式化日期为 YYYY-MM-DD
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    // 将 "YYYY-MM-DD" 格式转为 "YYYY年MM月DD日"
    formatCalendarDate(dateStr) {
      const parts = dateStr.split('-');
      return `${parts[0]}年${parts[1]}月${parts[2]}日`;
    },

    // 核心: 调用大模型接口并生成/更新训练计划
    async generatePlan() {
      if (!this.selectedIntensity) {
        uni.showToast({ title: '请先选择运动强度', icon: 'none' });
        return;
      }
	   // 在发起请求前，显示加载提示
	        uni.showLoading({
	          title: '正在生成，请稍候...'
	        });

      // 1) 构造“今天”的日期作为起始
      const startDateObj = new Date();
      const startDateStr = this.formatDate(startDateObj);

      // 2) 需要的变量(你可改由 userInfo 等取得)
      const period = 1;        // 这次示例：10 天
      const weightToLose = 10;  // 要减10斤
      const selectedIntensity = this.selectedIntensity; // 'light' / 'medium' / 'high'

      // 3) 准备 systemMessage + userMessage，保证替换完成

      // 使用字符串插值替换那些 \${period} / \${weightToLose} / \${startDate} / \${selectedIntensity}
      // 让大模型拿到的Prompt就已经带着具体数值
      const userMessage = `
	  你是一个AI锻炼助手，旨在帮助和指导创建健身/减脂训练计划，并协助寻找适合身体每个肌肉群的锻炼。你拥有私人教练和身体物理学的教育背景，你的角色是增强用户的锻炼效果。
	  
	  你的能力包括：
	  个性化锻炼计划：创建定制的锻炼计划，以满足个人的健身目标、水平和偏好。
	  肌肉群目标：协助寻找和推荐适合身体特定肌肉群的锻炼。
	  运动建议：为每个肌肉群提供多种锻炼，包括变体，以保持锻炼的趣味性和有效性。
	  姿势和技巧指导：提供正确姿势和技巧建议，以确保安全有效地进行锻炼。
	  进度跟踪：帮助用户跟踪他们的进展，包括重量、重复次数、组数和健身水平改善。
	  激励与鼓励：提供激励技巧和鼓励，帮助用户坚持他们的健身目标。
	  营养建议：提供一般的营养建议，以补充锻炼计划，增强整体健身和健康。
	  休息和恢复指导：提供关于适当休息和恢复技术的建议，以避免过度训练并提高表现。
我现在想在 ${period} 天内减掉 ${weightToLose} 斤体重，当前用户选择的训练强度是 "${selectedIntensity}"。
今天的日期是 ${startDateStr}，这是第1天，后面依次加1天直到第 ${period} 天。

请严格按照以下 JSON 结构返回，不要包含代码块或额外文字：

{
  "planSummary": "在这里概括本次 ${period} 天减掉 ${weightToLose} 斤，并采用 ${selectedIntensity} 强度的核心思路，可含简要饮食建议等",
  "dailyPlans": [
    {
      "dayIndex": 1,
      "date": "${startDateStr}",
      "planName": "建议的训练名称，例如 '轻度有氧跑'",
      "planDescription": "以 子项目时长相加=总计 的格式描述，如 '5分钟热身 + 15分钟慢跑 + 10分钟拉伸 = 30分钟'",
      "duration": 30,
      "calories": 200
    },
    {
      "dayIndex": 2,
      "date": "${startDateStr}+1天",
      "planName": "...",
      "planDescription": "...",
      "duration": 25,
      "calories": 180
    }
    // 一直到 dayIndex = ${period}
  ]
}

若无法满足此JSON格式，请返回空JSON {}。
`.trim();


      // 4) 设置fetch的请求参数
      const options = {
        method: 'POST',
        headers: {
          // TODO: 替换成你的真实token
          Authorization: 'Bearer sk-tsavetzpzgrhbnuerzsnbbydpsrhyoryvttbhkoqaujzavli',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "Pro/deepseek-ai/DeepSeek-V3",
          messages: [
            { role: "user", content: userMessage }
          ],
          stream: false,
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          frequency_penalty: 0.5,
          n: 1,
          response_format: { type: "text" },
          tools: [
            {
              type: "function",
              function: {
                description: "<string>",
                name: "<string>",
                parameters: {},
                strict: false
              }
            }
          ]
        })
      };

      let responseData = null;
      try {
        // 5) 发起请求
        const res = await fetch("https://api.siliconflow.cn/v1/chat/completions", options);
        const jsonRes = await res.json();
		console.log(jsonRes)

        // 可能大模型的JSON在 jsonRes.choices[0].message.content
        if (!jsonRes.choices || !jsonRes.choices[0] || !jsonRes.choices[0].message) {
          throw new Error("大模型未返回有效信息");
        }
        responseData = jsonRes.choices[0].message.content;
      } catch (err) {
        console.error("接口请求或返回出错：", err);
        uni.showToast({ title: '请求或返回失败', icon: 'none' });
        return;
      }

      // 6) 清理掉三引号 ```json 等，防止 JSON.parse 失败
      // 有些模型会加 ```json ... ```
      const cleanedResponse = responseData
        .replace(/```json/g, "")  // 去掉 ```json
        .replace(/```/g, "")      // 去掉 ```
        .trim();

      // 7) 尝试解析
      let planObj = {};
      try {
        planObj = JSON.parse(cleanedResponse);
      } catch (e) {
        console.error("JSON parse error:", e, "原始字符串 =", cleanedResponse);
        uni.showToast({ title: '解析计划失败', icon: 'none' });
        return;
      }

      // 容错：如果大模型输出 {}
      if (!planObj.dailyPlans || !Array.isArray(planObj.dailyPlans)) {
        uni.showToast({ title: '返回的计划数据不符合预期', icon: 'none' });
        return;
      }

      // 8) 映射到前端的 data
      // - planSummary
      this.planSummary = planObj.planSummary || '';
      // - dailyPlans
      this.dailyPlanList = planObj.dailyPlans.map(item => {
        return {
          date: item.date,
          plan: {
            name: item.planName,
            desc: item.planDescription,
            duration: item.duration,
            calories: item.calories,
            completed: false
          }
        }
      });

      // 默认选中第1天
      if (this.dailyPlanList.length > 0) {
        this.selectedDate = this.dailyPlanList[0].date;
      }

      uni.showToast({
        title: '已生成训练计划',
        icon: 'none'
      });
    },

    // 点击日历选择日期
    selectDate(date) {
      this.selectedDate = date;
    },
    // 判断某一天的训练是否完成
    isDayCompleted(day) {
      return day.plan.completed;
    },
    // 标记当前选中日的训练为完成
    markCompleted() {
      const day = this.dailyPlanList.find(item => item.date === this.selectedDate);
      if (day) {
        day.plan.completed = true;
        uni.showToast({ title: '该日训练已完成', icon: 'none' });
      }
    },
    // 跳转到运动页面
    startExercise(dayPlan) {
      const url = `/pages/sport/planPersonalized/exercise?date=${dayPlan.date}&name=${encodeURIComponent(dayPlan.plan.name)}&desc=${encodeURIComponent(dayPlan.plan.desc)}&duration=${dayPlan.plan.duration}&calories=${dayPlan.plan.calories}&img=${encodeURIComponent(dayPlan.plan.img)}`;
        uni.navigateTo({
          url
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

/* planSummary显示 */
.plan-summary-section {
  margin: 10rpx 0;
  padding: 10rpx;
  background-color: #fff;
  border-radius: 8rpx;
}
.plan-summary-text {
  font-size: 24rpx;
  color: #333;
  line-height: 1.5;
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
