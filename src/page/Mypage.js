import React from 'react'
import { View,Text,Button } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil'

class MyPage extends React.Component{
	render(){
		return(
			<View>
				<Text>我的</Text>
				<Text onPress={()=>{
					NavigationUtil.goPage({
						navigation:this.props.navigation
					},'DetailPage')
				}}>跳转到详情页</Text>
				<Button 
					title='跳转到存储页'
					onPress={()=>{
						NavigationUtil.goPage({
							navigation:this.props.navigation
						},'DataStorageDemo')
					}} 
				/>
			</View>
		)
	}
}

export default MyPage