import { AsyncStorage } from 'react-native'

const FAVORITE_KEY_PREFIX = 'favorite_'

class FavoriteDao{
	constructor(flag){
		this.favoritekey = FAVORITE_KEY_PREFIX + flag
	}

	// 保存收藏的项目
	saveFavoriteItem(key,value,callBack){
		AsyncStorage.setItem(key,value,(error,result)=>{
			if(!error){
				this.updateFavoriteKeys(key,true)
			}
		})
	}

	//更新
	updateFavoriteKeys(key,isAdd){
		AsyncStorage.getItem(this.favoritekey,(error,result)=>{
			if(!error){
				let favoriteKeys = [];
				if(result){
					favoriteKeys = JSON.parse(result)
				}
				let index = favoriteKeys.indexOf(key);
				if(isAdd){
					if(index === -1) favoriteKeys.push(key);
				}else {//如果是删除且key存在则将其从数值中移除
					if (index !== -1) favoriteKeys.splice(index, 1);
				}
				AsyncStorage.setItem(this.favoritekey, JSON.stringify(favoriteKeys));
				
			}
		})
	}

	// 获取收藏相关的key
	getFavoriteKeys(){
		return new Promise((resolve,reject)=>{
			AsyncStorage.getItem(this.favoritekey,(error,result)=>{
				if(!error){
					try{
						resolve(JSON.parse(result))
					}catch(e){
						reject(error)
					}
				}else{
					reject(error)
				}
			})
		})
	}

	// 取消收藏
	removeFavoriteItem(key){
		AsyncStorage.removeItem(key,(error,result)=>{
			if(!error){
				this.updateFavoriteKeys(key,false)
			}
		})
	}

	//获取所有收藏的项目
	getAllItems(){
		return new Promise((resolve, reject) => {
			this.getFavoriteKeys()
				.then((keys) => {
					let items = [];
					if (keys) {
						AsyncStorage.multiGet(keys, (err, stores) => {
							try {
								stores.map((result, i, store) => {
									let key = store[i][0];
									let value = store[i][1];
									if (value) items.push(JSON.parse(value));
								});
								resolve(items);
							} catch (e) {
									reject(e);
							}
						});
					} else {
						resolve(items);
					}
				})
				.catch((e) => {
					reject(e);
				})
		})
	}
}
export default FavoriteDao