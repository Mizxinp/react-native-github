import React from 'react'
import { View,Text } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil'

class WelcomePage extends React.Component{
	componentDidMount(){
		console.log('props',this.props.navigation);
		
		this.timer = setTimeout(()=>{
			NavigationUtil.resetToHomePage({
				navigation:this.props.navigation
			})
		},200)
	}
	componentWillUnmount(){
		this.timer && clearTimeout(this.timer)
	}
	render(){
		return(
			<View>
				<Text>欢迎页</Text>
			</View>
		)
	}
}

export default WelcomePage