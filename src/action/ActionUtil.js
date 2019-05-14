import ProjectModel from '../model/ProjectModel';
import Utils from '../util/Utils'
export function handleData(actionType,dispatch,storeName,res,pageSize,favoriteDao){
	console.log('trendingfavoriteDao',favoriteDao);
	
	let fixItems = [];
	if (res && res.data) {
			if (Array.isArray(res.data)) {
					fixItems = res.data;
			} else if (Array.isArray(res.data.items)) {
					fixItems = res.data.items;
			}
	}
	//第一次要加载的数据
	let showItems = pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize)
	_projectModels(showItems,favoriteDao,projectModel=>{
		dispatch({
			type:actionType,
			items:fixItems,
			storeName,
			projectModels:projectModel,
			pageIndex:1
		})
	})
}

export async function _projectModels(showItems,favoriteDao,callback){
	let keys = [];
	try{
		keys= await favoriteDao.getFavoriteKeys()
	}catch(e){
		console.log(e);
	}
	let projectModels = [];
	for(let i=0,len=showItems.length;i<len;i++){
		projectModels.push(new ProjectModel(showItems[i],Utils.checkFavorite(showItems[i],keys)))
	}
	if(typeof callback === 'function'){
		callback(projectModels)
	}
}