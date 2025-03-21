<template>
  <view class="community-container">
    <!-- 顶部导航和搜索区域 -->
    <view class="header">
      <text class="header-title">社区互动与激励</text>
      <view class="search-container">
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索帖子..." 
          @confirm="performSearch" 
        />
        <icon class="search-icon" type="search" @tap="performSearch" />
      </view>
    </view>
    
    <!-- 分类筛选导航 -->
    <scroll-view class="category-tabs" scroll-x="true" show-scrollbar="false">
      <view
        v-for="(category, index) in categories"
        :key="index"
        :class="['category-tab', selectedCategory === category ? 'active' : '']"
        @tap="selectCategory(category)"
      >
        {{ category }}
      </view>
    </scroll-view>
    
    <!-- 帖子列表 -->
    <scroll-view class="posts-feed" scroll-y="true">
      <block v-for="post in filteredPosts" :key="post.id">
        <view class="post-card">
          <!-- 帖子头部 -->
          <view class="post-header">
            <image class="avatar" :src="post.avatar" mode="aspectFill" />
            <view class="user-info">
              <text class="username">{{ post.user }}</text>
              <text class="post-timestamp">{{ post.timestamp }}</text>
            </view>
          </view>
          <!-- 帖子内容 -->
          <view class="post-content">
            <text>{{ post.content }}</text>
            <!-- 如果有图片，则显示图片区域 -->
            <block v-if="post.images && post.images.length">
              <view class="post-images">
                <block v-for="(img, idx) in post.images" :key="idx">
                  <image class="post-image" :src="img" mode="aspectFill" />
                </block>
              </view>
            </block>
          </view>
          <!-- 帖子互动按钮 -->
          <view class="post-actions">
            <view class="action-item" @tap="toggleLike(post)">
              <icon :type="post.liked ? 'heart-fill' : 'heart'" :color="post.liked ? '#ff7b54' : '#ccc'" />
              <text>{{ post.likeCount }}</text>
            </view>
            <view class="action-item" @tap="goToComments(post.id)">
              <icon type="chatbubble" color="#ccc" />
              <text>{{ post.commentCount }}</text>
            </view>
            <view class="action-item" @tap="sharePost(post)">
              <icon type="share" color="#ccc" />
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
    
    <!-- 浮动发帖按钮 -->
    <view class="floating-post-btn" @tap="togglePostForm">
      <icon type="add" size="36" color="#fff" />
    </view>
    
    <!-- 发帖表单弹窗 -->
    <view class="post-form-popup" v-if="showPostForm">
      <view class="popup-overlay" @tap="togglePostForm"></view>
      <view class="post-form-content">
        <text class="form-title">新建帖子</text>
        <input class="form-input" v-model="newPost.user" placeholder="请输入昵称" />
        <textarea class="form-textarea" v-model="newPost.content" placeholder="请输入帖子内容"></textarea>
        <!-- 这里可以扩展图片上传、标签选择等功能 -->
        <view class="form-actions">
          <button class="cancel-btn" @tap="togglePostForm">取消</button>
          <button class="submit-btn" @tap="submitPost">发布</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      // 分类数据
      categories: ['全部', '健身', '饮食', '心态', '训练', '挑战'],
      selectedCategory: '全部',
      // 模拟的帖子数据
      posts: [
        {
          id: 1,
          user: '小明',
          avatar: '/static/images/avatar1.png',
          timestamp: '2025-04-20 10:00',
          content: '今天跑了5公里，状态不错，加油！',
          images: ['/static/images/post1.jpg'],
          liked: false,
          likeCount: 10,
          commentCount: 3,
          category: '训练'
        },
        {
          id: 2,
          user: '小红',
          avatar: '/static/images/avatar2.png',
          timestamp: '2025-04-20 09:30',
          content: '分享一下我的健身餐搭配，既美味又健康！',
          images: ['/static/images/post2.jpg', '/static/images/post3.jpg'],
          liked: true,
          likeCount: 25,
          commentCount: 8,
          category: '饮食'
        },
        {
          id: 3,
          user: '小刚',
          avatar: '/static/images/avatar3.png',
          timestamp: '2025-04-19 18:45',
          content: '参加了减脂挑战赛，感觉收获满满！',
          images: [],
          liked: false,
          likeCount: 15,
          commentCount: 5,
          category: '挑战'
        }
      ],
      // 控制发帖表单弹窗显示
      showPostForm: false,
      // 新发帖数据
      newPost: {
        user: '',
        content: ''
      }
    }
  },
  computed: {
    // 根据选中分类和搜索关键词过滤帖子（逻辑：先按分类过滤，再按关键词过滤）
    filteredPosts() {
      let list = this.posts;
      if (this.selectedCategory !== '全部') {
        list = list.filter(post => post.category === this.selectedCategory);
      }
      if (this.searchKeyword.trim() !== '') {
        const keyword = this.searchKeyword.trim().toLowerCase();
        list = list.filter(post =>
          post.content.toLowerCase().includes(keyword) ||
          post.user.toLowerCase().includes(keyword)
        );
      }
      return list;
    }
  },
  methods: {
    // 分类选择时重置搜索关键词
    selectCategory(category) {
      this.searchKeyword = '';
      this.selectedCategory = category;
    },
    // 搜索操作时，清空分类选择（以便只根据关键词过滤）
    performSearch() {
      console.log('搜索关键词:', this.searchKeyword);
      this.selectedCategory = '全部';
      // 此处如果需要额外请求接口，可在此实现
    },
    toggleLike(post) {
      post.liked = !post.liked;
      post.likeCount = post.liked ? post.likeCount + 1 : post.likeCount - 1;
    },
    goToComments(postId) {
      // 跳转到评论页面，并传递帖子 id
      uni.navigateTo({
        url: './comment/comment?postId=' + postId
      });
    },
    sharePost(post) {
      uni.showToast({
        title: '分享功能暂未实现',
        icon: 'none'
      });
    },
    // 切换发帖表单显示状态
    togglePostForm() {
      this.showPostForm = !this.showPostForm;
      if (!this.showPostForm) {
        // 关闭时清空数据
        this.newPost.user = '';
        this.newPost.content = '';
      }
    },
    submitPost() {
      if (this.newPost.user.trim() === '' || this.newPost.content.trim() === '') {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
      // 模拟生成新帖子，随机 id 及当前时间
      const newId = this.posts.length ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
      const newPostData = {
        id: newId,
        user: this.newPost.user,
        avatar: '/static/images/my-avatar.png',
        timestamp: new Date().toLocaleString(),
        content: this.newPost.content,
        images: [],
        liked: false,
        likeCount: 0,
        commentCount: 0,
        category: '健身' // 默认分类，可扩展为发帖时选择
      };
      this.posts.unshift(newPostData);
      uni.showToast({
        title: '帖子发布成功',
        icon: 'success'
      });
      this.togglePostForm();
    }
  }
}
</script>

