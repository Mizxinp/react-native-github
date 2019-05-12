export default class NavigationUtil{
	// 返回首页
	static resetToHomePage(params){
		const { navigation } = params;
		navigation.navigate('Main')
	}
	// 返回上一页
	static goBack(navigation){
		navigation.goBack()
	}
	// 跳转到之指定页
	static goPage(params,page){
		// const { navigation } = params;
		const navigation = NavigationUtil.navigation
		if(!navigation){
			console.log('navigation不能为空');
			return 
		}
		navigation.navigate(
			page,
			{ ...params }
		)
	}
}