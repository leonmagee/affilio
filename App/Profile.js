import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { defaults } from './defaultStyles';

class Profile extends Component {
  render() {
    return (
      <View style={defaults.mainWrap}>
        <Text style={defaults.title}>Your Profile Page</Text>
      </View>
    );
  }
}

module.exports = Profile;
