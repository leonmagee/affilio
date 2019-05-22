import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
// import LoginButton from './LoginButton';
// import Footer from './Footer';

const iconColor = '#BBB';

const styles = StyleSheet.create({
  titleWrap: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  profileIconsWrap: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    justifyContent: 'space-around',
  },
  profileIcon: {
    paddingTop: 11,
    paddingHorizontal: 4,
    borderWidth: 10,
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

class LoginType extends Component {
  changeUserType = type => {
    const { changeUserType, navigation } = this.props;
    changeUserType(type);
    if (type) {
      AsyncStorage.setItem('@UserType', 'business');
    } else {
      AsyncStorage.setItem('@UserType', 'user');
    }
    // navigateToPage(data) {
    //   this.props.goToMenuPage(data)
    //   this.props.navigation.navigate('MenuPage', data)
    // }
    const data = { name: 'Create Profile' };
    navigation.navigate('ProfileSettings', data);
  };

  render() {
    const { userType, loggedIn, navigation } = this.props;

    // let settings = <LoginButton />;
    // if (loggedIn) {
    const settings = (
      <>
        <View style={styles.titleWrap}>
          <Text style={defaults.formSubTitle}>Choose Account Type</Text>
        </View>
        <View style={styles.profileIconsWrap}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => this.changeUserType(1)}
          >
            <View>
              <View
                style={[
                  styles.profileIcon,
                  { borderColor: userType ? colors.brandPrimary : iconColor },
                ]}
              >
                <Icon
                  name="office-building"
                  size={80}
                  color={userType ? colors.brandPrimary : iconColor}
                />
              </View>
              <Text style={[styles.label, userType && styles.labelSelect]}>
                Business
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => this.changeUserType(0)}
          >
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
                  size={80}
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
    // }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>{settings}</View>
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
)(LoginType);
