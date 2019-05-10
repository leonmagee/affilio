import React, { Component } from 'react';
import { Modal, Switch, StyleSheet, Text, View } from 'react-native';
import { signInWithGoogle } from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Router from './App/Router';
import { colors } from './App/variables';
import { defaults } from './App/defaultStyles';

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
                onPress={signInWithGoogle}
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
