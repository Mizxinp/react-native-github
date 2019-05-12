export function handleData(actionType,dispatch,storeName,res,pageSize){
	let fixItems = [];
	if (res && res.data) {
			if (Array.isArray(res.data)) {
					fixItems = res.data;
			} else if (Array.isArray(res.data.items)) {
					fixItems = res.data.items;
			}
	}
	dispatch({
		type:actionType,
		// items:res && res.data && res.data.items,
		items:fixItems,
		storeName,
		projectModels:pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),//第一次要加载的数据
		pageIndex:1
	})
}