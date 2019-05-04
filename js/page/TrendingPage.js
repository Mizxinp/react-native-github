import React from 'react'
import { View,Text,Button } from 'react-native'

class TrendingPage extends React.Component{
	render(){
		const {navigation} = this.props
		return(
			<View>
				<Text>趋势</Text>
				<Button
					title='改变主题色'
					onPress={()=>{
						navigation.setParams({
							theme:{
								tintColor:'red',
								updateTime:new Date().getTime()
							}
						})
					}}
				/>
			</View>
		)
	}
}

export default TrendingPage