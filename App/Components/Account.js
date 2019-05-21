import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import LoginButton from './LoginButton';
import LogOutButton from './LogOutButton';
import Footer from './Footer';

const styles = StyleSheet.create({
  // titleWrap: {
  //   marginTop: 20,
  // },
});

class Account extends Component {
  changeUserType = type => {
    const { changeUserType } = this.props;
    changeUserType(type);
    if (type) {
      AsyncStorage.setItem('@UserType', 'business');
    } else {
      AsyncStorage.setItem('@UserType', 'user');
    }
  };

  render() {
    const { currentUser, loggedIn, navigation } = this.props;
    let userInfo = <></>;
    if (currentUser) {
      userInfo = (
        <View style={styles.headerBar}>
          <Text style={styles.logo}>PIEC</Text>

          <View style={styles.headerUserInfo}>
            <Icon name="account" size={25} style={styles.headerIcon} />
            <Text style={styles.headerText}>{currentUser.displayName}</Text>
            <Text style={styles.headerDivider}>/</Text>
          </View>
        </View>
      );
    }

    let loginLogOut = <LoginButton />;

    if (loggedIn) {
      loginLogOut = <LogOutButton />;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Account Info</Text>
          {userInfo}
          {loginLogOut}
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // userType: state.userType,
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
});

const mapActionsToProps = dispatch => ({
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Account);
