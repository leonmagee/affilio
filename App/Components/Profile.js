import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import LoginButton from './LoginButton';

const iconColor = '#BBB';

const styles = StyleSheet.create({
  titleWrap: {
    paddingHorizontal: 20,
    marginTop: 25,
    paddingTop: 20,
    paddingBottom: 7,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  profileIconsWrap: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    justifyContent: 'space-around',
  },
  profileIcon: {
    // padding: 2,
    paddingTop: 11,
    paddingHorizontal: 4,
    borderWidth: 10,
    // borderColor: iconColor,
  },
  label: {
    textAlign: 'center',
    padding: 7,
    fontSize: 17,
    fontFamily: 'Lato-Bold',
    color: iconColor,
  },
  labelSelect: {
    color: colors.brandPrimary,
    fontFamily: 'Lato-Black',
  },
});

class Profile extends Component {
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
    const { userType, loggedIn } = this.props;

    let settings = <LoginButton />;
    if (loggedIn) {
      settings = (
        <>
          <View style={styles.titleWrap}>
            <Text style={defaults.formSubTitle}>Change Account Type</Text>
          </View>
          <View style={styles.profileIconsWrap}>
            <TouchableHighlight onPress={() => this.changeUserType(1)}>
              <View>
                <View
                  style={[
                    styles.profileIcon,
                    { borderColor: userType ? colors.brandPrimary : iconColor },
                  ]}
                >
                  <Icon
                    name="office-building"
                    size={100}
                    color={userType ? colors.brandPrimary : iconColor}
                  />
                </View>
                <Text style={[styles.label, userType && styles.labelSelect]}>
                  Business
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.changeUserType(0)}>
              <View>
                <View
                  style={[
                    styles.profileIcon,
                    {
                      borderColor: !userType ? colors.brandPrimary : iconColor,
                    },
                  ]}
                >
                  <Icon
                    name="account"
                    size={100}
                    color={!userType ? colors.brandPrimary : iconColor}
                  />
                </View>
                <Text style={[styles.label, !userType && styles.labelSelect]}>
                  User
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </>
      );
    }

    return (
      <View style={defaults.mainWrap}>
        <Text style={defaults.title}>Profile Settings</Text>
        {settings}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userType: state.userType,
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
)(Profile);
