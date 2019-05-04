import React from 'react'
import { View,Text } from 'react-native'
import {
	createStackNavigator,
	createSwitchNavigator,
	createMaterialTopTabNavigator,
	createBottomTabNavigator,
	createAppContainer
} from 'react-navigation'
import { BottomTabBar } from 'react-navigation-tabs'

// 图标
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'

// 自己定义
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import Mypage from '../page/Mypage'
import NavigationUtil from './NavigationUtil';


const TABS = {
	PopularPage:{
		screen:PopularPage,
		navigationOptions:{
			tabBarLabel:'最热',
			tabBarIcon:({tintColor,focused}) => (
				<MaterialIcons 
					name='whatshot'
					size={26}
					style={{color:tintColor}}
				/>
			)
		}
	},
	TrendingPage:{
		screen:TrendingPage,
		navigationOptions:{
			tabBarLabel:'趋势',
			tabBarIcon:({tintColor,focused}) => (
				<Feather 
					name='trending-up'
					size={26}
					style={{color:tintColor}}
				/>
			)
		}
	},
	FavoritePage:{
		screen:FavoritePage,
		navigationOptions:{
			tabBarLabel:'收藏',
			tabBarIcon:({tintColor,focused}) => (
				<MaterialIcons 
					name='favorite'
					size={26}
					style={{color:tintColor}}
				/>
			)
		}
	},
	Mypage:{
		screen:Mypage,
		navigationOptions:{
			tabBarLabel:'我的',
			tabBarIcon:({tintColor,focused}) => (
				<AntDesign 
					name='user'
					size={26}
					style={{color:tintColor}}
				/>
			)
		}
	}
}
class DynamitTabNavigation extends React.Component{
	tabNavigation(){
		const { PopularPage,TrendingPage,FavoritePage,Mypage } = TABS
		const tabs = { PopularPage,TrendingPage,FavoritePage,Mypage }
		// 这里可以发请求去获取需要展示的tab页，若要动态配置属性可以这样：
		// PopularPage.navigationOptions.tabBarLabel = '修改'
		return createAppContainer(
			createBottomTabNavigator(tabs,{
				
				tabBarComponent:tabBarComponent
			})
		)
	}
	render(){
		// 用于解决内层组件无法跳转到外层出现的问题
		NavigationUtil.navigation = this.props.navigation
		const Tab = this.tabNavigation();
		return(
			<Tab />
			// <Text>hj</Text>
		)
	}
}

// 改变底部导航主题
class tabBarComponent extends React.Component{
	constructor(props){
		super(props)
		this.theme={
			tintColor:props.activeTintColor,
			updateTime:new Date().getTime()
		}
	}
	render(){
		const { routes,index } = this.props.navigation.state
		if(routes[index].params){
			const {theme} = routes[index].params
			if(theme && theme.updateTime > this.theme.updateTime){
				this.theme = theme
			}
		}
		return 	<BottomTabBar 
							{...this.props}
							activeTintColor={this.theme.tintColor || this.props.activeTintColor}
						/>
	}
}
export default DynamitTabNavigation