<template>
  <view class="exercise-guide-container">
    <!-- 顶部搜索栏 -->
    <view class="header">
      <view class="search-container">
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索运动教程" 
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

    <!-- 运动教程列表 -->
    <scroll-view class="exercise-scroll" scroll-y="true">
      <block v-for="(exercise, index) in filteredExerciseList" :key="exercise.id">
        <navigator class="exercise-item" :url="'./detail/detail?id=' + exercise.id">
          <view class="card">
            <view class="image-container">
              <image class="exercise-image" :src="exercise.thumbnail" mode="aspectFill" />
              <!-- 如果有视频预览，则显示播放图标覆盖 -->
              <view v-if="exercise.videoUrl" class="play-overlay">
                <icon type="play" size="30" color="#fff" />
              </view>
            </view>
            <view class="exercise-info">
              <text class="exercise-title">{{ exercise.title }}</text>
              <text class="exercise-desc">{{ exercise.description }}</text>
              <!-- 标签区域 -->
              <view class="tags">
                <block v-for="(tag, i) in exercise.tags" :key="i">
                  <view class="tag">{{ tag }}</view>
                </block>
              </view>
            </view>
          </view>
        </navigator>
      </block>
    </scroll-view>

    <!-- 热门推荐区域 -->
    <view class="recommend-section">
      <text class="section-title">热门推荐</text>
      <scroll-view class="recommend-scroll" scroll-x="true" show-scrollbar="false">
        <block v-for="(item, index) in recommendedList" :key="item.id">
          <navigator class="recommend-item" :url="'./detail/detail?id=' + item.id">
            <image class="recommend-image" :src="item.thumbnail" mode="aspectFill" />
            <text class="recommend-title">{{ item.title }}</text>
          </navigator>
        </block>
      </scroll-view>
    </view>

    <!-- 直播入口 -->
    <view class="live-section" @tap="goLive">
      <icon type="video" size="36" color="#fff" />
      <text class="live-text">立即进入直播课堂</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 搜索关键字
      searchKeyword: '',
      // 分类导航数据
      categories: ['全部', '热身', '力量训练', '有氧', '柔韧', '拉伸'],
      selectedCategory: '全部',
      // 示例运动教程数据
      exerciseList: [
        {
          id: 1,
          title: '全身热身操',
          description: '激活全身肌肉，预防运动损伤。',
          thumbnail: '/static/images/exercise1.jpg',
          videoUrl: '', // 如果有视频预览，填写视频链接
          tags: ['初级', '热身'],
          category: '热身'
        },
        {
          id: 2,
          title: 'HIIT高强度间歇训练',
          description: '短时高效燃脂，适合时间有限的用户。',
          thumbnail: '/static/images/exercise2.jpg',
          videoUrl: 'https://example.com/video2.mp4',
          tags: ['高强度', '燃脂'],
          category: '有氧'
        },
        {
          id: 3,
          title: '瑜伽基础练习',
          description: '增强柔韧性，缓解压力，适合初学者。',
          thumbnail: '/static/images/exercise3.jpg',
          videoUrl: '',
          tags: ['初级', '柔韧'],
          category: '柔韧'
        },
        {
          id: 4,
          title: '核心力量训练',
          description: '强化核心肌群，改善体态，提升运动表现。',
          thumbnail: '/static/images/exercise4.jpg',
          videoUrl: 'https://example.com/video4.mp4',
          tags: ['力量', '核心'],
          category: '力量训练'
        },
        {
          id: 5,
          title: '有氧运动入门',
          description: '循序渐进开启有氧训练。',
          thumbnail: '/static/images/exercise5.jpg',
          videoUrl: '',
          tags: ['初级', '有氧'],
          category: '有氧'
        },
        {
          id: 6,
          title: '拉伸与放松',
          description: '运动后拉伸，预防肌肉酸痛。',
          thumbnail: '/static/images/exercise6.jpg',
          videoUrl: '',
          tags: ['拉伸', '放松'],
          category: '拉伸'
        }
      ],
      // 热门推荐（示例数据）
      recommendedList: [
        {
          id: 2,
          title: 'HIIT高强度间歇训练',
          thumbnail: '/static/images/exercise2.jpg'
        },
        {
          id: 4,
          title: '核心力量训练',
          thumbnail: '/static/images/exercise4.jpg'
        },
        {
          id: 5,
          title: '有氧运动入门',
          thumbnail: '/static/images/exercise5.jpg'
        }
      ]
    }
  },
  computed: {
    // 根据选中分类和搜索关键字过滤运动教程数据
    filteredExerciseList() {
      let list = this.exerciseList;
      if (this.selectedCategory !== '全部') {
        list = list.filter(item => item.category === this.selectedCategory);
      }
      if (this.searchKeyword.trim() !== '') {
        const keyword = this.searchKeyword.trim().toLowerCase();
        list = list.filter(
          item =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        );
      }
      return list;
    }
  },
  methods: {
    // 分类选择
    selectCategory(category) {
		this.searchKeyword = "";
      this.selectedCategory = category;
    },
    // 搜索操作（此处由于采用 v-model 自动更新，performSearch 可用于触发其他操作或日志记录）
    performSearch() {
		this.selectedCategory ='全部'
      console.log('搜索关键字：', this.searchKeyword);
      // 由于 computed 属性自动过滤数据，此处可额外添加网络请求逻辑
    },
    // 直播入口跳转
    goLive() {
      uni.navigateTo({
        url: './liveStreaming/liveRoomList'
      });
    }
  }
}
</script>

<style scoped lang="scss">
.exercise-guide-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
}

/* 搜索栏样式 */
.header {
  background-color: #fff;
  padding: 20rpx;
}
.search-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 30rpx;
  overflow: hidden;
  background-color: #fafafa;
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

/* 分类筛选导航 */
.category-tabs {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 10rpx;
  border-bottom: 1rpx solid #ddd;
  margin-bottom: 10rpx;
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

/* 滚动视图：教程列表 */
.exercise-scroll {
  flex: 1;
  padding: 10rpx;
}

/* 卡片式布局 */
.card {
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
  margin-bottom: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
.image-container {
  position: relative;
}
.exercise-image {
  width: 150rpx;
  height: 150rpx;
}
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 150rpx;
  height: 150rpx;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.exercise-info {
  flex: 1;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.exercise-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.exercise-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}
/* 标签样式 */
.tags {
  display: flex;
  flex-wrap: wrap;
}
.tag {
  background-color: #ff7b54;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 8rpx;
  border-radius: 10rpx;
  margin-right: 6rpx;
  margin-bottom: 6rpx;
}

/* 热门推荐区域 */
.recommend-section {
  background-color: #fff;
  padding: 10rpx;
  margin: 10rpx 0;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.recommend-scroll {
  display: flex;
  flex-direction: row;
}
.recommend-item {
  width: 250rpx;
  margin-right: 10rpx;
}
.recommend-image {
  width: 100%;
  height: 150rpx;
  border-radius: 8rpx;
}
.recommend-title {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  margin-top: 10rpx;
}

/* 直播入口 */
.live-section {
  background-color: #ff7b54;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.live-text {
  font-size: 32rpx;
  color: #fff;
  margin-left: 10rpx;
}
</style>
