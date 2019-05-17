import { AsyncStorage } from 'react-native'
import {ThemeFlags} from "../../res/styles/ThemeFactory";
import ThemeFactory from "../../res/styles/ThemeFactory";

const THEME_KEY = 'theme_key'
class ThemeDao {
	// 获取主题
	getTheme(){
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(THEME_KEY, (error, result) => {
				if (error) {
						reject(error);
						return;
				}
				if (!result) {
						this.save(ThemeFlags.Default);
						result = ThemeFlags.Default;
				}
				resolve(ThemeFactory.createTheme(result))
			});
		});
	}
	//  保存主题
	save(themeFlag) {
		AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {
		}))
	}
}
export default ThemeDao