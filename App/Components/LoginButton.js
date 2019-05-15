import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.brandPrimary,
    color: '#fff',
    fontFamily: 'Lato-Black',
    fontSize: 23,
    paddingVertical: 13,
    paddingHorizontal: 22,
    textAlign: 'center',
  },
});

class LoginButton extends Component {
  render() {
    const { toggleLoginModal } = this.props;
    return (
      <TouchableHighlight
        onPress={() => toggleLoginModal(true)}
        underlayColor="transparent"
      >
        <View style={styles.wrap}>
          <Text style={styles.button}>Login</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  loginModal: state.loginModal,
});

const mapActionsToProps = dispatch => ({
  toggleLoginModal(open) {
    dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(LoginButton);
