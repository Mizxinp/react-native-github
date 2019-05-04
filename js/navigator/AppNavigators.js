import {
	createStackNavigator,
	createSwitchNavigator,
	createMaterialTopTabNavigator,
	createBottomTabNavigator,
	createAppContainer
} from 'react-navigation'

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage'

const InitNavigator = createStackNavigator({
	WelcomePage: {
		screen: WelcomePage,
		navigationOptions: {
			header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
		}
	}
});

const MainNavigator = createStackNavigator({
	HomePage:{
		screen:HomePage,
		navigationOptions:{
			header:null
		}
	},
	DetailPage:{
		screen:DetailPage,
		navigationOptions:{
			// header:null
		}
	}
},/* {
	defaultNavigationOptions: {
		header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
	}
} */)

const AppNavigator = createSwitchNavigator({
	Init:InitNavigator,
	Main:MainNavigator,
},{
	navigationOptions:{
		header:null
	}
})

const AppContainer = createAppContainer(AppNavigator,{
	navigationOptions:{
		header:null
	}
})

export default AppContainer