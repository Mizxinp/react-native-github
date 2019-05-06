/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import RootNavigator from './src/navigator/AppNavigators'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
