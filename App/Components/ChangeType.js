import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import Footer from './Footer';

const iconColor = '#BBB';

const styles = StyleSheet.create({
  titleWrap: {
    marginTop: 20,
    paddingTop: 25,
    marginBottom: 10,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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

class ChangeType extends Component {
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
    const { userType, navigation } = this.props;

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

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Account Type</Text>
          {settings}
        </View>
        <Footer navigation={navigation} />
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
)(ChangeType);
