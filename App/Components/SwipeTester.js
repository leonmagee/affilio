import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
// import {
//   // createBottomTabNavigator,
//   createMaterialTopTabNavigator,
//   createMaterialBottomTabNavigator,
//   // createAppContainer,
// } from 'react-navigation';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

class Album extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'red',
        }}
      >
        <Text>Album</Text>
      </View>
    );
  }
}
const navigation = createMaterialBottomTabNavigator(
  {
    Album: { screen: Album },
    Library: { screen: Album },
    History: { screen: Album },
    Cart: { screen: Album },
  },
  {
    initialRouteName: 'Album',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
  }
);

class SwipeTester extends Component {
  // state = {  }
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'tomato', flex: 1 }}>
        <View>
          <Text>{navigation}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

module.exports = SwipeTester;