<style scoped lang="scss">
.community-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
  position: relative;
}

/* Header 与搜索 */
.header {
  background-color: #ff7b54;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.search-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 30rpx;
  overflow: hidden;
  background-color: #fafafa;
  margin: 0 20rpx;
}
.search-input {
  flex: 1;
  padding: 10rpx 20rpx;
  font-size: 26rpx;
  border: none;
  outline: none;
  background-color: transparent;
}
.search-icon {
  padding: 10rpx 20rpx;
  background-color: #ff7b54;
  color: #fff;
}

/* 分类筛选 */
.category-tabs {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 10rpx;
  border-bottom: 1rpx solid #ddd;
  margin: 10rpx 0;
}
.category-tab {
  padding: 10rpx 20rpx;
  font-size: 26rpx;
  color: #666;
  margin-right: 10rpx;
  border-radius: 30rpx;
  background-color: #f0f0f0;
  transition: background-color 0.3s, color 0.3s;
}
.category-tab.active {
  background-color: #ff7b54;
  color: #fff;
}

/* 帖子列表 */
.posts-feed {
  flex: 1;
  padding: 10rpx;
  overflow-y: scroll;
}
.post-card {
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  padding: 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
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
  margin-bottom: 10rpx;
}
.post-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}
.post-image {
  width: 150rpx;
  height: 150rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
}
.post-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: 1rpx solid #eee;
  padding-top: 10rpx;
}
.action-item {
  display: flex;
  align-items: center;
}
.action-item icon {
  margin-right: 5rpx;
}
.action-item text {
  font-size: 26rpx;
  color: #666;
}

/* 浮动发帖按钮 */
.floating-post-btn {
  position: absolute;
  bottom: 30rpx;
  right: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #ff7b54;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.3);
}
.floating-post-btn icon {
  font-size: 36rpx;
  color: #fff;
}

/* 发帖表单弹窗 */
.post-form-popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}
.post-form-content {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
  background-color: #fff;
  width: 90%;
  padding: 20rpx;
  border-radius: 8rpx;
}
.form-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20rpx;
}
.form-input {
  width: 100%;
  padding: 10rpx;
  font-size: 28rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 10rpx;
  font-size: 28rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
.form-actions {
  display: flex;
  justify-content: space-around;
}
.cancel-btn, .submit-btn {
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  border: none;
  border-radius: 8rpx;
}
.cancel-btn {
  background-color: #ccc;
  color: #fff;
}
.submit-btn {
  background-color: #ff7b54;
  color: #fff;
}
</style>
