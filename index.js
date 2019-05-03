/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import Homepage from './App/Homepage';
// import Router from './App/Router';
// import AppMain from './AppMain';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['Remote debugger', 'Require cycle:']);

AppRegistry.registerComponent(appName, () => Homepage);
