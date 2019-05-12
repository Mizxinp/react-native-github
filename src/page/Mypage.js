import React from 'react'
import { View,Text,Button,StyleSheet } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil'
import { TouchableOpacity } from 'react-native-gesture-handler';
import  Ionicons  from 'react-native-vector-icons/Ionicons'
import  EvilIcons  from 'react-native-vector-icons/EvilIcons'

import NavigationBar from '../common/NavigationBar'

const THEME_COLOR = '#678'

class MyPage extends React.Component{
	getLeftButten(callBack){
		return <TouchableOpacity 
							style={{padding:8,paddingLeft:12}}
							onPress={callBack}
						>
							<Ionicons 
								name='md-arrow-back'
								size={26}
								style={{color:'white'}}
							/>
						</TouchableOpacity>
	}
	getRightButten(callBack){
		return <View style={{padding:5,marginRight:12}}>
			<TouchableOpacity
				onPress={()=>{}}
			>
			<View>
				<EvilIcons 
					name='search'
					size={24}
					style={{color:'white'}}
				/>
			</View>
			</TouchableOpacity>
		</View>
	}
	render(){
		const statusBar = {
			backgroundColor:THEME_COLOR,
			barStyle:'light-content',
		}
		const navigationBar = <NavigationBar 
			title={'我的'}
			statusBar = {statusBar}
			style={{backgroundColor:THEME_COLOR,marginTop:10}}
			leftButton={this.getLeftButten()}
			rightButton={this.getRightButten()}
		/>
		return(
			<View style={styles.container}>
				{navigationBar}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})

export default MyPage