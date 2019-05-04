import React from 'react'
import { View,Text } from 'react-native'
import {
	createStackNavigator,
	createSwitchNavigator,
	createMaterialTopTabNavigator,
	createBottomTabNavigator,
	createAppContainer
} from 'react-navigation'

import NavigationUtil from '../navigator/NavigationUtil';
import DynamitTabNavigation from '../navigator/DynamitTabNavigation'

class HomePage extends React.Component{
	
	render(){
		// 用于解决内层组件无法跳转到外层出现的问题
		NavigationUtil.navigation = this.props.navigation
		return(
			<DynamitTabNavigation />
			// <Text>hj</Text>
		)
	}
}

export default HomePage