import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';
import { firebaseError } from '../Utils/firebaseUtils';

const styles = StyleSheet.create({
  titleWrap: {
    paddingVertical: 7,
    alignItems: 'center',
  },
  socialLoginWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButtonWrap: {
    flex: 1,
  },
  socialButton: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Lato-Black',
  },
  signUpWrap: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  signUpTitle: {
    paddingTop: 20,
    paddingBottom: 25,
  },
  socialInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 15,
    paddingVertical: 15,
  },
});

class LoginStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailReq: false,
      password: '',
      passwordReq: false,
      signInLoading: false,
      signInFail: false,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  processLogin = async () => {
    this.setState({ signInFail: false, emailReq: false, passwordReq: false });
    const { email, password } = this.state;
    const { setCurrentUser } = this.props;
    console.log('login works', email, password);
    if (email === '') {
      this.setState({ emailReq: true });
    }
    if (password === '') {
      this.setState({ passwordReq: true });
    }

    if (email === '' || password === '') {
      return;
    }

    try {
      const signIn = await RNFirebase.auth().signInWithEmailAndPassword(
        email,
        password
      );
      console.log('did sign in work?', signIn);
      setCurrentUser(signIn.user);
    } catch (error) {
      const signInFail = firebaseError(error);
      this.setState({ signInFail });
    }

    // RNFirebase.auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .catch(function(error) {
    //     console.error('sign in fail!', error);
    //     // Handle Errors here.
    //     // const errorCode = error.code;
    //     // const errorMessage = error.message;
    //     // ...
    //   });
  };

  processSignUp = () => {
    // console.log('login works');
    const { navigation } = this.props;
    navigation.navigate('ChooseType');
  };

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
          // this.props.toggleLoginModal(false);
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
      // this.props.toggleLoginModal(false);
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

  render() {
    const {
      signInLoading,
      signInFail,
      email,
      password,
      emailReq,
      passwordReq,
    } = this.state;
    let loginActivity = <></>;
    if (signInLoading) {
      loginActivity = (
        <View style={defaults.processingWrap}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      );
    }
    let validationMessage = <></>;
    if (signInFail) {
      validationMessage = <Text style={defaults.warning}>{signInFail}</Text>;
    }
    return (
      <View style={defaults.mainWrap}>
        <View style={defaults.formWrap}>
          <TextInput
            name="email"
            style={[defaults.textInput, emailReq && defaults.required]}
            placeholder="Email Address"
            value={email}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'email');
            }}
          />
          <TextInput
            name="password"
            style={[defaults.textInput, passwordReq && defaults.required]}
            secureTextEntry
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'password');
            }}
          />
          {validationMessage}
          <View style={defaults.bigButtonWrap}>
            <TouchableHighlight
              style={[defaults.buttonStyle, defaults.blueButton]}
              onPress={this.processLogin}
              underlayColor={colors.brandPrimary}
            >
              <Text style={defaults.buttonText}>Login</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.socialLoginWrap}>
            <TouchableHighlight
              underlayColor="#4A66AD"
              onPress={this.facebookLogin}
              style={[
                styles.socialButtonWrap,
                { backgroundColor: '#4A66AD', marginRight: 10 },
              ]}
            >
              <View style={styles.socialInner}>
                <Icon name="facebook" size={20} color="#fff" />
                <Text style={styles.socialButton}>Facebook Login</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={colors.brandSecond}
              onPress={this.googleLogin}
              style={[
                styles.socialButtonWrap,
                { backgroundColor: colors.brandSecond, marginLeft: 10 },
              ]}
            >
              <View style={styles.socialInner}>
                <Icon name="google" size={20} color="#fff" />
                <Text style={styles.socialButton}>Google Login</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.signUpWrap}>
            <Text style={[defaults.title, styles.signUpTitle]}>Sign Up</Text>
            <View style={defaults.bigButtonWrap}>
              <TouchableHighlight
                style={[defaults.buttonStyle, defaults.blueButton]}
                onPress={this.processSignUp}
                underlayColor={colors.brandPrimary}
              >
                <Text style={defaults.buttonText}>Create Account</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>

        {loginActivity}
      </View>
    );
  }
}

// module.exports = LoginStart;

const mapStateToProps = state => ({
  // userType: state.userType,
  // loginModal: state.loginModal,
  loggedIn: state.loggedIn,
  // currentUser: state.currentUser,
});

const mapActionsToProps = dispatch => ({
  userLoggedIn(type) {
    dispatch({ type: 'LOGGED_IN', payload: type });
  },
  // changeUserType(type) {
  //   dispatch({ type: 'USER_TYPE', payload: type });
  // },
  setCurrentUser(user) {
    const newUser = dispatch({ type: 'CURRENT_USER', payload: user });
  },
  // setBusinessDetails(details) {
  //   dispatch({ type: 'BUSINESS_DETAILS', payload: details });
  // },
  // toggleLoginModal(open) {
  //   dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  // },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(LoginStart);
