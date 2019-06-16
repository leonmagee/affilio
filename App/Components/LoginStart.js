import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';
import {
  getUserDocument,
  createUserProfileDocument,
  firebaseError,
} from '../Utils/utils';

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
    marginLeft: 6,
    fontSize: 13,
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
    justifyContent: 'center',
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

  changeUserType = type => {
    const { changeUserType, navigation } = this.props;
    changeUserType(type);
    // if (type) {
    //   AsyncStorage.setItem('@UserType', 'business');
    // } else {
    //   AsyncStorage.setItem('@UserType', 'user');
    // }
    navigation.navigate('SignUpStart');
  };

  processLogin = async () => {
    this.setState({ signInFail: false, emailReq: false, passwordReq: false });
    const { email, password } = this.state;
    const { changeUserType, setCurrentUser } = this.props;
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
      const user = await getUserDocument(signIn.user._user.uid);
      setCurrentUser(user);
      // if (user.isBusiness) {
      //   changeUserType(1);
      // }
    } catch (error) {
      const signInFail = firebaseError(error);
      this.setState({ signInFail });
    }
  };

  facebookLogin = async () => {
    this.setState({
      signInLoading: true,
    });
    const { setCurrentUser } = this.props;

    try {
      const result = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);

      if (!result.isCancelled) {
        const data = await AccessToken.getCurrentAccessToken();

        if (data) {
          const credential = await RNFirebase.auth.FacebookAuthProvider.credential(
            data.accessToken
          );
          await RNFirebase.auth().signInWithCredential(credential);

          const newCurrentUser = await RNFirebase.auth().currentUser;

          setCurrentUser(newCurrentUser);

          const { displayName } = newCurrentUser._user;

          createUserProfileDocument(newCurrentUser, {
            displayName,
            isBusiness: false,
          });

          this.setState({
            signInLoading: false,
          });
        }
      } else {
        this.setState({
          signInLoading: false,
        });
      }
    } catch (error) {
      console.log(`Login fail with error: ${error}`);
    }
  };

  googleLogin = async () => {
    this.setState({
      signInLoading: true,
    });
    const { setCurrentUser } = this.props;
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure({ prompt: 'select_account' });

      const data = await GoogleSignin.signIn();

      const authProvider = RNFirebase.auth.GoogleAuthProvider;

      // create a new firebase credential with the token
      const credential = authProvider.credential(
        data.idToken,
        data.accessToken
      );

      // login with credential
      await RNFirebase.auth().signInWithCredential(credential);

      const newCurrentUser = await RNFirebase.auth().currentUser;

      this.setState({
        signInLoading: false,
      });
      setCurrentUser(newCurrentUser);

      const { displayName } = newCurrentUser._user;
      createUserProfileDocument(newCurrentUser, {
        displayName,
        isBusiness: false,
      });
    } catch (e) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('sign in was canceled');
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
          <ActivityIndicator size="large" color={colors.activity} />
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
                // onPress={this.processSignUp}
                onPress={() => this.changeUserType(0)}
                underlayColor={colors.brandPrimary}
              >
                <Text style={defaults.buttonText}>Create User Account</Text>
              </TouchableHighlight>
            </View>
            <View style={defaults.bigButtonWrap}>
              <TouchableHighlight
                style={[defaults.buttonStyle, defaults.redButton]}
                onPress={() => this.changeUserType(1)}
                underlayColor={colors.brandSecond}
              >
                <Text style={defaults.buttonText}>Create Business Account</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>

        {loginActivity}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
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
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(LoginStart);
