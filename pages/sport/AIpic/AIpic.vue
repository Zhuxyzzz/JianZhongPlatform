<template>
  <view class="ai-weightloss-container">
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
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">AI 减重预览</text>
    </view>

    <!-- 上传照片区域 -->
    <view class="upload-section">
      <button class="upload-btn" @tap="chooseImage">上传照片</button>
      <image 
        v-if="originalImage" 
        :src="originalImage" 
        class="preview-image" 
        mode="aspectFit" 
      />
    </view>

    <!-- 滑动条选择减重斤数 -->
    <view class="slider-section">
      <text class="slider-label">模拟减重: {{ weightLoss }} 斤</text>
      <slider 
        :min="0"
        :max="20"
        step="1"
        :value="weightLoss"
        show-value
        @change="onSliderChange"
      ></slider>
    </view>

    <!-- 预览按钮 -->
    <view class="action-section">
      <button class="preview-btn" @tap="simulatePreview">预览效果</button>
    </view>

    <!-- AI预览照片展示 -->
    <view class="result-section" v-if="resultImage">
      <text class="result-title">预览效果</text>
      <image 
        :src="resultImage" 
        class="result-image" 
        mode="aspectFit" 
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		bannerList: [
		  { img: '../../../static/sports/images/AIpic/banner1.jpg' },
		  { img: '../../../static/sports/images/AIpic/banner2.jpg' }
		],
      originalImage: '', // 用户上传的照片路径
      weightLoss: 0,     // 模拟减重斤数
      resultImage: ''    // AI 处理后的照片路径（预览效果）
    }
  },
  methods: {
    // 上传照片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.originalImage = res.tempFilePaths[0];
          // 每次上传新图片时，清空之前的预览结果
          this.resultImage = '';
        },
        fail: () => {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          });
        }
      });
    },
    // 滑动条改变时更新 weightLoss 数值
    onSliderChange(e) {
      this.weightLoss = e.detail.value;
    },
    // 模拟 AI 预览效果（实际项目中可调用后端接口）
    simulatePreview() {
      if (!this.originalImage) {
        uni.showToast({
          title: '请先上传照片',
          icon: 'none'
        });
        return;
      }
      // 模拟处理过程
      // 实际情况可能需要将 originalImage 和 weightLoss 参数传给后端 API
      // 返回处理后的图片，此处使用示例图片作为示例
      if (this.weightLoss > 0) {
        this.resultImage = '../../../static/sports/images/AIpic/preview.jpg';
      } else {
        // 若减重为 0，则显示原图
        this.resultImage = this.originalImage;
      }
    }
  }
}
</script>

<style scoped>
	/* 1. Banner 样式 */
	.banner-swiper {
	  width: 100%;
	  height: 600rpx;
	  margin-bottom: 10rpx;
	}
	.banner-image {
	  width: 100%;
	  height: 100%;
	}
.ai-weightloss-container {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 顶部标题 */
.header {
  text-align: center;
  margin-bottom: 20rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff7b54;
}

/* 上传照片区域 */
.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}
.upload-btn {
  background-color: #ff7b54;
  color: #fff;
  padding: 10rpx 20rpx;
  border: none;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.preview-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 8rpx;
}

/* 滑动条区域 */
.slider-section {
  margin: 20rpx 0;
  padding: 0 10rpx;
}
.slider-label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

/* 操作按钮 */
.action-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}
.preview-btn {
  background-color: #ff7b54;
  color: #fff;
  padding: 10rpx 20rpx;
  border: none;
  border-radius: 8rpx;
}

/* AI 预览结果展示 */
.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #ff7b54;
}
.result-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 8rpx;
}
</style>
