import React from 'react'
import { View,Text,StyleSheet,ActivityIndicator,Button,FlatList,RefreshControl } from 'react-native'
import { createMaterialTopTabNavigator,createAppContainer } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'


const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
const pageSize = 10

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
	loadData = ( loadMore ) => {
		const { onLoadRefreshPopular,onLoadMorePopular } = this.props
		const url = this.getFetchUrl(this.storeName)
		let store = this._store()
		if(loadMore){
			onLoadMorePopular(this.storeName,++store.pageIndex,pageSize,store.items,callback=>{
				this.refs.toast.show('没有更多了')
			})
		}else{

			onLoadRefreshPopular(this.storeName,url,pageSize)
		}
	}

	//获取与当前页面有关的数据
	_store() {
		const {popular} = this.props;
		let store = popular[this.storeName];
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
		return URL + key + QUERY_STR
	}

	renderItem = (data) => {
		console.log('热热热',data);
		
		const item = data.item;
		return<PopularItem 
						item={item}
					/>
	}

	genIndicator() {
		console.log('h',this._store().hideLoadingMore);
		
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
				<Text>{tabLabel}</Text>
				<FlatList 
					data={store.projectModels}
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
	popular:state.popular
})
const mapDispatchToProps = dispatch => ({
	onLoadRefreshPopular:(storeName,url,pageSize) => dispatch(actions.onLoadRefreshPopular(storeName,url,pageSize)),
	onLoadMorePopular:(storeName,pageIndex,pageSize,items,callback) => dispatch(actions.onLoadMorePupular(storeName,pageIndex,pageSize,items,callback))
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
	indicatorContainer: {
		alignItems: "center"
	},
	indicator: {
			color: 'red',
			margin: 10
	}
})

export default PopularPage