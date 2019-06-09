import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';

class LoadingScreen extends Component {
  componentDidMount = () => {
    const { navigation, userType } = this.props;
    if (userType) {
      navigation.navigate('Business');
    } else {
      navigation.navigate('User');
    }
  };

  render() {
    return <View style={{ backgroundColor: '#373738', flex: 1 }} />;
  }
}

const mapStateToProps = state => ({
  userType: state.userType,
});

module.exports = connect(mapStateToProps)(LoadingScreen);
