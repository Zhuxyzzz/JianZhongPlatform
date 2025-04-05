<template>
  <view class="exercise-container">
    <!-- 1. 运动项目信息 -->
    <view class="exercise-header">
      <image :src="exercise.img" class="exercise-image" mode="aspectFill" />
      <text class="exercise-title">{{ exercise.name }}</text>
      <text class="exercise-desc">{{ exercise.desc }}</text>
    </view>

    <!-- 2. 多段运动展示 -->
    <view class="segments-section">
      <text class="section-title">分段列表</text>
      <!-- v-for 展示每一个段落 -->
      <view 
        class="segment-item" 
        v-for="(seg, idx) in segments" 
        :key="idx"
      >
        <view class="segment-header">
          <text>第 {{ idx + 1 }} 段：{{ seg.name }}</text>
          <!-- 显示剩余时间 mm:ss -->
          <text>剩余: {{ formatTime(seg.remainingSeconds) }}</text>
        </view>

        <!-- 按钮组：根据不同状态呈现不同按钮 -->
        <view class="segment-controls">
          <!-- 如果已完成，则显示“已完成” -->
          <text v-if="seg.isCompleted" class="segment-completed">
            已完成
          </text>
          <!-- 否则，根据 isRunning / isPaused 显示不同按钮 -->
          <view v-else>
            <!-- “开始”按钮：仅当上一段已完成、本段未开始时可用 -->
            <button 
              v-if="!seg.isRunning && !seg.isPaused" 
              :disabled="!canStartSegment(idx)" 
              @tap="startSegment(idx)"
            >
              开始
            </button>
            <!-- “暂停”按钮：当段正在运行时显示 -->
            <button 
              v-if="seg.isRunning" 
              @tap="pauseSegment(idx)"
            >
              暂停
            </button>
            <!-- “继续”按钮：当段已暂停时显示 -->
            <button 
              v-if="seg.isPaused" 
              @tap="resumeSegment(idx)"
            >
              继续
            </button>
            <!-- “结束”按钮：可随时手动结束当前段 -->
            <button 
              v-if="seg.isRunning || seg.isPaused" 
              @tap="stopSegment(idx, '手动结束')"
            >
              结束
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 3. 总运动信息(仅作展示，可保留原先逻辑) -->
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
      <view 
        v-for="(record, index) in records" 
        :key="record.id" 
        class="record-item"
      >
        <text>
          {{ record.timestamp }} - {{ record.segName }} - 耗时: {{ record.usedSeconds }} 秒 - {{ record.reason }}
        </text>
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
        duration: 0,  // 总时长（分钟），仅作展示
        calories: 0,
        img: ''
      },
      // 多段解析后的数组
      segments: [
        // {
        //   name: "热身",
        //   totalSeconds: 300,
        //   remainingSeconds: 300,
        //   isRunning: false,
        //   isPaused: false,
        //   isCompleted: false,
        //   timer: null
        // }
      ],
      // 记录列表
      records: []
    }
  },
  onLoad(options) {
    // 1. 获取URL参数
    this.exercise.name = options.name || '运动项目';
    this.exercise.desc = options.desc || '运动描述';
    this.exercise.duration = parseInt(options.duration) || 0;
    this.exercise.calories = parseInt(options.calories) || 0;
    this.exercise.img = decodeURIComponent(options.img) || '';

    // 2. 解析 desc -> segments
    // 示例: "5分钟热身 + 15分钟快走 + 10分钟拉伸 = 30分钟"
    this.segments = this.parseSegments(this.exercise.desc);
  },
  methods: {
    // A. 解析desc，生成 segments 数组
    parseSegments(descText) {
      // 先去掉 "= xx分钟"部分(若有)
      let mainPart = descText.split('=')[0].trim(); 
      // e.g. "5分钟热身 + 15分钟快走 + 10分钟拉伸"

      // 再按 "+" 分割
      let partArr = mainPart.split('+').map(p => p.trim());
      // ["5分钟热身", "15分钟快走", "10分钟拉伸"]

      let result = [];
      partArr.forEach(item => {
        // 匹配: 数字 + "分钟" + 剩下的文本
        let match = item.match(/(\d+)分钟(.*)/);
        if (match) {
          let minVal = parseInt(match[1]);        // 5, 15, 10
          let segName = match[2].trim();          // '热身', '快走', '拉伸'
          let totalSec = minVal * 60;
          result.push({
            name: segName || '运动',
            totalSeconds: totalSec,
            remainingSeconds: totalSec,
            isRunning: false,
            isPaused: false,
            isCompleted: false,
            timer: null
          });
        }
      });

      return result;
    },

    // B. 辅助: 格式化秒数 => "MM:SS"
    formatTime(sec) {
      let m = Math.floor(sec / 60);
      let s = sec % 60;
      return `${m}:${s < 10 ? '0' + s : s}`;
    },

    // C. 判断是否可以开始某段
    //   - 如果是第1段(index=0)，可以直接开始
    //   - 如果是后续段，则必须上一个段 isCompleted=true
    canStartSegment(index) {
      if (index === 0) return true; 
      // 只有当前一段完成了，才可开始本段
      return this.segments[index - 1].isCompleted;
    },

    // D. 开始某一段
    startSegment(index) {
      let seg = this.segments[index];
      // 若已完成就不重复开始
      if (seg.isCompleted) return;

      // 若还有剩余时间则启动计时器
      seg.isRunning = true;
      seg.isPaused = false;
      seg.timer = setInterval(() => {
        if (seg.remainingSeconds > 0) {
          seg.remainingSeconds--;
        } else {
          // 到0 => 结束该段
          this.stopSegment(index, '自动完成');
        }
      }, 1000);
    },

    // E. 暂停某段
    pauseSegment(index) {
      let seg = this.segments[index];
      if (seg.isRunning) {
        // 停止计时器
        clearInterval(seg.timer);
        seg.timer = null;
        seg.isRunning = false;
        seg.isPaused = true;
      }
    },

    // F. 继续某段
    resumeSegment(index) {
      let seg = this.segments[index];
      if (seg.isPaused && !seg.isCompleted) {
        seg.isRunning = true;
        seg.isPaused = false;
        seg.timer = setInterval(() => {
          if (seg.remainingSeconds > 0) {
            seg.remainingSeconds--;
          } else {
            this.stopSegment(index, '自动完成');
          }
        }, 1000);
      }
    },

    // G. 结束(或完成)某段
    stopSegment(index, reason = '结束') {
      let seg = this.segments[index];
      // 先清除计时器
      if (seg.timer) {
        clearInterval(seg.timer);
        seg.timer = null;
      }

      // 计算耗时
      const usedSec = seg.totalSeconds - seg.remainingSeconds;

      // 标记完成
      seg.isRunning = false;
      seg.isPaused = false;
      seg.isCompleted = true;
      seg.remainingSeconds = 0;

      // 记录到 records
      this.addRecord(seg.name, usedSec, reason);

      // 提示
      uni.showToast({ 
        title: `第${index+1}段「${seg.name}」${reason}`, 
        icon: 'none' 
      });
    },

    // H. 给 records 添加一条记录
    addRecord(segName, usedSeconds, reason) {
      let record = {
        id: new Date().getTime(),
        segName: segName,
        usedSeconds: usedSeconds,
        reason: reason,
        timestamp: new Date().toLocaleString()
      };
      this.records.push(record);
    },

    // I. 删除记录
    deleteRecord(idx) {
      this.records.splice(idx, 1);
      uni.showToast({ title: '记录已删除', icon: 'none' });
    }
  },

  // J. 页面卸载前，清除所有计时器
  onUnload() {
    this.segments.forEach(seg => {
      if (seg.timer) {
        clearInterval(seg.timer);
      }
    });
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

/* 分段列表 */
.segments-section {
  background-color: #fff;
  padding: 10rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.segment-item {
  border-bottom: 1rpx solid #f0f0f0;
  padding: 10rpx 0;
}
.segment-item:last-child {
  border-bottom: none;
}
.segment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rpx;
}
.segment-controls {
  display: flex;
  flex-direction: row;
  gap: 10rpx;
}
.segment-completed {
  color: green;
}

/* 运动信息 */
.exercise-info {
  display: flex;
  justify-content: space-around;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

/* 运动记录 */
.record-section {
  background-color: #fff;
  padding: 10rpx;
  border-radius: 8rpx;
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
