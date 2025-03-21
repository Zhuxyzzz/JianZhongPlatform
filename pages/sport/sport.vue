<template>
  <view class="sport-home-container">

    <!-- 1. 顶部 Banner 轮播 -->
    <swiper
      class="banner-swiper"
      autoplay
      interval="3000"
      indicator-dots
      circular
    >
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image
          :src="item.img"
          class="banner-image"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>

    <!-- 2. 中间六个功能入口 -->
    <view class="feature-grid">
      <view
        class="feature-item"
        v-for="(feature, index) in features"
        :key="index"
        @tap="goFeature(feature)"
      >
        <image :src="feature.icon" class="feature-icon" mode="aspectFit" />
        <text class="feature-text">{{ feature.title }}</text>
      </view>
    </view>

    <!-- 3. 运动推荐区域 -->
    <view class="recommend-section">
      <view class="section-title">
        <text>运动推荐</text>
      </view>
      <view class="recommend-list">
        <view
          class="recommend-card"
          v-for="(item, idx) in recommendList"
          :key="idx"
          @tap="goRecommendDetail(item)"
        >
          <image :src="item.img" class="recommend-image" mode="aspectFill" />
          <view class="recommend-info">
            <text class="recommend-title">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      // Banner 列表
      bannerList: [
        { img: '../../static/sports/images/banner1.jpg' },
        { img: '../../static/sports/images/banner2.jpg' },
      ],
      // 中间六个功能：这里示例了六个功能，可自行替换标题、图标和跳转逻辑
      features: [
        {
          title: '个性化运动计划',
          icon: '../../static/sports/icons/icon_plan.png',
          link: '/pages/sport/planPersonalized/planPersonalized' // 假设有对应页面
        },
        {
          title: '运动数据记录',
          icon: '../../static/sports/icons/icon_record.png',
          link: '/pages/sport/sportsRecord/sportsRecord'
        },
        {
          title: '运动数据分析',
          icon: '../../static/sports/icons/icon_analysis.png',
          link: '/pages/sport/sportsAnalysis/sportsAnalysis'
        },
        {
          title: '运动学习与指导',
          icon: '../../static/sports/icons/icon_learn.png',
          link: '/pages/sport/exerciseGuide/exerciseGuide'
        },
        {
          title: '社区互动与激励',
          icon: '../../static/sports/icons/icon_community.png',
          link: '/pages/sport/community/community'
        },
        {
          title: '医生端运动管理',
          icon: '../../static/sports/icons/icon_doctor.png',
          link: '/pages/sport/doctorManagement/doctorManagement'
        },
      ],
      // 运动推荐列表
      recommendList: [
        {
          img: '../../static/sports/images/recommend1.jpg',
          title: '每日一遍全身燃脂'
        },
        {
          img: '../../static/sports/images/recommend2.jpg',
          title: '十大减脂塑形运动'
        }
      ]
    }
  },
  methods: {
    // 点击功能入口
    goFeature(feature) {
      // 根据 feature.link 跳转页面
      uni.navigateTo({
        url: feature.link
      })
    },
    // 点击运动推荐卡片
    goRecommendDetail(item) {
      // 可以跳转到对应的详情页
      // 这里仅示例
      uni.showToast({
        title: `进入「${item.title}」详情`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sport-home-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 1. Banner 样式 */
.banner-swiper {
  width: 100%;
  height: 400rpx;
  margin-bottom: 10rpx;
}
.banner-image {
  width: 100%;
  height: 100%;
}

/* 2. 中间六个功能入口 */
.feature-grid {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 10rpx;
  justify-content: space-between;
  /* 让每个item大约占1/3宽度，一行显示3个 */
}
.feature-item {
  width: 32%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15rpx;
}
.feature-item:hover{
	cursor: pointer;
}
.feature-icon {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 6rpx;
}
.feature-text {
  font-size: 24rpx;
  color: #333;
}
.feature-text:hover {
  color: aquamarine;
}

/* 3. 运动推荐区域 */
.recommend-section {
  margin-top: 10rpx;
  background-color: #fff;
  padding: 10rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.recommend-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.recommend-card {
  width: 48%;
  background-color: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}
.recommend-image {
  width: 100%;
  height: 250rpx;
}
.recommend-info {
  padding: 8rpx;
}
.recommend-title {
  font-size: 24rpx;
  color: #333;
}
</style>
