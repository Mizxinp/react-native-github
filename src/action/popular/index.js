import Types from '../types'
import DataStore from '../../expand/storage/DataStore'
import { handleData,_projectModels } from '../ActionUtil'

// 获取最热数据的action
export function onLoadRefreshPopular(storeName,url,pageSize,favoriteDao){
	return dispatch => {
		dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
		let dataStore = new DataStore();
		dataStore.fetchData(url) //异步action与数据流
			.then(res=>{
				handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,res,pageSize,favoriteDao)
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
export function onLoadMorePupular(storeName,pageIndex,pageSize,dataArray=[],favoriteDao,callback){
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
					// projectModels:dataArray
				})
			}else{
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
				_projectModels(dataArray.slice(0, max),favoriteDao,data=>{
					dispatch({
						type:Types.POPULAR_LOAD_MORE_SUCCESS,
						storeName,
						pageIndex,
						projectModels:data
					})
				})
			}
		},500)
	}
}

export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
	return dispatch=>{
			//本次和载入的最大数量
			let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
			_projectModels(dataArray.slice(0, max),favoriteDao,data=>{
					dispatch({
							type: Types.FLUSH_POPULAR_FAVORITE,
							storeName,
							pageIndex,
							projectModels: data,
					})
			})
	}
}
