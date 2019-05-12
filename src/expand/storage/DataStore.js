import { AsyncStorage } from 'react-native'
import Trending from 'GitHubTrending';

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore{
	/**
	 *获取数据
	 *@param url
	 *@param flag 判断是popular模块还是trending模块
	 */
	
	fetchData(url,flag){
		return new Promise((resolve,reject) => {
			this.fetchLocalData(url)
				.then((wrapData) =>{
					console.log('wrap,',wrapData);
					
					if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp)){
						resolve(wrapData)
					}else{
						this.fetchNetData(url,flag)
							.then((data)=>{
								resolve(this._wrapData(data))
							})
							.catch((err)=>{
								reject(err)
							})
					}
				})
				.catch((error)=>{
						this.fetchNetData(url,flag)
						.then((data)=>{
							resolve(this._wrapData(data))
						})
						.catch((err)=>{
							reject(err)
						})
				})
		})
	}

	// 保存数据
	saveData(url,data,callback){
		if(!data || !url) return;
		AsyncStorage.setItem(url,JSON.stringify(this._wrapData(data),callback))
	}

	// 获取本地数据
	fetchLocalData(url){
		return new Promise((resolve,reject) => {
			AsyncStorage.getItem(url,(error,result)=>{
				if(!error){
					try{
						resolve(JSON.parse(result));
					}catch(e){
						reject(e);
						console.log(e);
						
					}
				}else{
					reject(error);
					console.log('获取本地数据出错',erroe);
					
				}
			})
		})
	}

	// 获取网络数据
	 fetchNetData(url,flag){
		 return new Promise((resolve,reject)=>{
			 	if(flag !== FLAG_STORAGE.flag_trending){
				 	fetch(url)
					 .then((response)=>{
						 if(response.ok){
							 return response.json()
						 }else{
							 throw new Error('Network response was not ok')
						 }
					 })
					 .then((responseData)=>{
						 this.saveData(url,responseData);
						 resolve(responseData)
					 })
					 .catch((err)=>{
						 reject(err)
					 })
			 	}else{
					new Trending().fetchTrending(url)
						.then(items => {
								if (!items) {
										throw new Error('responseData is null');
								}
								this.saveData(url, items);
								resolve(items);
						})
						.catch(error => {
								reject(error);
					})
				 }
		 })
	 }
	 _wrapData(data){
		return {data: data, timestamp: new Date().getTime()};
	 }

	 // 有效期的检查
	static checkTimestampValid(timestamp) {
		const currentDate = new Date();
		const targetDate = new Date();
		targetDate.setTime(timestamp);
		if (currentDate.getMonth() !== targetDate.getMonth()) return false;
		if (currentDate.getDate() !== targetDate.getDate()) return false;
		if (currentDate.getHours() - targetDate.getHours() > 4) return false;//有效期4个小时
		// if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
		return true;
	}

}