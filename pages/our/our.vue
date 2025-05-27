<template>
	<view class="contact">
		<image class="img" src="../../static/R-C.jpg"></image>
		<view class="info">
			<view @click="call">联系电话 : 000-000-000 ( 点击拨打 )</view>
			<view>联系地址 : 上海市宝山区大场镇上海大学计算机学院</view>
		</view>
		<map class="map" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				longitude:121.3895,
				latitude:31.3209,
				markers:[{
					id:1,
					longitude:121.3895,
					latitude:31.3209,
					iconPath:'../../static/didian.png',
					width:30,
					height:30
				}]
			}
		},
		methods: {
			call(){
				uni.makePhoneCall({
					phoneNumber:'000-000-000'
				})
			}
		}
	}
</script>

<style lang="scss">
@import './our'
</style>