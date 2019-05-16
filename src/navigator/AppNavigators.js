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
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from '../page/SortKeyPage'

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
	WebViewPage:{
		screen:WebViewPage,
		navigationOptions:{
			header:null
		}
	},
	AboutPage:{
		screen:AboutPage,
		navigationOptions:{
			header:null
		}
	},
	AboutMePage:{
		screen:AboutMePage,
		navigationOptions:{
			header:null
		}
	},
	CustomKeyPage:{
		screen:CustomKeyPage,
		navigationOptions:{
			header:null
		}
	},
	SortKeyPage:{
		screen:SortKeyPage,
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