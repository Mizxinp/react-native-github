import React from 'react'
import { View,Text,WebView,TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
import backPressComponent from '../common/backPressComponent'
import FavoriteDao from '../expand/storage/FavoriteDao'
 
const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678'

class DetailPage extends React.Component{
	constructor(props){
		super(props);
		this.params = this.props.navigation.state.params;
		const {title,url} = this.params
		this.state = {
			title:title || [],
			url:url,
			canGoBack:false,
		}
		this.backPress = new backPressComponent({backPress:()=>this.onBackPress()})
	}
	componentDidMount(){
		this.backPress.componentDidMount()
	}
	componentWillUnmount(){
		this.backPress.componentWillUnmount()
	}
	onBackPress = () => {
		this.onBack()
		return true
	}
	onBack = () => {
		if(this.state.canGoBack){
			this.webView.goBack()
		}else{
			NavigationUtil.goBack(this.props.navigation)
		}

	}
	
	
	onNavigationStateChange = (navState) => {
		this.setState({
			canGoBack:navState.canGoBack,
			url:navState.url
		})
	}
	render(){
		
		const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
		let navigationBar = <NavigationBar
			leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
			titleLayoutStyle={titleLayoutStyle}
			title={this.state.title}
			style={{backgroundColor:THEME_COLOR}}
		/>;
		
		return(
			<View style={{flex:1}}>
				{navigationBar}
				<WebView
						ref={webView => this.webView = webView}
						startInLoadingState={true}
						onNavigationStateChange={e => this.onNavigationStateChange(e)}
						source={{uri: this.state.url}}
				/>
			</View>
		)
	}
}

export default DetailPage