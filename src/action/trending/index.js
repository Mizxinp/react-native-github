import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/storage/DataStore'
import { handleData } from '../ActionUtil'
// 获取趋势数据的action
export function onLoadRefreshTrending(storeName,url,pageSize){
	return dispatch => {
		dispatch({type:Types.TRENDING_REFRESH,storeName:storeName});
		let dataStore = new DataStore();
		dataStore.fetchData(url,FLAG_STORAGE.flag_trending) //异步action与数据流
			.then(res=>{
				handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch,storeName,res,pageSize)
			})
			.catch(error=>{
				dispatch({
					type:Types.TRENDING_REFRESH_FAIL,
					storeName,
					error
				})
				
			})
	}
}

// 上拉加载更多
export function onLoadMoreTrending(storeName,pageIndex,pageSize,dataArray=[],callback){
	return dispatch => {
		setTimeout(()=>{//模拟网络请求
			if((pageIndex-1)*pageSize >= dataArray.length){
				if(typeof callback === 'function'){
					callback('no more')
				}
				dispatch({
					type:Types.TRENDING_LOAD_MORE_FAIL,
					error:'no more',
					storeName,
					pageIndex:--pageIndex,
					projectModels:dataArray
				})
			}else{
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
				dispatch({
					type:Types.TRENDING_LOAD_MORE_SUCCESS,
					storeName,
					pageIndex,
					projectModels:dataArray.slice(0,max)
				})
			}
		},500)
	}
}

