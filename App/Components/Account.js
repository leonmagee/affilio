import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { defaults } from '../Styles/defaultStyles';
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
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
    };
  }

  render() {
    const { navigation } = this.props;
    const { currentUser } = this.state;
    let userInfo = <></>;
    let helloText = <></>;
    if (currentUser.displayName) {
      helloText = `Hello, ${currentUser.displayName}!`;
    }
    if (currentUser) {
      userInfo = (
        <View style={styles.userInfoWrap}>
          <Text style={styles.userInfoText}>{helloText}</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Manage Account</Text>
          {userInfo}
          <LogOutButton />
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
});

module.exports = connect(mapStateToProps)(Account);
