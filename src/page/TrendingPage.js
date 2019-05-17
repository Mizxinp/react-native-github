import React from 'react'
import { View,Text,StyleSheet,ActivityIndicator,TouchableOpacity,Button,FlatList,RefreshControl,DeviceEventEmitter } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EventBus from 'react-native-event-bus'

import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog,{ TimeSpans } from '../common/TrendingDialog'
import FavoriteUtil from "../util/FavoriteUtil";
import { FLAG_STORAGE } from '../expand/storage/DataStore'
import FavoriteDao from '../expand/storage/FavoriteDao'
import EventTypes from '../util/EventTypes'
import {FLAG_LANGUAGE} from "../expand/storage/LanguageDao"
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

class TrendingPage extends React.Component{
	constructor(props){
		super(props)
		// this.tabNames = ['all','javascript','java','kotlin','c','c++']
		const { onLoadLanguage } = this.props
		onLoadLanguage(FLAG_LANGUAGE.flag_language);
		this.state={
			timeSpan:TimeSpans[0]
		}
		this.preKeys=[]
	}
	changeTab = ()=>{
		console.log('hahah',this.props);
		
		const tabs = {}
		const {keys,theme} = this.props;
		this.preKeys = keys;
		keys.forEach((item,index)=>{
			if(item.checked){
				tabs[`tab${index}`] = {
					//  这种方法可以传递相应的参数
					screen:props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}/>,
					navigationOptions:{
						title:item.name
					}
				}
			}
		})
		return tabs
	}
	renderTitleView = () => {
		return <View>
			<TouchableOpacity
				underlayColor='transparent'
				onPress={()=> this.dialog.show()}
			>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={{
							fontSize: 18,
							color: '#FFFFFF',
							fontWeight: '400'
					}}>趋势 {this.state.timeSpan.showText}</Text>
					<MaterialIcons
							name={'arrow-drop-down'}
							size={22}
							style={{color: 'white'}}
					/>
				</View>
			</TouchableOpacity>
		</View>
	}
	onSelectTimeSpan = (tab) => {
		this.dialog.dismiss()
		this.setState({
			timeSpan:tab
		})
		DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
	}
	renderTrendingDiolog = () => {
		return <TrendingDialog 
			ref={dialog=>this.dialog=dialog}
			onSelect={tab=>this.onSelectTimeSpan(tab)}
		/>
	}
	_tabNav = () => {
		const {theme} = this.props
		if(theme !== this.theme||!this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)){
			this.tabNav = createAppContainer(createMaterialTopTabNavigator(
				this.changeTab(),
				{
					tabBarOptions:{
						tabStyle:styles.tabStyle,
						upperCaseLabel:false,
						scrollEnabled:true,
						style:{
							backgroundColor:theme.themeColor,
							height:30
						},
						indicatorStyle:styles.indicatorStyle,
						labelStyle:styles.labelStyle
					},
					lazy:true
				},
				
			))
		}
		return this.tabNav
	}
	render(){
		const {keys,theme} = this.props
		const statusBar = {
			backgroundColor:theme.themeColor,
			barStyle:'light-content',
		}
		const navigationBar = <NavigationBar 
			titleView={this.renderTitleView()}
			statusBar = {statusBar}
			style={theme.styles.navBar}
		/>
		const TabNavigation = keys.length ? this._tabNav() : null
		return <View style={styles.container}>
						{navigationBar}
						{TabNavigation&&<TabNavigation />}
						{this.renderTrendingDiolog()}
					</View>
	}
}

