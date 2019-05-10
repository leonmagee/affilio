/**
 * @format
 */
import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './App/Redux/store';
import App from './App';
import { name as appName } from './app.json';

class Wrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

YellowBox.ignoreWarnings(['Remote debugger', 'Require cycle:']);

AppRegistry.registerComponent(appName, () => Wrapper);
