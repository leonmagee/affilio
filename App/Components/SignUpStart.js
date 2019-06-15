import React, { Component } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  // StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import RNFirebase from 'react-native-firebase';
import { CloseIcon } from './CloseIcon';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';
import { createUserProfileDocument, firebaseError } from '../Utils/utils';
import { termsAndConditions } from '../Utils/termsAndConditions';

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
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
    try {
      const { user } = await RNFirebase.auth().createUserWithEmailAndPassword(
        email,
        password
      );
      setCurrentUser(user);
      createUserProfileDocument(user, { displayName });
    } catch (error) {
      const createAccountFail = firebaseError(error);
      this.setState({ createAccountFail });
    }
  };

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
      modalVisible,
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
          containerStyle={defaults.checkBoxStyle}
          textStyle={defaults.checkBoxLabel}
          checked={businessAgree}
          onPress={() => this.setState({ businessAgree: !businessAgree })}
        />
      );
    }
    const checkboxSection = (
      <>
        <CheckBox
          title="I agree to terms and conditions and privacy policy."
          checkedColor={colors.brandPrimary}
          size={35}
          uncheckedColor={termsAgreeReq ? checkBoxRequired : checkBox}
          containerStyle={defaults.checkBoxStyle}
          textStyle={defaults.checkBoxLabel}
          checked={termsAgree}
          onPress={() => this.setState({ termsAgree: !termsAgree })}
        />
        {busCheckBox}
      </>
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
          <View style={defaults.bigButtonWrap}>
            <TouchableHighlight
              onPress={() => this.setModalVisible(!modalVisible)}
              underlayColor="transparent"
            >
              <Text style={defaults.privicyText}>
                View Terms and Conditions
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        {loginActivity}
        <Modal animationType="slide" visible={modalVisible} transparent>
          <ScrollView style={defaults.modalWrapInner}>
            <View style={defaults.modalHeader}>
              <CloseIcon
                toggle={() => {
                  this.setModalVisible(!modalVisible);
                }}
              />
              <Text style={defaults.title}>Terms of Use</Text>
              <Text style={defaults.hiddenItem}>X</Text>
            </View>
            {termsAndConditions}
          </ScrollView>
        </Modal>
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