const mapTrendingStateToProps = state => ({
	keys: state.language.languages,
	theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
	onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);


class TrendingTab extends React.Component{
	constructor(props){
		super(props)
		const { tabLabel } = this.props
		this.storeName = tabLabel
		// 同步收藏页和最热页的收藏信息
		this.isFavoriteChanged = false
	}
	componentDidMount(){
		this.loadData()
		this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
			this.timeSpan = timeSpan;
			this.loadData();
		});

		// 同步收藏页和趋势页
		EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
			this.isFavoriteChanged = true;
		});
		EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
				if (data.to === 1 && this.isFavoriteChanged) {
						this.loadData(null, true);
				}
		})
	}
	componentWillUnmount() {
		if (this.timeSpanChangeListener) {
				this.timeSpanChangeListener.remove();
		}
		EventBus.getInstance().removeListener(this.favoriteChangeListener);
		EventBus.getInstance().removeListener(this.bottomTabSelectListener);
	}
	loadData = ( loadMore,freshFavorite ) => {
		const { onLoadRefreshTrending,onLoadMoreTrending,onFlushTrendingFavorite } = this.props
		const url = this.getFetchUrl(this.storeName)
		let store = this._store()
		if(loadMore){
			onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{
				this.refs.toast.show('没有更多了')
			})
		}else if(freshFavorite){
			onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
		}else{
			onLoadRefreshTrending(this.storeName,url,pageSize,favoriteDao)
		}
	}

	//获取与当前页面有关的数据
	_store() {
		const {trending,timeSpan} = this.props;
		let store = trending[this.storeName];
		this.timeSpan = timeSpan
		// console.log('hahahah;',store);
		
		if (!store) {
				store = {
						items: [],
						isLoading: false,
						projectModels: [],//要显示的数据
						hideLoadingMore: true,//默认隐藏加载更多
				}
		}
		return store;
	}
	getFetchUrl = (key) => {
		return URL + key + '?' + this.timeSpan.searchText
	}

	renderItem = (data) => {
		const {theme} = this.props
		const item = data.item;
		return<TrendingItem 
						projectModel={item}
						onSelect={(callback)=>{
							NavigationUtil.goPage({
								projectModel:item,
								flag:FLAG_STORAGE.flag_trending,
								callback
							},'DetailPage')
						}}
						onFavorite={(item,isFavorite)=>{
							FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)
						}}
						theme={theme}
					/>
	}

	genIndicator() {
		return this._store().hideLoadingMore ? null :
			<View style={styles.indicatorContainer}>
					<ActivityIndicator
							style={styles.indicator}
					/>
					<Text>正在加载更多</Text>
			</View>
	}
	render(){
		// console.log('pp',this.props);
		
		const {theme} = this.props;

		let store = this._store()
		console.log('store',store);
		
		// return<Text>jjj</Text>
		return(
			<View>
				{/* <Text>{tabLabel}</Text> */}
				<FlatList 
					data={store.projectModels}
					renderItem={data=>this.renderItem(data)}
					keyExtractor = {item => '' + (item.item.id || item.item.fullName)}
					refreshControl={
						<RefreshControl 
							title={'loading'}
							titleColor={theme.themeColor}
							color={theme.themeColor}
							refreshing={store.isLoading}
							onRefresh={()=>{this.loadData()}}
							tintColor={theme.themeColor}
						/>
					}
					ListFooterComponent={()=>this.genIndicator()}
					onEndReached={() => {
						setTimeout(() => {
								if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
									// console.log('进入了');
									
										this.loadData(true);
										this.canLoadMore = false;
								}
						}, 100);
					}}
					onEndReachedThreshold={0.5}
					/* onMomentumScrollEnd={() => {
							this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
					}} */
					onContentSizeChange={() => {
						// console.log('更改了calLoad');
						
						this.canLoadMore = true // flatview内部组件布局完成以后会调用这个方法
				}}
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
	trending:state.trending
})
const mapDispatchToProps = dispatch => ({
	onLoadRefreshTrending:(storeName,url,pageSize,favoriteDao) => dispatch(actions.onLoadRefreshTrending(storeName,url,pageSize,favoriteDao)),
	onLoadMoreTrending:(storeName,pageIndex,pageSize,items,favoriteDao,callback) => dispatch(actions.onLoadMoreTrending(storeName,pageIndex,pageSize,items,favoriteDao,callback)),
	onFlushTrendingFavorite:(storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})
const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab) 

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
