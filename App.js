import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
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
  unsubscribeFromAuth = null;

  constructor(props) {
    super(props);

    const { currentUser } = RNFirebase.auth();
    if (currentUser) {
      props.userLoggedIn(1);
    } else {
      props.userLoggedIn(0);
    }

    props.setCurrentUser(currentUser);

    // console.log('UUU', currentUser);

    this.state = {
      loading: true,
      signInLoading: false,
      // currentUser,
    };
  }

  async componentDidMount() {
    const { changeUserType, userLoggedIn } = this.props;
    const value = await AsyncStorage.getItem('@UserType');
    if (value === 'business') {
      changeUserType(1);
    } else {
      changeUserType(0);
    }
    this.setState({
      loading: false,
    });
    /**
     * The follow might not be necessary
     * watch the rest of the tutorial to see how helpful this is
     * I can prob just use redux for everything
     */
    this.unsubscribeFromAuth = RNFirebase.auth().onAuthStateChanged(user => {
      // console.log('login state is changing????', user);
      // this.setState({ user });
      if (user) {
        userLoggedIn(1);
      } else {
        userLoggedIn(0);
      }
    });
  }

  // setModalVisible(visible) {
  //   props.toggleLoginModal(1);
  //   // this.setState({ modalVisible: visible });
  // }

  facebookLogin = () => {
    this.setState({
      signInLoading: true,
    });
    return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(result => {
        console.log('this is a result?', result);
        if (!result.isCancelled) {
          console.log(
            `Login success with permissions: ${result.grantedPermissions.toString()}`
          );
          // get the access token
          return AccessToken.getCurrentAccessToken();
        }
        this.setState({
          // hide spinner when canceled
          signInLoading: false,
        });
      })
      .then(data => {
        console.log('we get some data????', data);
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
          this.setState({
            // modalVisible: false,
            // currentUser,
            signInLoading: false,
          });
          this.props.setCurrentUser(currentUser);
          this.props.toggleLoginModal(false);
        }
      })
      .catch(error => {
        console.log(`Login fail with error: ${error}`);
      });
  };

  googleLogin = async () => {
    this.setState({
      signInLoading: true,
    });
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure({ prompt: 'select_account' });

      const data = await GoogleSignin.signIn();

      const authProvider = RNFirebase.auth.GoogleAuthProvider;

      // authProvider.setCustomParameters({
      //   prompt: 'select_account',
      // });

      // create a new firebase credential with the token
      const credential = authProvider.credential(
        data.idToken,
        data.accessToken
      );

      // login with credential
      await RNFirebase.auth().signInWithCredential(credential);

      const newCurrentUser = await RNFirebase.auth().currentUser;

      this.setState({
        // modalVisible: false,
        // currentUser: newCurrentUser,
        signInLoading: false,
      });
      this.props.toggleLoginModal(false);
      this.props.setCurrentUser(newCurrentUser);

      // console.info(JSON.stringify(currentUser.toJSON()));
    } catch (e) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('sign in was canceled???');
      }
      console.error(e);
    }
  };

  firebaseSignOut = () => {
    RNFirebase.auth().signOut();
    const { setCurrentUser } = this.props;
    setCurrentUser(false);
  };

  render() {
    const { loading, signInLoading } = this.state;
    // const modalVisible = this.props.loginModal;
    const {
      currentUser,
      loginModal,
      loggedIn,
      userType,
      toggleLoginModal,
    } = this.props;
    let Router = RouterUser;
    if (userType && loggedIn) {
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
              toggleLoginModal(!loginModal);
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
            visible={loginModal}
          >
            <View style={defaults.modalWrapInner}>
              <View style={defaults.modalHeader}>
                <Text style={defaults.hiddenItem}>X</Text>
                <Text style={defaults.title}>Login</Text>
                <CloseIcon
                  toggle={() => {
                    toggleLoginModal(0);
                    // this.setModalVisible(!modalVisible);
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
  loginModal: state.loginModal,
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
});

const mapActionsToProps = dispatch => ({
  userLoggedIn(type) {
    dispatch({ type: 'LOGGED_IN', payload: type });
  },
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
  setCurrentUser(user) {
    dispatch({ type: 'CURRENT_USER', payload: user });
  },
  toggleLoginModal(open) {
    dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(App);
