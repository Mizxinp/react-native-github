import React from 'react'
import { View,Text,Button } from 'react-native'
import {connect} from 'react-redux'
import actions from '../action/index'
class TrendingPage extends React.Component{
	render(){
		const {navigation} = this.props
		return(
			<View>
				<Text>趋势</Text>
				<Button
					title='改变主题色'
					onPress={()=>{
						/* navigation.setParams({
							theme:{
								tintColor:'red',
								updateTime:new Date().getTime()
							}
						}) */
						this.props.onThemeChange('#096')
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

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage)
// export default TrendingPage