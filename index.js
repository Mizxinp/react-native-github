/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import AppContainer from './js/navigator/AppNavigators'
import WelcomePage from './js/page/WelcomePage'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppContainer);
