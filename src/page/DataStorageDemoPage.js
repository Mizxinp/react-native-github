import React from 'react'
import {View,TextInput,Button,Text,StyleSheet} from 'react-native'

import DataStore from '../expand/storage/DataStore'

class DataStorageDemo extends React.Component{
	constructor(props){
		super(props)
		this.state={
			showText:''
		}
		this.dataStore = new DataStore()
	}
	loadData(){
		let url = `https://api.github.com/search/repositories?q=${this.value}`
		this.dataStore.fetchData(url)
			.then(data=>{
				let showData = `初次数据加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
				this.setState({
					showText:showData
				})
				.catch(err=>{
					err && console.log(error.toString());
					
				})
			})
	}
	render(){
		return(
			<View>
				<TextInput 
					style={styles.input}
					onChangeText={text=>{
						this.value = text
					}}
				/>
				<Text
					onPress={()=>{
						this.loadData()
					}}
				>获取</Text>
				<Text>
					{this.state.showText}
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	input:{
		height:30,
		borderColor:'#666',
		borderWidth:1,
		
	}
}) 

export default DataStorageDemo