import React from 'react'
import { View,Text,StyleSheet,ActivityIndicator,TouchableOpacity,Button,FlatList,RefreshControl,DeviceEventEmitter } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog,{ TimeSpans } from '../common/TrendingDialog'


const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";

class TrendingPage extends React.Component{
	constructor(props){
		super(props)
		this.tabNames = ['all','javascript','java','kotlin','c','c++']
		this.state={
			timeSpan:TimeSpans[0]
		}
	}
	changeTab = ()=>{
		const tabs = {}
		this.tabNames.forEach((item,index)=>{
			tabs[`tab${index}`] = {
				//  这种方法可以传递相应的参数
				screen:props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
				navigationOptions:{
					title:item
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
		if(!this.tabNav){
			this.tabNav = createAppContainer(createMaterialTopTabNavigator(
				this.changeTab(),
				{
					tabBarOptions:{
						tabStyle:styles.tabStyle,
						upperCaseLabel:false,
						scrollEnabled:true,
						style:{
							backgroundColor:'#678',
							height:30
						},
						indicatorStyle:styles.indicatorStyle,
						labelStyle:styles.labelStyle
					}
				}
			))
		}
		return this.tabNav
	}
	render(){
		

		const statusBar = {
			backgroundColor:THEME_COLOR,
			barStyle:'light-content',
		}
		const navigationBar = <NavigationBar 
			titleView={this.renderTitleView()}
			statusBar = {statusBar}
			style={{backgroundColor:THEME_COLOR}}
		/>
		const TabNavigation = this._tabNav()
		return <View style={styles.container}>
						{navigationBar}
						<TabNavigation />
						{this.renderTrendingDiolog()}
					</View>
			
		
	}
}


class TrendingTab extends React.Component{
	constructor(props){
		super(props)
		const { tabLabel } = this.props
		this.storeName = tabLabel
	}
	componentDidMount(){
		this.loadData()
		this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
			this.timeSpan = timeSpan;
			this.loadData();
		});
	}
	componentWillUnmount() {
		if (this.timeSpanChangeListener) {
				this.timeSpanChangeListener.remove();
		}
	}
	loadData = ( loadMore ) => {
		const { onLoadRefreshTrending,onLoadMoreTrending } = this.props
		const url = this.getFetchUrl(this.storeName)
		let store = this._store()
		if(loadMore){
			onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize,store.items,callback=>{
				this.refs.toast.show('没有更多了')
			})
		}else{
			onLoadRefreshTrending(this.storeName,url,pageSize)
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
		const item = data.item;
		return<TrendingItem 
						item={item}
						onSelect={()=>{
							NavigationUtil.goPage({
								projectModel:item
							},'DetailPage')
						}}
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
		
		const {tabLabel,popular } = this.props;

		let store = this._store()
		console.log('store',store);
		
		// return<Text>jjj</Text>
		return(
			<View>
				{/* <Text>{tabLabel}</Text> */}
				<FlatList 
					data={store.projectModels}
					renderItem={data=>this.renderItem(data)}
					keyExtractor = {item => '' + (item.id || item.fullName)}
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
	onLoadRefreshTrending:(storeName,url,pageSize) => dispatch(actions.onLoadRefreshTrending(storeName,url,pageSize)),
	onLoadMoreTrending:(storeName,pageIndex,pageSize,items,callback) => dispatch(actions.onLoadMoreTrending(storeName,pageIndex,pageSize,items,callback))
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

export default TrendingPage