<template>
  <view class="live-room-list-container">
    <view class="header">
      <icon class="back-icon" type="back" @tap="goBack" />
      <text class="header-title">选择直播间</text>
    </view>
    <scroll-view class="room-list" scroll-y="true">
      <block v-for="(room, index) in liveRooms" :key="room.id">
        <navigator class="room-item" :url="'./liveStreaming?id=' + room.id">
          <view class="room-card">
            <image class="room-thumbnail" :src="room.thumbnail" mode="aspectFill" />
            <view class="room-info">
              <text class="room-title">{{ room.title }}</text>
              <text class="room-description">{{ room.description }}</text>
              <view class="room-stats">
                <icon class="eye-icon" type="eye" size="24" color="#888" />
                <text class="viewer-count">{{ room.viewerCount }}人观看</text>
              </view>
            </view>
          </view>
        </navigator>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      liveRooms: [
        {
          id: 1,
          title: '瑜伽直播课堂',
          description: '专业瑜伽教练在线带课，轻松掌握瑜伽基础。',
          thumbnail: '../../../../static/sports/images/planPersonalization/Yoga.jpg',
          viewerCount: 1024
        },
        {
          id: 2,
          title: 'HIIT燃脂训练',
          description: '高强度间歇训练，快速燃脂，适合忙碌的你。',
          thumbnail: '../../../../static/sports/images/planPersonalization/HIIT.jpg',
          viewerCount: 876
        },
        {
          id: 3,
          title: '舞蹈健身直播',
          description: '动感舞蹈课堂，边跳边瘦，释放压力。',
          thumbnail: '../../../../static/sports/images/exerciseGuide/dance.jpg',
          viewerCount: 654
        },
        {
          id: 4,
          title: '普拉提塑形',
          description: '通过普拉提训练改善体态，提升核心力量。',
          thumbnail: '../../../../static/sports/images/exerciseGuide/pilates.jpg',
          viewerCount: 432
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped lang="scss">
.live-room-list-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  background-color: #ff7b54;
  padding: 20rpx;
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

/* 直播间列表 */
.room-list {
  flex: 1;
  padding: 10rpx;
  overflow-y: scroll;
}

/* 每个直播间卡片 */
.room-item {
  margin-bottom: 20rpx;
}
.room-card {
  display: flex;
  background-color: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}
.room-thumbnail {
  width: 150rpx;
  height: 150rpx;
}
.room-info {
  flex: 1;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.room-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}
.room-description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 8rpx;
}
.room-stats {
  display: flex;
  align-items: center;
}
.eye-icon {
  font-size: 24rpx;
  color: #888;
  margin-right: 6rpx;
}
.viewer-count {
  font-size: 26rpx;
  color: #888;
}
</style>
