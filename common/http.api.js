const install = (Vue, vm) => {
	//定义api属性
	vm.$u.api={}
	
	// 首页内容信息展示
	vm.$u.api.homeContent = (params = {}) => vm.$u.get('home/content');

	//登录
	vm.$u.api.login = params => vm.$u.post('member/login',params);
	//根据分类获取专题
	vm.$u.api.subjectList = params => vm.$u.get('home/subjectList',params);
		
	//以树形结构获取所有运动分类
	vm.$u.api.getCate = (params = {}) => vm.$u.get('sport/categoryTreeList');
	//以树形结构获取所有食品分类
	// vm.$u.api.getFoodCate = (params = {}) => vm.$u.get('food/categoryTreeList');
		vm.$u.api.getFoodCate = (params = {}) => vm.$u.get('api/list');

	//获取用户信息
	vm.$u.api.getInfo = (params = {}) => vm.$u.get('member/info');
	//获取更多用户信息
	vm.$u.api.getExtendsInfo = params => vm.$u.get('member/ExtendsInfo',params);
	//更新用户信息
	vm.$u.api.update = params => vm.$u.post('member/update',params);
	//更新用户拓展信息
	vm.$u.api.updateExtends = params => vm.$u.post('member/updateExtends',params);
	//根据身高体重判断bmi
	vm.$u.api.healthLevel = params => vm.$u.get('member/healthLevel',params);
	//退出登录
	vm.$u.api.logout = () => vm.$u.post('member/logout');
	//获取oss token
	vm.$u.api.ossToken = () => vm.$u.get('aliyun/oss/policy');
	//获取运动详情
	vm.$u.api.getDetail = params => vm.$u.get('sport/detail/'+params);
	//获取运动详情
	vm.$u.api.getFoodDetail = params => vm.$u.get('food/detail/'+params);
	//添加到计划
	vm.$u.api.addPlan = params => vm.$u.post('plan/add',params);
	//添加到饮食
	vm.$u.api.addPlanFood = params => vm.$u.post('planFood/add',params);
	//获取用户的计划列表
	vm.$u.api.getPlanList = () => vm.$u.get('plan/list');
	//获取用户的饮食
	vm.$u.api.getPlanFoodList = () => vm.$u.get('api/planFood/list');
	//修改计划列表中sf数量
	vm.$u.api.getQuantity = params => vm.$u.get('plan/update/quantity',params);
	//单条删除
	vm.$u.api.deletePlan = params => vm.$u.post('plan/delete',params);
	//修改计划列表中sf数量
	vm.$u.api.getQuantityFood = params => vm.$u.get('planFood/update/quantity',params);
	//单条删除
	vm.$u.api.deletePlanFood = params => vm.$u.post('planFood/delete',params);
	//批量删除
	vm.$u.api.deletesFood = params => vm.$u.post('planFood/deletes',params);
	//按状态分页获取用户订单列表
	vm.$u.api.getOrderList = params => vm.$u.get('order/list',params);
	//根据计划信息生成计划单
	vm.$u.api.generateOrder = params => vm.$u.post('order/generateOrder',params);
	//按状态分页获取用户饮食记录
	vm.$u.api.getOrderListFood = params => vm.$u.get('orderFood/list',params);
	//根据计划信息生成饮食记录
	vm.$u.api.generateOrderFood = params => vm.$u.post('orderFood/generateOrder',params);
	//批量删除
	vm.$u.api.deletes = params => vm.$u.post('plan/deletes',params);
	//根据身高体重判断bmi
	vm.$u.api.manage = params => vm.$u.get('order/manage',params);
	// 搜索食物
	vm.$u.api.searchFood = (params) => vm.$u.get('api/food/search', params);
	// 获取推荐食物
	vm.$u.api.getRecommendFoods = (params) => vm.$u.post('api/food/recommend', params);
}

export default {
	install
}