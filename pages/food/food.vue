<!-- <template>
	<view class="u-wrap">
		<view class="u-search-box">
			<u-search placeholder="输入名称"></u-search>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in tabbar" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{item.name}}</text>
							</view>
							<view class="item-container">
								<navigator 
								class="thumb-box" 
								v-for="(item1, index1) in item.children" 
								:key="item1.id"
								:url="'/pages/food-detail/food-detail?id='+item1.id"
								>
									<image class="item-menu-image" :src="item1.icon" mode=""></image>
									<view class="item-menu-name">{{item1.name}}</view>
								</navigator>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbar: {},
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
			}
		},
		computed: {
			
		},
		async onLoad() {
			const res=await this.$u.api.getFoodCate()
			this.tabbar=res
		},
		
		methods: {
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style> -->
<template>
	<view class="food-page">
		<!-- 用户饮食记录模块 -->
		<view class="section food-record">
			<view class="record-summary" v-if="todayRecords.length > 0">
				<text>已记录 {{todayRecords.length}} 餐</text>
				<text>总热量: {{totalCalories}} 千卡</text>
			</view>
		</view>

		<!-- 搜索食物模块 -->
		<view class="section search-section">
			<view class="search-box">
				<u-search
					v-model="searchFood"
					placeholder="搜索食物"
					:clearabled="true"
					:show-action="true"
					@search="searchFoodItem"
					@custom="searchFoodItem"
				></u-search>
			</view>
			
			<!-- 搜索结果列表 -->
			<view class="search-results" v-if="searchResults.length > 0">
				<view 
					class="food-item" 
					v-for="food in searchResults" 
					:key="food.id"
					@click="selectFood(food)"
				>
					<image class="food-image" :src="food.pic" mode="aspectFill"></image>
					<view class="food-info">
						<text class="food-name">{{food.name}}</text>
						<text class="food-desc">{{food.description}}</text>
						<text class="food-calorie">{{food.calorie}}千卡/100g</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 推荐模块 -->
		<view class="section recommend-section">
			<view class="section-title">
				<text>今日推荐</text>
				<text class="sub-title">基于您的饮食记录</text>
			</view>
			
			<view class="recommend-list" v-if="recommendFoods.length > 0">
				<scroll-view scroll-x class="recommend-scroll">
					<view 
						class="recommend-item" 
						v-for="food in recommendFoods" 
						:key="food.id"
						@click="selectFood(food)"
					>
						<image class="recommend-image" :src="food.pic" mode="aspectFill"></image>
						<view class="recommend-info">
							<text class="recommend-name">{{food.name}}</text>
							<text class="recommend-calorie">{{food.calorie}}千卡/100g</text>
							<text class="recommend-reason">{{food.recommendReason}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<view class="empty-recommend" v-else>
				<u-empty mode="data" text="暂无推荐"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchFood: '',
				todayRecords: [],
				totalCalories: 0,
				recommendFoods: [],
				searchResults: [],
				searchTimer: null,
				dailyCalorieTarget: 2000, // 每日目标卡路里
			}
		},
		
		methods: {
			// 搜索食物
			async searchFoodItem() {
				try {
					if (this.searchTimer) {
						clearTimeout(this.searchTimer);
					}
					
					if (!this.searchFood.trim()) {
						this.searchResults = [];
						return;
					}
					
					this.searchTimer = setTimeout(async () => {
						const params = {
							keyword: this.searchFood.trim()
						};
						
						const res = await this.$u.api.searchFood(params);
						console.log('搜索结果:', res);
						
						if (Array.isArray(res)) {
							this.searchResults = res;
						} else {
							this.searchResults = [];
							this.$u.toast('搜索失败');
						}
					}, 300);
				} catch(e) {
					console.error('搜索出错:', e);
					this.$u.toast('搜索失败');
					this.searchResults = [];
				}
			},
			
	  // 选择食物
	  selectFood(food) {
		uni.navigateTo({
		  url: `/pages/food-detail/food-detail?id=${food.id}`
		});
	  },
			
			// 获取今日饮食记录
			async getFoodRecords() {
				try {
					const res = await this.$u.api.getPlanFoodList();
					this.todayRecords = Array.isArray(res) ? res : [];
					this.calculateTotalCalories();
					// 获取饮食记录后更新推荐
					await this.getRecommendFoods();
				} catch(e) {
					console.error('获取饮食记录失败:', e);
					this.$u.toast('获取饮食记录失败');
					this.todayRecords = [];
				}
			},
			
			// 计算总卡路里
			calculateTotalCalories() {
				try {
					this.totalCalories = this.todayRecords.reduce((sum, item) => {
						const quantity = Number(item.quantity) || 1;
						const calorie = Number(item.calorie) || 0;
						return sum + (calorie * quantity);
					}, 0);
				} catch(e) {
					console.error('计算卡路里出错:', e);
					this.totalCalories = 0;
				}
			},
			
			// 获取推荐食物
			async getRecommendFoods() {
				try {
					// 计算已摄入的卡路里占比
					const caloriePercentage = (this.totalCalories / this.dailyCalorieTarget) * 100;
					
					// 构建推荐请求参数
					const params = {
						currentCalories: this.totalCalories,
						targetCalories: this.dailyCalorieTarget,
						mealRecords: this.todayRecords.map(record => ({
							foodId: record.foodId,
							quantity: record.quantity
						}))
					};
					
					const res = await this.$u.api.getRecommendFoods(params);
					if (Array.isArray(res)) {
						this.recommendFoods = res.map(food => ({
							...food,
							recommendReason: this.generateRecommendReason(food, caloriePercentage)
						}));
					}
				} catch(e) {
					console.error('获取推荐失败:', e);
					this.recommendFoods = [];
				}
			},
			
			// 生成推荐原因
			generateRecommendReason(food, caloriePercentage) {
				if (caloriePercentage > 90) {
					return '低热量，适合补充营养';
				} else if (caloriePercentage < 50) {
					return '营养均衡，热量适中';
				} else {
					return '搭配合理，有助健康';
				}
			}
		},
		
		onShow() {
			this.getFoodRecords();
		}
	}
