import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
});

class Profile extends Component {
  constructor(props) {
    super(props);
    const { businessDetails } = props;

    this.state = {
      name: businessDetails.name,
      address: businessDetails.address,
      city: businessDetails.city,
      state: businessDetails.state,
      zip: businessDetails.zip,
      phone: businessDetails.phone,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  updateBusinessInfo = () => {
    const { name, address, city, state, zip, phone } = this.state;
    // console.log('profile updates???', name, address, city, state, zip, phone);
    const { currentUser } = this.props;
    const busDetails = {
      name,
      address,
      city,
      state,
      zip,
      phone,
    };
    const busDetailsSave = JSON.stringify(busDetails);
    // console.log(busDetailsSave);
    /**
     * validation function - make sure items aren't empty?
     */
    if (name && address && city && state && zip && phone) {
      AsyncStorage.setItem('@BusinessDetails', busDetailsSave);
    }
    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .set(busDetails)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('errors?', error);
      });
  };

  // this.afs.collection('[your collection]').doc('[your ID]').set([your document]);

  render() {
    const { userType, loggedIn, navigation } = this.props;
    const { name, address, city, state, zip, phone } = this.state;

    let businessSettings = <></>;
    if (userType) {
      businessSettings = (
        <View>
          <View style={styles.titleWrap}>
            <Text style={defaults.formSubTitle}>Business Details</Text>
          </View>
          <View style={defaults.formWrap}>
            <TextInput
              name="name"
              style={defaults.textInput}
              placeholder="Business Name"
              value={name}
              required
              onChangeText={e => {
                this.updateTextInput(e, 'name');
              }}
            />
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
                name="city"
                style={[defaults.textInput, { flex: 1, marginRight: 10 }]}
                placeholder="Zip"
                value={zip}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'zip');
                }}
              />
              <TextInput
                name="state"
                style={[defaults.textInput, { flex: 1, marginLeft: 10 }]}
                placeholder="Phone"
                value={phone}
                required
                onChangeText={e => {
                  this.updateTextInput(e, 'phone');
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
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Profile Settings</Text>
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
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Profile);
