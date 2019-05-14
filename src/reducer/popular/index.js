import Types from '../../action/types'

const initState = {
	
}

/* 
popular:{
	java:{
		items:[],
		isLoading:false
	},
	JavaScript:{
		items:[],
		isLoading:false
	}
} 
*/

// 设置动态store，和动态获取store(难点：storekey不固定)：使用[action.storeName]

export default function onAction(state=initState,action){
	switch(action.type){
		case Types.POPULAR_REFRESH_SUCCESS:		//下拉刷新成功
			return {
				...state,
				[action.storeName]:{
					...[action.storeName],
					items:action.items,	//原始数据
					projectModels:action.projectModels,	//此次需要展示的数据
					isLoading:false,
					hideLoadingMore:false,
					pageIndex:action.pageIndex
				}
			}
		case Types.POPULAR_REFRESH:	//下拉刷新
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					items:action.items,
					isLoading:true,
					hideLoadingMore:true,
				}
			}
		case Types.POPULAR_REFRESH_FAIL:	//下拉刷新失败
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					items:action.items,
					isLoading:false
				}
			}
		case Types.POPULAR_LOAD_MORE_SUCCESS:	//上拉加载更多成功
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					projectModels:action.projectModels,
					hideLoadingMore:false,
					pageIndex:action.pageIndex
				}
			}
		case Types.POPULAR_LOAD_MORE_FAIL:	//上拉加载更多失败
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					hideLoadingMore:true,
					pageIndex:action.pageIndex
				}
			}
		case Types.FLUSH_POPULAR_FAVORITE://刷新收藏状态
			return {
					...state,
					[action.storeName]: {
							...state[action.storeName],
							projectModels: action.projectModels,
					}
			};
		default:
			return state
	}
}