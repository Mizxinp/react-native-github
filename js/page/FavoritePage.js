import React from 'react'
import { View,Text,Button } from 'react-native'
import {connect} from 'react-redux'
import actions from '../action/index'

class FavoritePage extends React.Component{
	render(){
		return(
			<View>
				<Text>收藏</Text>
				<Button
					title='改变主题色'
					onPress={()=>{
						/* navigation.setParams({
							theme:{
								tintColor:'red',
								updateTime:new Date().getTime()
							}
						}) */
						this.props.onThemeChange('#f00')
					}}
				/>
			</View>
		)
	}
}

const mapStateToProps = state =>({})
const mapDispatchToProps = dispatch => ({
	onThemeChange:theme=> dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps,mapDispatchToProps)(FavoritePage)