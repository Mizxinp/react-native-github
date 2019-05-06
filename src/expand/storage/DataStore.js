import { AsyncStorage } from 'react-native'

export default class DataStore{
	// 获取数据
	fetchData(url){
		return new Promise((resolve,reject) => {
			this.fetchLocalData(url)
				.then((wrapData) =>{
					console.log('wrap,',wrapData);
					
					if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp)){
						resolve(wrapData)
					}else{
						this.fetchNetData(url)
							.then((data)=>{
								resolve(this._wrapData(data))
							})
							.catch((err)=>{
								reject(err)
							})
					}
				})
				.catch((error)=>{
						this.fetchNetData(url)
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
	 fetchNetData(url){
		 return new Promise((resolve,reject)=>{
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