/**
 * @format
 */
import React, { Component } from 'react';
import { AppRegistry, YellowBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import store from './App/Redux/store';
import App from './App';
import { name as appName } from './app.json';

StatusBar.setBarStyle('light-content', true);

YellowBox.ignoreWarnings(['Require cycle:', 'Remote debugger']);

class Wrapper extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => Wrapper);
