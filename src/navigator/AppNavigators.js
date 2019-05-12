import {
	createStackNavigator,
	createSwitchNavigator,
	createAppContainer
} from 'react-navigation'

import { connect } from 'react-redux'
import {createReactNavigationReduxMiddleware,  createReduxContainer} from 'react-navigation-redux-helpers';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage'
import DataStorageDemoPage from'../page/DataStorageDemoPage'

export const rootCom = 'Init'

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
			header:null
		}
	},
	DataStorageDemo:{
		screen:DataStorageDemoPage,
		navigationOptions:{
			header:null
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

export const RootNavigator = createAppContainer(AppNavigator,{
	navigationOptions:{
		header:null
	}
})

/* 
	配置navigation
 */

export const middleware = createReactNavigationReduxMiddleware(
	// 'root',
	state => state.nav
);

const AppWithNavigationState = createReduxContainer(RootNavigator);

const mapStateToProps = state => ({
	state: state.nav,//v2
});
export default connect(mapStateToProps)(AppWithNavigationState);