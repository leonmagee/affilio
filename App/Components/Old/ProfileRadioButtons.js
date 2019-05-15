import React, { Component } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';

class Profile extends Component {
  // async componentDidMount() {
  //   const { changeUserType } = this.props;
  //   const value = await AsyncStorage.getItem('@UserType');
  //   if (value === 'business') {
  //     changeUserType(1);
  //   } else {
  //     changeUserType(0);
  //   }
  // }

  changeUserType = type => {
    const { changeUserType } = this.props;
    changeUserType(type);
    if (type) {
      AsyncStorage.setItem('@UserType', 'business');
    } else {
      AsyncStorage.setItem('@UserType', 'user');
    }
  };

  render() {
    const { userType } = this.props;
    const radioProps = [
      { label: 'User Account', value: 0 },
      { label: 'Business Account', value: 1 },
    ];
    const radioButtonGroup = (
      <RadioForm animation>
        {radioProps.map((obj, i) => (
          <RadioButton key={i} style={defaults.radioButtonInner}>
            <RadioButtonInput
              obj={obj}
              index={i}
              isSelected={userType === i}
              onPress={type => {
                this.changeUserType(type);
              }}
              // borderWidth={1}
              buttonInnerColor={colors.brandPrimary}
              buttonOuterColor={colors.brandPrimary}
              // buttonSize={40}
              // buttonOuterSize={80}
              // buttonStyle={{}}
              // buttonWrapStyle={{ marginLeft: 10 }}
            />
            <RadioButtonLabel
              obj={obj}
              index={i}
              labelHorizontal
              onPress={type => {
                console.log('my type is???', type);
                this.changeUserType(type);
              }}
              labelStyle={{ fontSize: 18, color: '#111' }}
              labelWrapStyle={{}}
            />
          </RadioButton>
        ))}
      </RadioForm>
    );

    const accountTypeSettings = (
      <View style={defaults.radioButtonWrap}>
        <Text style={defaults.formSubTitle}>Change Account Type</Text>
        {radioButtonGroup}
      </View>
    );

    return (
      <View style={defaults.mainWrap}>
        <Text style={defaults.title}>Profile Settings</Text>
        {accountTypeSettings}
      </View>
    );
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
)(Profile);
