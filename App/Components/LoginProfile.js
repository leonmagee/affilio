import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFirebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';

const firestore = RNFirebase.firestore();

class LoginProfile extends Component {
  constructor(props) {
    super(props);
    const { businessDetails } = props;

    this.state = {
      address: businessDetails.address,
      address2: businessDetails.address2,
      city: businessDetails.city,
      state: businessDetails.state,
      zip: businessDetails.zip,
      country: businessDetails.country,
      phone: businessDetails.phone,
      email: businessDetails.email,
      website: businessDetails.website,
      facebook: businessDetails.facebook,
      twitter: businessDetails.twitter,
      instagram: businessDetails.instagram,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  updateBusinessInfo = () => {
    const {
      address,
      address2,
      city,
      state,
      zip,
      country,
      phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
    } = this.state;
    const { currentUser } = this.props;
    const busDetails = {
      address,
      address2,
      city,
      state,
      country,
      zip,
      phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
    };
    const busDetailsSave = JSON.stringify(busDetails);
    if (address && city && state && zip && phone) {
      AsyncStorage.setItem('@BusinessDetails', busDetailsSave);
    }
    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .set(busDetails)
      .then(result => {
        // console.log(result);
      })
      .catch(error => {
        console.error('errors?', error);
      });
  };

  render() {
    const { userType } = this.props;
    const {
      address,
      address2,
      city,
      state,
      zip,
      country,
      phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
    } = this.state;

    let businessSettings = <></>;
    if (userType) {
      businessSettings = (
        <ScrollView>
          <View style={defaults.titleWrap}>
            <Text style={defaults.formSubTitle}>Business Details</Text>
          </View>
          <View style={defaults.formWrap}>
            <TextInput
              name="address"
              style={defaults.textInput}
              placeholder="Address Line 1"
              value={address}
              required
              onChangeText={e => {
                this.updateTextInput(e, 'address');
              }}
            />
            <TextInput
              name="address2"
              style={defaults.textInput}
              placeholder="Address Line 2"
              value={address2}
              required
              onChangeText={e => {
                this.updateTextInput(e, 'address2');
              }}
            />
            <View style={defaults.inputGroup}>
              <TextInput
                name="city"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="City"
                value={city}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'city');
                }}
              />
              <TextInput
                name="state"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="State"
                value={state}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'state');
                }}
              />
            </View>
            <View style={defaults.inputGroup}>
              <TextInput
                name="zip"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="Zip / Postal Code"
                value={zip}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'zip');
                }}
              />
              <TextInput
                name="country"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="Country"
                value={country}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'country');
                }}
              />
            </View>
            <View style={defaults.inputGroup}>
              <TextInput
                name="phone"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="Phone Number"
                value={phone}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'phone');
                }}
              />
              <TextInput
                name="email"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'email');
                }}
              />
            </View>
            <View style={defaults.inputGroup}>
              <TextInput
                name="website"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="Website"
                value={website}
                autoCapitalize="none"
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'website');
                }}
              />
              <TextInput
                name="facebook"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="Facebook URL"
                value={facebook}
                autoCapitalize="none"
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'facebook');
                }}
              />
            </View>
            <View style={defaults.inputGroup}>
              <TextInput
                name="twitter"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="Twitter URL"
                value={twitter}
                autoCapitalize="none"
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'twitter');
                }}
              />
              <TextInput
                name="instagram"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="Instagram URL"
                value={instagram}
                autoCapitalize="none"
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'instagram');
                }}
              />
            </View>
            <View style={defaults.bigButtonWrap}>
              <TouchableHighlight
                style={[defaults.buttonStyle, defaults.blueButton]}
                onPress={this.updateBusinessInfo}
                underlayColor={colors.lightGray}
              >
                <Text style={defaults.buttonText}>Update</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>{businessSettings}</View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userType: state.userType,
  loggedIn: state.loggedIn,
  businessDetails: state.businessDetails,
  currentUser: state.currentUser,
});

const mapActionsToProps = dispatch => ({
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(LoginProfile);
