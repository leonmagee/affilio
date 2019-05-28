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
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { GoogleSignin, statusCodes } from 'react-native-google-signin';
// import { AccessToken, LoginManager } from 'react-native-fbsdk';
import RNFirebase from 'react-native-firebase';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';
import {
  createUserProfileDocument,
  firebaseError,
} from '../Utils/firebaseUtils';

const styles = StyleSheet.create({
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
  checkBoxWrap: {
    // borderTopWidth: 1,
    // borderColor: '#eee',
    // marginTop: 25,
  },
  checkBoxStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
    paddingTop: 13,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  checkBoxLabel: {
    color: '#333',
  },
});

class SignUpStart extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      displayNameReq: false,
      email: '',
      emailReq: false,
      password: '',
      passwordReq: false,
      passwordRepeat: '',
      passwordRepeatReq: false,
      termsAgree: false,
      termsAgreeReq: false,
      businessAgree: false,
      businessAgreeReq: false,
      signInLoading: false,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  processCreateAccount = async () => {
    this.setState({
      createAccountFail: false,
      displayNameReq: false,
      emailReq: false,
      passwordReq: false,
      passwordRepeatReq: false,
      termsAgreeReq: false,
      businessAgreeReq: false,
    });

    const { setCurrentUser, userType } = this.props;
    const {
      displayName,
      email,
      password,
      passwordRepeat,
      termsAgree,
      businessAgree,
    } = this.state;

    if (displayName === '') {
      this.setState({ displayNameReq: true });
    }
    if (email === '') {
      this.setState({ emailReq: true });
    }
    if (password === '') {
      this.setState({ passwordReq: true });
    }
    if (passwordRepeat === '') {
      this.setState({ passwordRepeatReq: true });
    }
    if (!termsAgree) {
      this.setState({ termsAgreeReq: true });
    }
    if (!businessAgree) {
      this.setState({ businessAgreeReq: true });
    }

    if (
      displayName === '' ||
      email === '' ||
      password === '' ||
      passwordRepeat === ''
    ) {
      return;
    }
    // two checkboxes for business, one for users
    if (userType) {
      if (!termsAgree || !businessAgree) {
        return;
      }
    } else if (!termsAgree) {
      return;
    }

    if (password !== passwordRepeat) {
      const createAccountFail = 'Passwords must match.';
      this.setState({ createAccountFail });
      return;
    }
    // console.log('login works', displayName, email, password);
    try {
      const { user } = await RNFirebase.auth().createUserWithEmailAndPassword(
        email,
        password
      );
      /**
       * These should be the same... it will be easier to only pass the
       * use document to redux - I'm just not sure how else I'm using
       * the current user...
       */
      setCurrentUser(user); // this needs to make account page work
      createUserProfileDocument(user, { displayName });
    } catch (error) {
      const createAccountFail = firebaseError(error);
      this.setState({ createAccountFail });
    }
  };

  // processSignUp = () => {
  //   // console.log('login works');
  //   const { navigation } = this.props;
  //   navigation.navigate('ProfileSettings');
  // };

  render() {
    const { signInLoading, termsAgree, businessAgree } = this.state;
    const { userType } = this.props;
    let loginActivity = <View />;
    if (signInLoading) {
      loginActivity = (
        <View style={defaults.processingWrap}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      );
    }
    const {
      displayName,
      email,
      password,
      passwordRepeat,
      displayNameReq,
      emailReq,
      passwordReq,
      passwordRepeatReq,
      termsAgreeReq,
      businessAgreeReq,
      createAccountFail,
    } = this.state;
    let validationMessage = <></>;
    if (createAccountFail) {
      validationMessage = (
        <Text style={defaults.warning}>{createAccountFail}</Text>
      );
    }
    const checkBox = '#bbb';
    const checkBoxRequired = colors.brandSecond;
    let busCheckBox = <></>;
    let placeholder = 'Display Name';
    if (userType) {
      placeholder = 'Company Name';
      busCheckBox = (
        <CheckBox
          title="I verify that I am a represetative of this business."
          checkedColor={colors.brandPrimary}
          size={35}
          uncheckedColor={businessAgreeReq ? checkBoxRequired : checkBox}
          containerStyle={styles.checkBoxStyle}
          textStyle={styles.checkBoxLabel}
          checked={businessAgree}
          onPress={() => this.setState({ businessAgree: !businessAgree })}
        />
      );
    }
    const checkboxSection = (
      <View style={styles.checkBoxWrap}>
        <CheckBox
          title="I agree to terms and conditions and privacy policy."
          checkedColor={colors.brandPrimary}
          size={35}
          uncheckedColor={termsAgreeReq ? checkBoxRequired : checkBox}
          containerStyle={styles.checkBoxStyle}
          textStyle={styles.checkBoxLabel}
          checked={termsAgree}
          onPress={() => this.setState({ termsAgree: !termsAgree })}
        />
        {busCheckBox}
      </View>
    );
    return (
      <View style={defaults.mainWrap}>
        <View style={defaults.formWrap}>
          <TextInput
            name="displayName"
            style={[defaults.textInput, displayNameReq && defaults.required]}
            placeholder={placeholder}
            value={displayName}
            autoCapitalize="none"
            required
            onChangeText={e => {
              this.updateTextInput(e, 'displayName');
            }}
          />
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
          <View style={defaults.inputGroup}>
            <TextInput
              name="password"
              // style={defaults.textInput}
              style={[
                defaults.textInput,
                { flex: 1, marginRight: 10 },
                passwordReq && defaults.required,
              ]}
              secureTextEntry
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
              style={[
                defaults.textInput,
                { flex: 1, marginLeft: 10 },
                passwordRepeatReq && defaults.required,
              ]}
              secureTextEntry
              placeholder="Password Repeat"
              value={passwordRepeat}
              autoCapitalize="none"
              required
              onChangeText={e => {
                this.updateTextInput(e, 'passwordRepeat');
              }}
            />
          </View>
          {checkboxSection}
          {validationMessage}
          <View style={defaults.bigButtonWrap}>
            <TouchableHighlight
              style={[defaults.buttonStyle, defaults.blueButton]}
              onPress={this.processCreateAccount}
              underlayColor={colors.brandPrimary}
            >
              <Text style={defaults.buttonText}>Create Account</Text>
            </TouchableHighlight>
          </View>
        </View>

        {loginActivity}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  userType: state.userType,
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
