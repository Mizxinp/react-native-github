import React from 'react'
import { View,Text,StyleSheet,ActivityIndicator,Button,FlatList,RefreshControl } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import EventBus from 'react-native-event-bus'

import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/storage/FavoriteDao'
import FavoriteUtil from "../util/FavoriteUtil";
import { FLAG_STORAGE } from '../expand/storage/DataStore'
import EventTypes from '../util/EventTypes'


const THEME_COLOR = '#678'
const pageSize = 10
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class FavoritePage extends React.Component{
	constructor(props){
		super(props)
		this.tabNames = ['最热','趋势']
	}
	render(){
		const TabNavigation = createAppContainer(createMaterialTopTabNavigator({
			'Popular': {
				screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
				navigationOptions: {
						title: '最热',
				},
			},
			'Trending': {
				screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
				navigationOptions: {
						title: '趋势',
				},
			},
		},
		{
			tabBarOptions:{
				tabStyle:styles.tabStyle,
				upperCaseLabel:false,
				style:{
					backgroundColor:'#678',
					height:30,
				},
				indicatorStyle:styles.indicatorStyle,
				labelStyle:styles.labelStyle
			}
		}
		))

		const statusBar = {
			backgroundColor:THEME_COLOR,
			barStyle:'light-content',
		}
		const navigationBar = <NavigationBar 
			title={'收藏'}
			statusBar = {statusBar}
			style={{backgroundColor:THEME_COLOR}}
		/>
		return <View style={styles.container}>
						{navigationBar}
						<TabNavigation />
					</View>
			
		
	}
}

class FavoriteTab extends React.Component{
	constructor(props){
		super(props)
		const { flag } = this.props
		this.storeName = flag
		this.favoriteDao = new FavoriteDao(flag)
	}
	componentDidMount(){
		this.loadData(true)
		EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
			// handle the event
			if(data.to===2){
				this.loadData(false)
			}
		})
	}
	componentWillMount(){
		EventBus.getInstance().removeListener(this.listener);
	}
	loadData = ( isShowLoading ) => {
		const { onLoadFavoriteData } = this.props
		onLoadFavoriteData(this.storeName,isShowLoading)
	}

	//获取与当前页面有关的数据
	_store() {
		const {favorite} = this.props;
		let store = favorite[this.storeName];
		if (!store) {
				store = {
						items: [],
						isLoading: false,
						projectModels: [],//要显示的数据
				}
		}
		return store;
	}
	onFavorite = (item,isFavorite) => {
		FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
		if (this.storeName === FLAG_STORAGE.flag_popular) {
				EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
		} else {
				EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
		}
	}
	renderItem = (data) => {
		const item = data.item;
		const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
		return<Item 
						projectModel={item}
						onSelect={(callback)=>{
							NavigationUtil.goPage({
								projectModel:item,
								flag:this.storeName,
								callback
							},'DetailPage')
						}}
						onFavorite={(item,isFavorite)=>{
							this.onFavorite(item,isFavorite)
						}}
					/>
	}

	
	render(){
		// console.log('pp',this.props);
		
		const {tabLabel,popular } = this.props;

		let store = this._store()
		return(
			<View>
				{/* <Text>{tabLabel}</Text> */}
				<FlatList 
					data={store.projectModels}
					renderItem={data=>this.renderItem(data)}
					// keyExtractor = {item => '' + item}
					keyExtractor={item => "" + (item.item.id || item.item.fullName)}
					refreshControl={
						<RefreshControl 
							title={'loading'}
							titleColor={THEME_COLOR}
							color={THEME_COLOR}
							refreshing={store.isLoading}
							onRefresh={()=>{this.loadData(true)}}
							tintColor={THEME_COLOR}
						/>
					}
					
				/>
				<Toast 
					ref='toast'
					position={'center'}
				/>
			</View>
		)
	}
}

const mapStateToProps = state => ({
	favorite:state.favorite
})
const mapDispatchToProps = dispatch => ({
	onLoadFavoriteData:(storeName,isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName,isShowLoading)),
})
const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab) 

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tabStyle:{
		// minWidth:50
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white'
	},
	labelStyle: {
			fontSize: 13,
			margin: 0,
	},
	indicatorContainer: {
		alignItems: "center"
	},
	indicator: {
			color: 'red',
			margin: 10
	}
})

export default FavoritePage