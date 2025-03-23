<template>
  <view class="comments-container">
    <!-- 顶部导航 -->
    <view class="header">
      <icon class="back-icon" type="back" @tap="goBack" />
      <text class="header-title">评论详情</text>
    </view>

    <!-- 原帖详情 -->
    <view class="post-card">
      <view class="post-header">
        <image class="avatar" :src="post.avatar" mode="aspectFill" />
        <view class="user-info">
          <text class="username">{{ post.user }}</text>
          <text class="post-timestamp">{{ post.timestamp }}</text>
        </view>
      </view>
      <view class="post-content">
        <text>{{ post.content }}</text>
      </view>
    </view>

    <!-- 评论列表 -->
    <scroll-view class="comments-list" scroll-y :scroll-top="commentsScrollTop">
      <block v-for="(comment, index) in comments" :key="index">
        <view class="comment-item">
          <image class="comment-avatar" :src="comment.avatar" mode="aspectFill" />
          <view class="comment-info">
            <text class="comment-user">{{ comment.user }}</text>
            <text class="comment-text">{{ comment.text }}</text>
            <text class="comment-timestamp">{{ comment.timestamp }}</text>
          </view>
        </view>
      </block>
    </scroll-view>

    <!-- 评论输入区域 -->
    <view class="input-section">
      <input class="comment-input" v-model="newComment" placeholder="请输入评论" @confirm="submitComment" />
      <button class="send-button" @tap="submitComment">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 模拟原帖数据，实际项目中可通过接口获取
      post: {
        id: 1,
        user: '小明',
        avatar: '../../../../static/sports/images/user_avatar.png',
        timestamp: '2025-04-20 10:00',
        content: '今天跑了5公里，状态不错，加油！'
      },
      // 评论列表（示例数据）
      comments: [
        {
          user: '小红',
          avatar: '/static/images/avatar2.png',
          text: '真不错，坚持下去！',
          timestamp: '2025-04-20 10:30'
        },
        {
          user: '小刚',
          avatar: '/static/images/avatar3.png',
          text: '跑步真的让人充满活力！',
          timestamp: '2025-04-20 11:00'
        }
      ],
      newComment: '',
      commentsScrollTop: 9999
    }
  },
  onLoad(options) {
    // 获取帖子 id，如果需要可用 options.postId 来请求真实数据
    const postId = options.postId;
    console.log('评论详情页接收到的 postId:', postId);
    // 此处可根据 postId 调用接口获取原帖和评论数据
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    submitComment() {
      if (this.newComment.trim() === '') {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        });
        return;
      }
      // 模拟新增评论，实际项目中应提交到服务器
      const comment = {
        user: '我',
        avatar: '/static/images/my-avatar.png',
        text: this.newComment.trim(),
        timestamp: new Date().toLocaleString()
      };
      this.comments.push(comment);
      this.newComment = '';
      this.$nextTick(() => {
        // 更新 scroll-top 使 scroll-view 滚动到底部
        this.commentsScrollTop = 9999;
      });
    }
  }
}
</script>

<style scoped lang="scss">
.comments-container {
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

/* 原帖卡片 */
.post-card {
  background-color: #fff;
  border-radius: 8rpx;
  margin: 10rpx 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.username {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}
.post-timestamp {
  font-size: 24rpx;
  color: #999;
}
.post-content {
  font-size: 28rpx;
  color: #666;
}

/* 评论列表 */
.comments-list {
  flex: 1;
  padding: 10rpx 20rpx;
  overflow-y: scroll;
}
.comment-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 10rpx;
}
.comment-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}
.comment-info {
  background-color: #f0f0f0;
  border-radius: 8rpx;
  padding: 10rpx;
  flex: 1;
}
.comment-user {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}
.comment-text {
  font-size: 26rpx;
  color: #666;
}
.comment-timestamp {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

/* 评论输入区域 */
.input-section {
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ddd;
  padding: 10rpx;
}
.comment-input {
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
