<template>
  <view class="exercise-detail-container">
    <!-- Header：返回按钮与标题 -->
    <view class="header">
      <icon class="back-icon" type="back" @tap="goBack" />
      <text class="header-title">{{ exercise.title }}</text>
    </view>
    
    <!-- 主内容区 -->
    <scroll-view class="content" scroll-y>
      <!-- 媒体展示区 -->
      <view class="media-container">
        <video
          v-if="exercise.videoUrl"
          class="detail-video"
          :src="exercise.videoUrl"
          controls
          objectFit="cover"
        />
        <image
          v-else
          class="detail-image"
          :src="exercise.thumbnail"
          mode="aspectFill"
        />
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <icon class="action-icon" type="heart" @tap="toggleLike" :color="liked ? '#ff7b54' : '#ccc'" />
        <icon class="action-icon" type="star" @tap="toggleFavorite" :color="favorited ? '#ff7b54' : '#ccc'" />
        <icon class="action-icon" type="share" @tap="shareExercise" />
      </view>

      <!-- 详细描述 -->
      <view class="detail-info">
        <text class="detail-description">{{ exercise.description }}</text>
      </view>
      
      <!-- 步骤说明 -->
      <view class="steps-section" v-if="exercise.steps && exercise.steps.length">
        <text class="section-heading">步骤说明</text>
        <block v-for="(step, index) in exercise.steps" :key="index">
          <view class="step-item">
            <text class="step-number">{{ index + 1 }}.</text>
            <text class="step-text">{{ step }}</text>
          </view>
        </block>
      </view>
      
      <!-- 注意事项 -->
      <view class="tips-section" v-if="exercise.tips && exercise.tips.length">
        <text class="section-heading">注意事项</text>
        <block v-for="(tip, index) in exercise.tips" :key="index">
          <view class="tip-item">
            <text class="tip-text">{{ tip }}</text>
          </view>
        </block>
      </view>
      
      <!-- 用户评价 -->
      <view class="comments-section">
        <text class="section-heading">用户评价</text>
        <block v-for="(comment, index) in comments" :key="index">
          <view class="comment-item">
            <view class="comment-header">
              <image class="comment-avatar" :src="comment.avatar" mode="aspectFill" />
              <text class="comment-user">{{ comment.user }}</text>
            </view>
            <text class="comment-content">{{ comment.content }}</text>
          </view>
        </block>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 运动教程详情数据
      exercise: {
        id: null,
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        tags: [],
        steps: [],
        tips: []
      },
      // 用户评价示例
      comments: [
        {
          user: '张三',
          avatar: '/static/images/avatar1.png',
          content: '非常实用的教程，讲解清楚，动作要领到位！'
        },
        {
          user: '李四',
          avatar: '/static/images/avatar2.png',
          content: '看完这个教程感觉自己的柔韧性有提升，推荐给初学者。'
        }
      ],
      liked: false,
      favorited: false
    }
  },
  onLoad(options) {
    // 从页面参数中获取教程 id，实际项目中可以通过 options.id 获取
    const id = options.id;
    this.fetchExerciseDetail(id);
  },
  methods: {
    // 模拟获取运动教程详情数据，实际项目中可替换为接口请求
    fetchExerciseDetail(id) {
      const details = {
        1: {
          id: 1,
          title: '全身热身操',
          description: '本教程详细讲解了全身热身操的动作要领和注意事项，帮助你预防运动损伤，充分激活全身肌肉。',
          thumbnail: '../../../../static/sports/images/exerciseGuide/warmUp.jpg',
          videoUrl: '',
          tags: ['初级', '热身'],
          steps: [
            '开始前请先做简单的拉伸。',
            '进行5分钟的慢跑作为预热。',
            '按照动作示范进行开合跳和深蹲，每个动作做15次。',
            '最后进行全身拉伸，放松肌肉。'
          ],
          tips: [
            '注意动作标准，避免用力过猛。',
            '根据自身情况调整训练强度。',
            '运动过程中保持均匀呼吸。'
          ]
        },
        2: {
          id: 2,
          title: 'HIIT高强度间歇训练',
          description: '通过高强度间歇训练快速燃脂，适合时间有限的人群，帮助提升心肺功能。',
          thumbnail: '/static/images/exercise2.jpg',
          videoUrl: '../../../../static/sports/images/exerciseGuide/HIIT.mp4',
          tags: ['高强度', '燃脂'],
          steps: [
            '热身5分钟：慢跑或跳绳。',
            '高强度冲刺30秒，休息30秒，重复8次。',
            '放松拉伸5分钟。'
          ],
          tips: [
            '确保场地安全，避免拥挤。',
            '初次尝试请咨询专业教练。'
          ]
        }
      };
      // 简单根据 id 获取数据，若未匹配则使用 id=1 的数据
      this.exercise = details[id] || details[1];
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    // 点赞功能
    toggleLike() {
      this.liked = !this.liked;
    },
    // 收藏功能
    toggleFavorite() {
      this.favorited = !this.favorited;
    },
    // 分享功能
    shareExercise() {
      // 分享功能实现，此处仅弹出提示
      uni.showToast({
        title: '分享功能暂未实现',
        icon: 'none'
      });
    }
  }
}
</script>

<style scoped lang="scss">
.exercise-detail-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
}

.header {
  background-color: #ff7b54;
  padding: 20rpx;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 32rpx;
  color: #fff;
  margin-right: 20rpx;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20rpx;
}

.media-container {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.detail-video,
.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 20rpx;
}

.action-icon {
  font-size: 36rpx;
  margin-left: 20rpx;
}

.detail-info {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

.detail-description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.steps-section, .tips-section, .comments-section {
  margin-top: 20rpx;
}

.section-heading {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.step-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 10rpx;
}

.step-number {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff7b54;
  margin-right: 10rpx;
}

.step-text {
  font-size: 28rpx;
  color: #666;
}

.tip-item {
  margin-bottom: 10rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #666;
}

.comments-section {
  margin-top: 30rpx;
}

.comment-item {
  border-top: 1rpx solid #ddd;
  padding-top: 10rpx;
  margin-top: 10rpx;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.comment-user {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.comment-content {
  font-size: 26rpx;
  color: #666;
}
</style>
