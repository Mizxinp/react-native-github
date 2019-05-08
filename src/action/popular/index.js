import Types from '../types'
import DataStore from '../../expand/storage/DataStore'
// 获取最热数据的action
export function onLoadPopularData(storeName,url){
	console.log('action中的url',url);
	
	return dispatch => {
		dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
		let dataStore = new DataStore();
		dataStore.fetchData(url) //异步action与数据流
			.then(res=>{
				console.log('有即如果');
				
				handleData(dispatch,storeName,res)
			})
			.catch(error=>{
				console.log('pupular错误',error);
				dispatch({
					type:Types.LOAD_POPULAR_FAIL,
					storeName,
					error
				})
				
			})
	}
}
function handleData(dispatch,storeName,res){
	dispatch({
		type:Types.LOAD_POPULAR_SUCCESS,
		items:res && res.data && res.data.items,
		storeName
	})
}