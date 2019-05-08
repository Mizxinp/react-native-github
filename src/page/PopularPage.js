import React from 'react'
import { View,Text,StyleSheet,Button,FlatList,RefreshControl } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action/index'

const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
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
				screen:props => <PopularTabPage {...props} tabLabel={item}/>,
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
	constructor(props){
		super(props)
		const { tabLabel } = this.props
		this.storeName = tabLabel
	}
	componentDidMount(){
		this.loadData()
	}
	loadData = () => {
		const { onLoadPopularData } = this.props
		const url = this.getFetchUrl(this.storeName)
		console.log('rrr',url);
		
		onLoadPopularData(this.storeName,url)
	}
	getFetchUrl = (key) => {
		console.log('url',URL + key + QUERY_STR);
		
		return URL + key + QUERY_STR
	}

	renderItem = (data) => {
		console.log('item说，',data);
		
		const item = data.item;
		return<View style={{marginBottom:10}}>
			<Text style={{backgroundColor:'#faa'}}>
				{JSON.stringify(item)}
			</Text>
		</View>
	}
	render(){
		// console.log('pp',this.props);
		
		const {tabLabel,popular } = this.props;

		let store = popular[this.storeName]	//动态获取state
		console.log('stor',store);
		
		if(!store){
			store = {
				items:[],
				isLoading:false
			}
		}
		// return<Text>jjj</Text>
		return(
			<View>
				<Text>{tabLabel}</Text>
				<FlatList 
					data={store.items}
					renderItem={data=>this.renderItem(data)}
					keyExtractor = {item => '' + item.id}
					refreshControl={
						<RefreshControl 
							title={'loading'}
							titleColor={THEME_COLOR}
							color={THEME_COLOR}
							refreshing={store.isLoading}
							onRefresh={()=>{this.loadData()}}
							tintColor={THEME_COLOR}
						/>
					}
				/>
			</View>
		)
	}
}

const mapStateToProps = state => ({
	popular:state.popular
})
const mapDispatchToProps = dispatch => ({
	onLoadPopularData:(storeName,url) => dispatch(actions.onLoadPopularData(storeName,url))
})
const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab) 

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