</script>

<style lang="scss" scoped>
	.food-page {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		
		.section {
			background: #fff;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
		}
		
		.record-summary {
			display: flex;
			justify-content: space-around;
			padding: 20rpx 0;
			
			text {
				color: #666;
				font-size: 28rpx;
			}
		}
		
		.search-section {
			.search-box {
				margin-bottom: 20rpx;
			}
			
			.search-results {
				.food-item {
					display: flex;
					padding: 20rpx;
					border-bottom: 1rpx solid #eee;
					
					&:last-child {
						border-bottom: none;
					}
					
					.food-image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
					}
					
					.food-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.food-name {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}
						
						.food-desc {
							font-size: 24rpx;
							color: #666;
							margin: 10rpx 0;
						}
						
						.food-calorie {
							font-size: 24rpx;
							color: #ff6b81;
						}
					}
				}
			}
		}

		.recommend-section {
			.section-title {
				display: flex;
				align-items: baseline;
				margin-bottom: 20rpx;
				
				text {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
				
				.sub-title {
					font-size: 24rpx;
					color: #999;
					margin-left: 20rpx;
				}
			}
			
			.recommend-scroll {
				white-space: nowrap;
				
				.recommend-item {
					display: inline-block;
					width: 300rpx;
					margin-right: 20rpx;
					background: #fff;
					border-radius: 12rpx;
					overflow: hidden;
					box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
					
					&:last-child {
						margin-right: 0;
					}
					
					.recommend-image {
						width: 100%;
						height: 200rpx;
					}
					
					.recommend-info {
						padding: 16rpx;
						
						.recommend-name {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
							display: block;
						}
						
						.recommend-calorie {
							font-size: 24rpx;
							color: #ff6b81;
							display: block;
							margin: 8rpx 0;
						}
						
						.recommend-reason {
							font-size: 22rpx;
							color: #666;
							display: block;
						}
					}
				}
			}
			
			.empty-recommend {
				padding: 40rpx 0;
			}
		}
	}
</style>