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
		case Types.LOAD_POPULAR_SUCCESS:
			return {
				...state,
				[action.storeName]:{
					...[action.storeName],
					items:action.items,
					isLoading:false
				}
			}
		case Types.POPULAR_REFRESH:
			return {
				...state,
				[action.storeName]:{
					...[action.storeName],
					items:action.items,
					isLoading:true
				}
			}
			case Types.LOAD_POPULAR_FAIL:
			return {
				...state,
				[action.storeName]:{
					...[action.storeName],
					items:action.items,
					isLoading:false
				}
			}
		default:
			return state
	}
}