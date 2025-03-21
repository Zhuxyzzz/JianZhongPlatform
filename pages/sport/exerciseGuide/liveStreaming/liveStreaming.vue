<template>
  <view class="live-detail-container">
    <view class="header">
      <icon class="back-icon" type="back" @tap="goBack" />
      <text class="header-title">{{ liveDetail.title }}</text>
      <icon class="share-icon" type="share" @tap="shareLive" />
    </view>
    <view class="video-area">
      <video
        class="live-video"
        :src="liveDetail.videoUrl"
        controls
        autoplay
        objectFit="cover"
      />
      <view class="video-overlay">
        <view class="live-status">LIVE</view>
        <view class="viewer-count">
          <icon type="eye" size="24" color="#fff" />
          <text>{{ liveDetail.viewerCount }}</text>
        </view>
      </view>
    </view>
    <view class="live-info">
      <text class="live-description">{{ liveDetail.description }}</text>
      <view class="teacher-info">
        <image class="teacher-avatar" :src="liveDetail.teacherAvatar" mode="aspectFill" />
        <text class="teacher-name">{{ liveDetail.teacherName }}</text>
      </view>
      <view class="schedule">
        <text class="schedule-title" style="color: aqua;">直播时间：</text>
        <text class="schedule-time">{{ liveDetail.schedule }}</text>
      </view>
      <view class="action-buttons">
        <icon class="action-icon" type="heart" @tap="toggleLike" :color="liked ? '#ff7b54' : '#ccc'" />
        <icon class="action-icon" type="star" @tap="toggleFavorite" :color="favorited ? '#ff7b54' : '#ccc'" />
        <icon class="action-icon" type="share" @tap="shareLive" />
      </view>
    </view>
    <view class="chat-section">
      <scroll-view class="chat-messages" scroll-y :scroll-top="chatScrollTop">
        <block v-for="(msg, index) in chatMessages" :key="index">
          <view class="chat-message">
            <image class="chat-avatar" :src="msg.avatar" mode="aspectFill" />
            <view class="chat-content">
              <text class="chat-user">{{ msg.user }}</text>
              <text class="chat-text">{{ msg.text }}</text>
            </view>
          </view>
        </block>
      </scroll-view>
      <view class="chat-input-container">
        <input
          class="chat-input"
          v-model="newChatMessage"
          placeholder="输入聊天内容..."
          @confirm="sendChat"
        />
        <button class="send-button" @tap="sendChat">发送</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      liveDetail: {
        id: null,
        title: '',
        description: '',
        videoUrl: '',
        viewerCount: 0,
        teacherName: '',
        teacherAvatar: '',
        schedule: ''
      },
      chatMessages: [
        {
          user: 'Alice',
          avatar: '/static/images/avatar1.png',
          text: '欢迎直播，期待学习！'
        },
        {
          user: 'Bob',
          avatar: '/static/images/avatar2.png',
          text: '直播内容很棒！'
        }
      ],
      newChatMessage: '',
      chatScrollTop: 9999,
      liked: false,
      favorited: false
    }
  },
  onLoad(options) {
    // 确保通过页面参数获取到直播间 id
    const id = options.id;
    console.log('直播间详情页获取到的 id:', id);
    this.fetchLiveDetail(id);
  },
  methods: {
    fetchLiveDetail(id) {
      // 模拟数据，根据 id 选择不同的详情
      const details = {
        1: {
          id: 1,
          title: '瑜伽直播课堂',
          description: '专业瑜伽教练在线讲解瑜伽基础知识与动作要领，帮助你在家轻松练习瑜伽。',
          videoUrl: 'https://example.com/live1.m3u8',
          viewerCount: 2048,
          teacherName: '张老师',
          teacherAvatar: '/static/images/teacher1.jpg',
          schedule: '2025-04-20 18:00 - 19:00'
        },
        2: {
          id: 2,
          title: 'HIIT燃脂训练',
          description: '高强度间歇训练直播课程，快速燃脂，提升心肺功能，适合忙碌的上班族。',
          videoUrl: 'https://example.com/live2.m3u8',
          viewerCount: 1800,
          teacherName: '李教练',
          teacherAvatar: '/static/images/teacher2.jpg',
          schedule: '2025-04-21 19:00 - 19:30'
        },
        3: {
          id: 3,
          title: '舞蹈健身直播',
          description: '动感舞蹈直播课堂，带你燃烧卡路里，释放压力。',
          videoUrl: 'https://example.com/live3.m3u8',
          viewerCount: 1500,
          teacherName: '王教练',
          teacherAvatar: '/static/images/teacher3.jpg',
          schedule: '2025-04-22 18:30 - 19:30'
        },
        4: {
          id: 4,
          title: '普拉提塑形',
          description: '通过普拉提训练改善体态，提升核心力量，让你拥有更好的体态。',
          videoUrl: 'https://example.com/live4.m3u8',
          viewerCount: 1200,
          teacherName: '赵老师',
          teacherAvatar: '/static/images/teacher4.jpg',
          schedule: '2025-04-23 19:00 - 20:00'
        }
      };
      // 根据 id 获取数据，如果不存在则默认使用 id=1 的数据
      this.liveDetail = details[id] || details[1];
    },
    goBack() {
      uni.navigateBack();
    },
    shareLive() {
      uni.showToast({
        title: '分享功能暂未实现',
        icon: 'none'
      });
    },
    toggleLike() {
      this.liked = !this.liked;
    },
    toggleFavorite() {
      this.favorited = !this.favorited;
    },
    sendChat() {
      if (this.newChatMessage.trim() === '') return;
      const message = {
        user: '我',
        avatar: '/static/images/my-avatar.png',
        text: this.newChatMessage.trim()
      };
      this.chatMessages.push(message);
      this.newChatMessage = '';
      this.$nextTick(() => {
        this.chatScrollTop = 9999;
      });
    }
  }
}
</script>

<style scoped lang="scss">
.live-detail-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  background-color: #ff7b54;
  padding: 20rpx;
}
.back-icon, .share-icon {
  font-size: 32rpx;
  color: #fff;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.video-area {
  position: relative;
  width: 100%;
  height: 300rpx;
  background-color: #000;
}
.live-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-overlay {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  display: flex;
  align-items: center;
}
.live-status {
  background-color: red;
  color: #fff;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  margin-right: 10rpx;
}
.viewer-count {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;
}

.live-info {
  background-color: #fff;
  padding: 20rpx;
  margin: 10rpx 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}
.live-description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}
.teacher-info {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.teacher-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}
.teacher-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}
.schedule {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.schedule-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-right: 10rpx;
}
.schedule-time {
  font-size: 28rpx;
  color: #666;
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

.chat-section {
  flex: 1;
  background-color: #fff;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  border-top: 1rpx solid #ddd;
}
.chat-messages {
  flex: 1;
  margin-bottom: 10rpx;
}
.chat-message {
  display: flex;
  flex-direction: row;
  margin-bottom: 10rpx;
}
.chat-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}
.chat-content {
  background-color: #f0f0f0;
  border-radius: 8rpx;
  padding: 10rpx;
  flex: 1;
}
.chat-user {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 4rpx;
}
.chat-text {
  font-size: 26rpx;
  color: #666;
}
.chat-input-container {
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ddd;
  padding: 10rpx;
}
.chat-input {
  flex: 1;
  font-size: 26rpx;
  padding: 10rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-right: 10rpx;
}
.send-button {
  font-size: 28rpx;
  color: #fff;
  background-color: #ff7b54;
  border: none;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}
</style>
