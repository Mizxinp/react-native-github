import Types from '../types'
import ThemeDao from '../../expand/storage/ThemeDao'

export function onThemeChange(theme){
	return { type:Types.THEME_CHANGE,theme:theme }
}

// 初始化主题
export function onThemeInit() {
	return dispatch => {
			new ThemeDao().getTheme().then((data) => {
					dispatch(onThemeChange(data))
			})
	}
}

// 显示自定义主题浮层
export function onShowCustomThemeView(show) {
	return {type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show};
}