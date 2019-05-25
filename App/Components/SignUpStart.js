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
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';

const styles = StyleSheet.create({
  // titleWrap: {
  //   paddingVertical: 7,
  //   alignItems: 'center',
  // },
  socialLoginWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButtonWrap: {
    flex: 1,
  },
  socialButton: {
    // padding: 15,
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Lato-Black',
    // textAlign: 'center',
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
    // paddingHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 15,
    paddingVertical: 15,
  },
  checkBoxWrap: {
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 25,
  },
  checkBoxStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  checkBoxLabel: {
    color: '#333',
  },
});

class SignUpStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      termsAgree: false,
      businessAgree: false,
      signInLoading: false,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  processLogin = () => {
    const { navigation } = this.props;
    const { username, email, password } = this.state;
    console.log('login works', username, email, password);
    RNFirebase.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.log('logged in with custom info?', result);
      })
      .catch(error => {
        console.error('we have an error?', error);
      });
    // navigation.navigate('ProfileSettings');
  };

  processSignUp = () => {
    // console.log('login works');
    const { navigation } = this.props;
    navigation.navigate('ProfileSettings');
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
    const { signInLoading, termsAgree, businessAgree } = this.state;
    let loginActivity = <View />;
    if (signInLoading) {
      loginActivity = (
        <View style={defaults.processingWrap}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      );
    }
    const { username, email, password, passwordRepeat } = this.state;
    return (
      <View style={defaults.mainWrap}>
        <View style={defaults.formWrap}>
          <TextInput
            name="username"
            style={defaults.textInput}
            placeholder="Username"
            value={username}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'username');
            }}
          />
          <TextInput
            name="email"
            style={defaults.textInput}
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
            style={defaults.textInput}
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'password');
            }}
          />
          <TextInput
            name="passwordRepeat"
            style={defaults.textInput}
            placeholder="Password Repeat"
            value={passwordRepeat}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'passwordRepeat');
            }}
          />
          <View style={defaults.bigButtonWrap}>
            <TouchableHighlight
              style={[defaults.buttonStyle, defaults.blueButton]}
              onPress={this.processLogin}
              underlayColor={colors.lightGray}
            >
              <Text style={defaults.buttonText}>Create Account</Text>
            </TouchableHighlight>
          </View>
          <View style={[defaults.titleWrap, { marginBottom: 20 }]}>
            <Text style={[defaults.title, { fontSize: 18 }]}>OR</Text>
          </View>
          <View style={styles.socialLoginWrap}>
            <TouchableHighlight
              underlayColor="transparent"
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
              underlayColor="transparent"
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
          <View style={styles.checkBoxWrap}>
            <CheckBox
              title="I agree to terms and conditions and privacy policy."
              checkedColor={colors.brandPrimary}
              size={35}
              containerStyle={styles.checkBoxStyle}
              textStyle={styles.checkBoxLabel}
              checked={termsAgree}
              onPress={() => this.setState({ termsAgree: !termsAgree })}
            />
            <CheckBox
              title="I verify that I am a represetative of this business."
              checkedColor={colors.brandPrimary}
              size={35}
              containerStyle={styles.checkBoxStyle}
              textStyle={styles.checkBoxLabel}
              checked={businessAgree}
              onPress={() => this.setState({ businessAgree: !businessAgree })}
            />
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
  setCurrentUser(user) {
    dispatch({ type: 'CURRENT_USER', payload: user });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(SignUpStart);
