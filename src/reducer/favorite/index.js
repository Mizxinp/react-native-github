import Types from '../../action/types'

const initState = {
	
}

/* 
state:{
	popular:{
		items:[],
		isLoading:false
	},
	trending:{
		items:[],
		isLoading:false
	}
} 
*/

// 设置动态store，和动态获取store(难点：storekey不固定)：使用[action.storeName]

export default function onAction(state=initState,action){
	switch(action.type){
		case Types.FAVORITE_LOAD_DATA:		//获取收藏数据
			return {
				...state,
				[action.storeName]:{
					...[action.storeName],
					isLoading:true,
				}
			}
		case Types.FAVORITE_LOAD_SUCCESS:	//下拉刷新成功
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					isLoading:false,
					projectModels: action.projectModels,//此次要展示的数据
				}
			}
		case Types.FAVORITE_LOAD_FAIL:	//下拉刷新失败
			return {
				...state,
				[action.storeName]:{
					...state[action.storeName],
					isLoading:false
				}
			}
		
		default:
			return state
	}
}