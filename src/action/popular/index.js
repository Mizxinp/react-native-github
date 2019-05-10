import Types from '../types'
import DataStore from '../../expand/storage/DataStore'
// 获取最热数据的action
export function onLoadRefreshPopular(storeName,url,pageSize){
	return dispatch => {
		dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
		let dataStore = new DataStore();
		dataStore.fetchData(url) //异步action与数据流
			.then(res=>{
				handleData(dispatch,storeName,res,pageSize)
			})
			.catch(error=>{
				console.log('pupular错误',error);
				dispatch({
					type:Types.POPULAR_REFRESH_FAIL,
					storeName,
					error
				})
				
			})
	}
}

// 上拉加载更多
export function onLoadMorePupular(storeName,pageIndex,pageSize,dataArray=[],callback){
	return dispatch => {
		setTimeout(()=>{//模拟网络请求
			if((pageIndex-1)*pageSize >= dataArray.length){
				if(typeof callback === 'function'){
					callback('no more')
				}
				dispatch({
					type:Types.POPULAR_LOAD_MORE_FAIL,
					error:'no more',
					storeName,
					pageIndex:--pageIndex,
					projectModels:dataArray
				})
			}else{
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
				dispatch({
					type:Types.POPULAR_LOAD_MORE_SUCCESS,
					storeName,
					pageIndex,
					projectModels:dataArray.slice(0,max)
				})
			}
		},500)
	}
}

function handleData(dispatch,storeName,res,pageSize){
	let fixItems = [];
	if(res && res.data && res.data.items){
		fixItems =res.data.items
	}
	dispatch({
		type:Types.POPULAR_REFRESH_SUCCESS,
		// items:res && res.data && res.data.items,
		items:fixItems,
		storeName,
		projectModels:pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),//第一次要加载的数据
		pageIndex:1
	})
}