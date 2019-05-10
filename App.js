import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { GoogleSignin } from 'react-native-google-signin';
import RNFirebase from 'react-native-firebase';
import RouterUser from './App/Components/RouterUser';
import RouterBusiness from './App/Components/RouterBusiness';
import { colors } from './App/Styles/variables';
import { defaults } from './App/Styles/defaultStyles';

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#000',
    height: 50,
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
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      loading: true,
      signInLoading: false,
      currentUser: RNFirebase.auth().currentUser,
    };
    // const { currentUser } = RNFirebase.auth();
    // console.log('xyz', currentUser.displayName);
  }

  async componentDidMount() {
    const { changeUserType } = this.props;
    const value = await AsyncStorage.getItem('@UserType');
    if (value === 'business') {
      changeUserType(1);
    } else {
      changeUserType(0);
    }
    this.setState({
      loading: false,
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  googleLogin = async () => {
    this.setState({
      signInLoading: true,
    });
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

      const newCurrentUser = await RNFirebase.auth().currentUser;

      this.setState({
        modalVisible: false,
        currentUser: newCurrentUser,
        signInLoading: false,
      });

      // console.info(JSON.stringify(currentUser.toJSON()));
    } catch (e) {
      console.error(e);
    }
  };

  firebaseSignOut = () => {
    RNFirebase.auth().signOut();
    this.setState({ currentUser: false });
  };

  render() {
    const { currentUser, loading, modalVisible, signInLoading } = this.state;
    const { userType } = this.props;
    let Router = RouterUser;
    if (userType) {
      Router = RouterBusiness;
    }
    let mainContent = (
      <View style={defaults.processingWrap}>
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
    if (!loading) {
      let userInfo = (
        <View style={styles.headerBar}>
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.headerText}>LOGIN</Text>
          </TouchableHighlight>
        </View>
      );
      if (currentUser) {
        userInfo = (
          <View style={styles.headerBar}>
            <View style={styles.headerUserInfo}>
              <Icon
                name="account"
                size={25}
                color="#fff"
                style={styles.headerIcon}
                // style={defaults.closeIcon}
              />
              <Text style={styles.headerText}>{currentUser.displayName}</Text>
            </View>
            <TouchableHighlight onPress={this.firebaseSignOut}>
              <Text style={styles.headerText}>LOGOUT</Text>
            </TouchableHighlight>
          </View>
        );
      }

      let loginActivity = <View />;
      if (signInLoading) {
        loginActivity = (
          <View style={defaults.processingWrap}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
          </View>
        );
      }

      mainContent = (
        <View style={{ flex: 1 }}>
          {userInfo}
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
                  onPress={this.googleLogin}
                >
                  <Text style={defaults.redButton}>Sign In With Google</Text>
                </TouchableHighlight>
                {loginActivity}
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

    return <View style={{ flex: 1 }}>{mainContent}</View>;
  }
}

const mapStateToProps = state => ({
  userType: state.userType,
});

const mapActionsToProps = dispatch => ({
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(App);
