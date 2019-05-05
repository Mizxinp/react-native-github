import Types from '../../action/types'

const initState = {
	theme:'blue'
}
export default function onAction(state=initState,action){
	switch(action.type){
		case Types.THEME_CHANGE:
			return {
				...state,
				theme:action.theme
			}
		default:
			return state
	}
}