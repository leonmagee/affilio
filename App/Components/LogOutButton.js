import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import RNFirebase from 'react-native-firebase';
import { colors } from '../Styles/variables';

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.brandSecond,
    color: '#fff',
    fontFamily: 'Lato-Black',
    fontSize: 23,
    paddingVertical: 13,
    paddingHorizontal: 22,
    textAlign: 'center',
  },
});

class LogOutButton extends Component {
  firebaseSignOut = () => {
    RNFirebase.auth().signOut();
    const { setCurrentUser } = this.props;
    setCurrentUser(false);
  };

  render() {
    const { toggleLoginModal } = this.props;
    return (
      <TouchableHighlight
        onPress={this.firebaseSignOut}
        underlayColor="transparent"
      >
        <View style={styles.wrap}>
          <Text style={styles.button}>Log Out</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  // loginModal: state.loginModal,
  loggedIn: state.loggedIn,
});

const mapActionsToProps = dispatch => ({
  // toggleLoginModal(open) {
  //   dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  // },
  setCurrentUser(user) {
    dispatch({ type: 'CURRENT_USER', payload: user });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(LogOutButton);
