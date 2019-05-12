import React from 'react'
import { View,Text,WebView,TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
import backPressComponent from '../common/backPressComponent'
 
const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678'

class DetailPage extends React.Component{
	constructor(props){
		super(props);
		// console.log('ha',this.props);
		
		this.params = this.props.navigation.state.params;
		const {projectModel} = this.params;
		this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;
		this.state = {
			title:title,
			url:this.url,
			canGoBack:false
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
			// console.log('nav返回',this.props.navigation);
			
			NavigationUtil.goBack(this.props.navigation)
		}

	}
	renderRightButton() {
		return (
			<View style={{flexDirection: 'row'}}>
				<TouchableOpacity
						onPress={() => {}}>
						<FontAwesome
								name={'star-o'}
								size={20}
								style={{color: 'white', marginRight: 10}}
						/>
				</TouchableOpacity>
				{ViewUtil.getShareButton(() => {
						let shareApp = share.share_app;
						ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
								console.log("result:" + code + message);
						});
				})}
			</View>
		)
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
			rightButton={this.renderRightButton()}
		/>;
		console.log('url',this.state.url);
		
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