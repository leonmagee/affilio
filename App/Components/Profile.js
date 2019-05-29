import React, { Component } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFirebase from 'react-native-firebase';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
// import LoginButton from './LoginButton';
import Footer from './Footer';

const firestore = RNFirebase.firestore();

// const iconColor = '#BBB';

const styles = StyleSheet.create({
  titleWrap: {
    marginTop: 20,
    paddingTop: 17,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  innerWrap: {
    marginTop: 20,
    paddingTop: 25,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    const { businessDetails, currentUser } = props;

    this.state = {
      address: businessDetails.address,
      details: businessDetails.details,
      city: businessDetails.city,
      state: businessDetails.state,
      zip: businessDetails.zip,
      // country: businessDetails.country,
      // phone: businessDetails.phone,
      email: businessDetails.email,
      website: businessDetails.website,
      facebook: businessDetails.facebook,
      twitter: businessDetails.twitter,
      instagram: businessDetails.instagram,
      triggerActivity: false,
    };

    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .get()
      .then(result => {
        console.log('hey, does this work?', result.data());
        const data = result.data();
        this.setState({ ...data, triggerActivity: false });
      });
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  updateBusinessInfo = () => {
    // const url = 'https://levon.io';
    // Linking.openURL(url);
    this.setState({ triggerActivity: true });
    const {
      address,
      details,
      city,
      state,
      zip,
      // country,
      // phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
    } = this.state;
    // console.log('profile updates???', name, address, city, state, zip, phone);
    const { currentUser, setBusinessDetails } = this.props;
    const busDetails = {
      address,
      details,
      city,
      state,
      // country,
      zip,
      // phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
    };
    setBusinessDetails(busDetails);

    // const busDetailsSave = JSON.stringify(busDetails);
    // console.log(busDetailsSave);
    /**
     * validation function - make sure items aren't empty?
     */
    // if (address && city && state && zip && phone) {
    //   AsyncStorage.setItem('@BusinessDetails', busDetailsSave);
    // }
    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .set(busDetails)
      .then(result => {
        console.log(result);
        this.setState({ triggerActivity: false });
      })
      .catch(error => {
        console.error('errors?', error);
        this.setState({ triggerActivity: false });
      });
  };

  // this.afs.collection('[your collection]').doc('[your ID]').set([your document]);

  render() {
    const { userType, navigation } = this.props;
    const {
      address,
      details,
      city,
      state,
      zip,
      // country,
      // phone,
      email,
      website,
      facebook,
      twitter,
      instagram,
      triggerActivity,
    } = this.state;

    let activityWrapper = <></>;
    if (triggerActivity) {
      activityWrapper = (
        <View style={defaults.processingWrap}>
          <ActivityIndicator size="large" color={colors.activity} />
        </View>
      );
    }

    let businessSettings = <></>;
    if (userType) {
      businessSettings = (
        <ScrollView>
          <View style={styles.innerWrap}>
            <View style={defaults.formWrap}>
              <TextInput
                name="address"
                style={defaults.textInput}
                placeholder="Address"
                value={address}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'address');
                }}
              />
              <TextInput
                name="details"
                style={[defaults.textInput, defaults.textArea]}
                placeholder="Company Information"
                value={details}
                multiline
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'details');
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
                  underlayColor={colors.brandPrimary}
                >
                  <Text style={defaults.buttonText}>Update</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          {activityWrapper}
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Company Details</Text>
          {businessSettings}
        </View>
        <Footer navigation={navigation} />
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
  setBusinessDetails(details) {
    dispatch({ type: 'BUSINESS_DETAILS', payload: details });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Profile);
