<template>
  <view class="container">
    <!-- 顶部管理按钮 -->
    <view class="top-bar">
      <view class="title">运动数据分析</view>
      <view class="btn-manage" @click="toggleManagePanel">管理图表</view>
    </view>
    
    <!-- 管理面板：用于控制图表显示 -->
    <view v-if="showManagePanel" class="manage-panel">
      <view
        class="panel-item"
        v-for="(item, index) in chartsVisibility"
        :key="index"
        style="display: flex; align-items: center; justify-content: space-between; width: 100%;"
      >
        <text>{{ chartLabels[index] }}</text>
        <switch
          style="display: flex; justify-content: center;"
          :checked="chartsVisibility[index]"
          @tap="applySettings(index)"
        />
      </view>
      <button @click="toggleManagePanel">关闭</button>
    </view>
    
    <!-- 图表卡片：每个卡片包含标题 + scroll-view + canvas -->
    <view v-if="chartsVisibility.totalTime" class="card">
      <view class="card-header">总运动时间</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'totalTimeChart'"
          :style="`width: ${getCanvasWidth(totalTimeData.length)}px; height:200px; margin:0 auto;`"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.running" class="card">
      <view class="card-header">跑步趋势</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'runningChart'"
          :style="`width: ${getCanvasWidth(runningData.length)}px; height:200px; margin:0 auto`"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.walking" class="card">
      <view class="card-header">行走趋势</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'walkingChart'"
          :style="`width: ${getCanvasWidth(walkingData.length)}px; height:200px; margin:0 auto; `"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.cycling" class="card">
      <view class="card-header">骑行趋势</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'cyclingChart'"
          :style="`width: ${getCanvasWidth(cyclingData.length)}px; height:200px; margin:0 auto; `"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.yoga" class="card">
      <view class="card-header">瑜伽趋势</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'yogaChart'"
          :style="`width: ${getCanvasWidth(yogaData.length)}px; height:200px; margin:0 auto;`"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.stepCount" class="card">
      <view class="card-header">步数</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'stepCountChart'"
          :style="`width: ${getCanvasWidth(stepCountData.length)}px; height:200px; margin:0 auto; `"
        />
      </scroll-view>
    </view>

    <view v-if="chartsVisibility.calorie" class="card">
      <view class="card-header">卡路里</view>
      <scroll-view scroll-x style="width: 100%;">
        <canvas
          :canvas-id="'calorieChart'"
          :style="`width: ${getCanvasWidth(calorieData.length)}px; height:200px; margin:0 auto; `"
        />
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showManagePanel: false,
      // 管理面板展示文字
      chartLabels: {
        totalTime: '总运动时间柱状图',
        running: '跑步趋势图',
        walking: '行走趋势图',
        cycling: '骑行趋势图',
        yoga: '瑜伽趋势图',
        stepCount: '步数柱状图',
        calorie: '卡路里趋势图'
      },
      // 图表可见性
      chartsVisibility: {
        totalTime: true,
        running: true,
        walking: true,
        cycling: true,
        yoga: true,
        stepCount: true,
        calorie: true
      },
      // 示例数据
      totalTimeData: [
        { time: '2025-03-25', value: 30 },
        { time: '2025-03-26', value: 45 },
        { time: '2025-03-27', value: 60 },
        { time: '2025-03-28', value: 90 },
        { time: '2025-03-29', value: 120 }
      ],
      runningData: [
        { time: '2024-03-25', value: 5 },
        { time: '2025-03-26', value: 6 },
        { time: '2025-03-27', value: 7 },
        { time: '2025-03-28', value: 8 },
        { time: '2025-03-29', value: 9 }
      ],
      walkingData: [], // 无数据
      cyclingData: [
        { time: '2025-03-25', value: 10 },
        { time: '2025-03-26', value: 20 },
        { time: '2025-03-27', value: 15 },
        { time: '2025-03-28', value: 25 },
        { time: '2025-03-29', value: 30 }
      ],
      yogaData: [],  // 无数据
      stepCountData: [
        { time: '2024-03-25', value: 1000 },
        { time: '2025-03-26', value: 1500 },
        { time: '2025-03-27', value: 2000 },
        { time: '2025-03-28', value: 2500 },
        { time: '2025-03-29', value: 3000 }
      ],
      calorieData: [
        { time: '2025-02-25', value: 200 },
        { time: '2025-03-26', value: 220 },
        { time: '2025-03-27', value: 250 },
        { time: '2025-03-28', value: 270 },
        { time: '2025-03-29', value: 300 }
      ]
    }
  },
  methods: {
    // 切换管理面板
    toggleManagePanel() {
      this.showManagePanel = !this.showManagePanel;
    },
    // 切换图表可见性后重绘
    applySettings(key) {
      this.chartsVisibility[key] = !this.chartsVisibility[key];
      // 等视图更新后再重绘，否则可能找不到对应的 canvas
      this.$nextTick(() => {
        this.initCharts();
      });
    },

    // 根据数据条数动态计算 Canvas 宽度
    getCanvasWidth(length) {
      // 例如：每个数据点占 60 像素；最小 300 像素
      const w = length * 60;
      return w < 300 ? 300 : w;
    },

    // 初始化所有图表
    initCharts() {
      this.drawBarChart('totalTimeChart', this.totalTimeData);
      this.drawLineChart('runningChart', this.runningData);
      this.drawLineChart('walkingChart', this.walkingData);
      this.drawLineChart('cyclingChart', this.cyclingData);
      this.drawLineChart('yogaChart', this.yogaData);
      this.drawBarChart('stepCountChart', this.stepCountData);
      this.drawLineChart('calorieChart', this.calorieData);
    },

    // 绘制柱状图 + 文字旋转
    drawBarChart(canvasId, data) {
      const ctx = uni.createCanvasContext(canvasId, this);
      // 注意：和样式对应的宽高最好一致，或根据实际宽度计算
      let canvasWidth = 300;
      let canvasHeight = 200;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!data || data.length === 0) {
        ctx.setFontSize(16);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('center');
        ctx.fillText('暂无数据', canvasWidth / 2, canvasHeight / 2);
        ctx.draw();
        return;
      }

      // 为了给旋转文字留空间，marginBottom 设大一点
      const marginTop = 20, marginBottom = 50, marginLeft = 25, marginRight = 55;
      const effectiveWidth = canvasWidth - marginLeft - marginRight;
      const chartHeight = canvasHeight - marginTop - marginBottom;
      const maxVal = Math.max(...data.map(item => item.value));

      // 每个柱子宽度
      const itemWidth = effectiveWidth / data.length;
      const barWidth = itemWidth * 0.6;

      // 背景网格线
      ctx.setStrokeStyle('#eee');
      ctx.setLineWidth(1);
      for (let i = 0; i <= 4; i++) {
        const y = marginTop + (chartHeight * i) / 4;
        ctx.beginPath();
        ctx.moveTo(marginLeft, y);
        ctx.lineTo(canvasWidth - marginRight, y);
        ctx.stroke();
      }

      // 也可以做跳点绘制，防止标签过密
      const desiredLabelCount = 6;
      const skipCount = Math.ceil(data.length / desiredLabelCount);

      data.forEach((item, index) => {
        const value = item.value;
        const barHeight = (value / maxVal) * chartHeight;
        const x = marginLeft + index * itemWidth + (itemWidth - barWidth) / 2;
        const y = canvasHeight - marginBottom - barHeight;

        // 绘制柱形
        ctx.setFillStyle('#007AFF');
        ctx.fillRect(x, y, barWidth, barHeight);

        // 显示数值（在柱子上方）
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('center');
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);

        // 绘制横坐标标签（旋转 -45°）
        if (index % skipCount === 0 || index === data.length - 1) {
          ctx.setFontSize(10);
          ctx.setFillStyle('#333');
          // 因为要旋转，所以先保存状态
          ctx.save();
          // 将原点移动到标签要绘制的位置（柱子中点 + 底部留白一点）
          ctx.translate(x + barWidth / 2, canvasHeight - 5);
          // 逆时针旋转 45 度（单位：弧度）
          ctx.rotate(-45 * Math.PI / 180);
          // 设置对齐基线，让文字从坐标点开始往右下方延伸
          ctx.setTextAlign('left');
          ctx.setTextBaseline('middle');
          ctx.fillText(item.time, 0, 0);
          // 恢复状态
          ctx.restore();
        }
      });

      ctx.draw();
    },

    // 绘制折线图 + 文字旋转
    drawLineChart(canvasId, data) {
      const ctx = uni.createCanvasContext(canvasId, this);
      let canvasWidth = 300;
      let canvasHeight = 200;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!data || data.length === 0) {
        ctx.setFontSize(16);
        ctx.setFillStyle('#666');
        ctx.setTextAlign('center');
        ctx.fillText('暂无数据', canvasWidth / 2, canvasHeight / 2);
        ctx.draw();
        return;
      }

      // 同样给文字留空间
      const marginTop = 20, marginBottom = 50, marginLeft = 25, marginRight = 55;
      const effectiveWidth = canvasWidth - marginLeft - marginRight;
      const chartHeight = canvasHeight - marginTop - marginBottom;
      const maxVal = Math.max(...data.map(item => item.value));
      const step = data.length > 1 ? effectiveWidth / (data.length - 1) : 0;

      // 背景网格线
      ctx.setStrokeStyle('#eee');
      ctx.setLineWidth(1);
      for (let i = 0; i <= 4; i++) {
        const y = marginTop + (chartHeight * i) / 4;
        ctx.beginPath();
        ctx.moveTo(marginLeft, y);
        ctx.lineTo(canvasWidth - marginRight, y);
        ctx.stroke();
      }

      // 绘制折线
      ctx.beginPath();
      data.forEach((item, index) => {
        const x = marginLeft + index * step;
        const y = marginTop + (1 - item.value / maxVal) * chartHeight;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.setStrokeStyle('#FF9500');
      ctx.setLineWidth(2);
      ctx.stroke();

      // 跳点绘制标签
      const desiredLabelCount = 6;
      const skipCount = Math.ceil(data.length / desiredLabelCount);

      // 绘制数据点、数值、横坐标
      data.forEach((item, index) => {
        const x = marginLeft + index * step;
        const y = marginTop + (1 - item.value / maxVal) * chartHeight;
        // 数据点
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.setFillStyle('#FF9500');
        ctx.fill();

        // 显示数值
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.setTextAlign('center');
        ctx.fillText(item.value.toString(), x, y - 8);

        // 横坐标标签（旋转）
        if (index % skipCount === 0 || index === data.length - 1) {
          ctx.save();
          ctx.translate(x, canvasHeight - 5);
          ctx.rotate(-45 * Math.PI / 180);
          ctx.setTextAlign('left');
          ctx.setTextBaseline('middle');
          ctx.setFillStyle('#333');
          ctx.fillText(item.time, 0, 0);
          ctx.restore();
        }
      });

      ctx.draw();
    }
  },
  mounted() {
    // 组件加载后初始化图表
    this.initCharts();
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.btn-manage {
  background-color: #007aff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}
.manage-panel {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.panel-item {
  margin: 5px 0;
}
/* 卡片样式 */
.card {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  padding: 10px;
}
.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}
/* 让 scroll-view 横向滚动时不被截断 */
scroll-view {
  white-space: nowrap;
  overflow: scroll;
}
</style>
