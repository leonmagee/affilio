import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { GoogleSignin } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase';
import RouterUser from './App/Components/RouterUser';
import RouterBusiness from './App/Components/RouterBusiness';
import { colors } from './App/Styles/variables';
import { defaults } from './App/Styles/defaultStyles';
import { CloseIcon } from './App/Components/CloseIcon';

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#000',
    height: 85,
    paddingBottom: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  constructor(props) {
    super(props);

    const { currentUser } = RNFirebase.auth();
    if (currentUser) {
      props.userLoggedIn(1);
    } else {
      props.userLoggedIn(0);
    }

    this.state = {
      modalVisible: false,
      loading: true,
      signInLoading: false,
      currentUser,
    };
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

  facebookLogin = () =>
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(result => {
        if (!result.isCancelled) {
          console.log(
            `Login success with permissions: ${result.grantedPermissions.toString()}`
          );
          // get the access token
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(data => {
        if (data) {
          // create a new firebase credential with the token
          const credential = RNFirebase.auth.FacebookAuthProvider.credential(
            data.accessToken
          );
          // login with credential
          return RNFirebase.auth().signInWithCredential(credential);
        }
      })
      .then(currentUser => {
        if (currentUser) {
          console.info(JSON.stringify(currentUser.toJSON()));
        }
      })
      .catch(error => {
        console.log(`Login fail with error: ${error}`);
      });

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
              <View style={defaults.modalHeader}>
                <Text style={defaults.hiddenItem}>X</Text>
                <Text style={defaults.title}>Login</Text>
                <CloseIcon
                  toggle={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                />
              </View>
              <View style={[defaults.formWrapModal, defaults.buttonWrap]}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.googleLogin}
                >
                  <Text style={[defaults.button, defaults.loginButton]}>
                    Sign In With Email
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.facebookLogin}
                >
                  <Text
                    style={[
                      defaults.button,
                      defaults.blueButton,
                      defaults.loginButton,
                    ]}
                  >
                    Sign In With Facebook
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.googleLogin}
                >
                  <Text
                    style={[
                      defaults.button,
                      defaults.redButton,
                      defaults.loginButton,
                    ]}
                  >
                    Sign In With Google
                  </Text>
                </TouchableHighlight>
                {loginActivity}
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
  userLoggedIn(type) {
    dispatch({ type: 'LOGGED_IN', payload: type });
  },
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(App);
