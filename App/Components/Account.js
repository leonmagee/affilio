import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { defaults } from '../Styles/defaultStyles';
import LoginButton from './LoginButton';
import LogOutButton from './LogOutButton';
import Footer from './Footer';

const styles = StyleSheet.create({
  userInfoWrap: {
    marginTop: 20,
    paddingTop: 25,
    paddingBottom: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  userInfoText: {
    fontFamily: 'Lato-Bold',
    fontSize: 25,
    color: '#111',
  },
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
      console.log('here is the current user', currentUser);
      userInfo = (
        <View style={styles.userInfoWrap}>
          <Text style={styles.userInfoText}>
            Hello, {currentUser.displayName}!
          </Text>
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
