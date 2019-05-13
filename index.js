/**
 * @format
 */
import React, { Component } from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './App/Redux/store';
import App from './App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['Require cycle:', 'Remote debugger']);

class Wrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => Wrapper);
