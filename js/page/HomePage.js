import React from 'react'
import { View,Text,BackHandler } from 'react-native'
import {
	createStackNavigator,
	createSwitchNavigator,
	createMaterialTopTabNavigator,
	createBottomTabNavigator,
	createAppContainer,
	NavigationActions
} from 'react-navigation'
import { connect } from 'react-redux'

import NavigationUtil from '../navigator/NavigationUtil';
import DynamitTabNavigation from '../navigator/DynamitTabNavigation'

class HomePage extends React.Component{
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress',this.onBackPress)
	}
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress',this.onBackPress)
	}

	onBackPress = () => {
		const {dispatch,nav} = this.props;
		if(nav.routes[1].index === 0){
			return false
		}
		dispatch(NavigationActions.back());
		return true
	}
	render(){
		// 用于解决内层组件无法跳转到外层出现的问题
		NavigationUtil.navigation = this.props.navigation
		return(
			<DynamitTabNavigation />
			// <Text>hj</Text>
		)
	}
}

const mapStateToProps = state =>({
	nav:state.nav
})

export default connect(mapStateToProps)(HomePage)