import React, { Component } from 'react';
import { Modal, Switch, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { GoogleSignin } from 'react-native-google-signin';
import RNFirebase from 'react-native-firebase';
import Router from './App/Router';
import { colors } from './App/variables';
import { defaults } from './App/defaultStyles';

// Calling this function will open Google for login.
export const googleLogin = async () => {
  try {
    // Add any configuration settings here:
    await GoogleSignin.configure();

    const data = await GoogleSignin.signIn();

    // create a new firebase credential with the token
    const credential = RNFirebase.auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken
    );
    // login with credential
    const currentUser = await RNFirebase.auth().signInWithCredential(
      credential
    );

    console.info(JSON.stringify(currentUser.toJSON()));
  } catch (e) {
    console.error(e);
  }
};

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Lato-Bold',
  },
});

class AppMain extends Component {
  constructor() {
    super();
    this.state = {
      businessAccount: false,
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  toggleUserType = () => {
    const { businessAccount } = this.state;
    this.setState({
      businessAccount: !businessAccount,
    });
  };

  render() {
    const { businessAccount, modalVisible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerBar}>
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.headerText}>LOGIN</Text>
          </TouchableHighlight>
          <Switch
            trackColor={{
              true: colors.brandPrimary,
              false: colors.brandSecond,
            }}
            ios_backgroundColor={colors.brandSecond}
            onValueChange={this.toggleUserType}
            value={businessAccount}
          />
        </View>
        <Router />
        <Modal
          sytle={{ flex: 1 }}
          animationType="slide"
          transparent
          visible={modalVisible}
        >
          <View style={defaults.modalWrapInner}>
            <Text style={defaults.subTitle}>Login</Text>
            <View style={defaults.formWrapModal}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={googleLogin}
              >
                <Text style={defaults.redButton}>Sign In With Google</Text>
              </TouchableHighlight>
              <View style={defaults.closeIconWrap}>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                  underlayColor="transparent"
                >
                  <Icon
                    name="close-circle"
                    size={40}
                    color={colors.brandSecond}
                    style={defaults.closeIcon}
                  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

module.exports = AppMain;
