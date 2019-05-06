import React from 'react'
import { View,Text,StyleSheet,Button } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil'

class PopularPage extends React.Component{
	constructor(props){
		super(props)
		this.tabNames = ['java','javascript','react','ios','android','react-native']
	}
	changeTab = ()=>{
		const tabs = {}
		this.tabNames.forEach((item,index)=>{
			tabs[`tab${index}`] = {
				//  这种方法可以传递相应的参数
				screen:props => <PopularTab {...props} tabLabel={item}/>,
				navigationOptions:{
					title:item
				}
			}
		})
		return tabs
	}
	render(){
		const TabNavigation = createAppContainer(createMaterialTopTabNavigator(
			this.changeTab(),
			{
				tabBarOptions:{
					tabStyle:styles.tabStyle,
					upperCaseLabel:false,
					scrollEnabled:true,
					style:{
						backgroundColor:'#678'
					},
					indicatorStyle:styles.indicatorStyle,
					labelStyle:styles.labelStyle
				}
			}
		))
		return(
			<TabNavigation />
		)
	}
}


class PopularTab extends React.Component{
	render(){
		const {tabLabel } = this.props;
		return(
			<View>
				<Text>{tabLabel}</Text>
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
	tabStyle:{
		minWidth:50
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white'
	},
	labelStyle: {
			fontSize: 13,
			margin: 0,
	},
})

export default PopularPage