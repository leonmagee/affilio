import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RNFirebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import Footer from './Footer';

const firestore = RNFirebase.firestore();

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
      email: businessDetails.email,
      website: businessDetails.website,
      facebook: businessDetails.facebook,
      twitter: businessDetails.twitter,
      instagram: businessDetails.instagram,
      image: businessDetails.image,
      triggerActivity: false,
    };

    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .get()
      .then(result => {
        const data = result.data();
        this.setState({ ...data, triggerActivity: false });
        console.log(this.state);
      });
  }

  imageSelect = () => {
    const options = {
      title: 'Choose Logo or Profile Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 200,
      mediaType: 'photo',
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          image: response.uri,
        });
      }
    });
  };

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  updateBusinessInfo = () => {
    this.setState({ triggerActivity: true });
    const {
      address,
      details,
      city,
      state,
      zip,
      email,
      website,
      facebook,
      twitter,
      instagram,
      image,
    } = this.state;
    const { currentUser, setBusinessDetails } = this.props;
    const busDetails = {
      address,
      details,
      city,
      state,
      zip,
      email,
      website,
      facebook,
      twitter,
      instagram,
      image,
    };
    setBusinessDetails(busDetails);

    firestore
      .collection('businesses')
      .doc(currentUser.uid)
      .set(busDetails)
      .then(() => {
        const firestoreId = currentUser.uid;
        if (image) {
          const postRef = firestore.doc(`businesses/${firestoreId}`);
          const { Blob } = RNFetchBlob.polyfill;
          const { fs } = RNFetchBlob;
          window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
          window.Blob = Blob;
          const imageRef = RNFirebase.storage()
            .ref(currentUser.uid)
            .child(`logo-${firestoreId}.jpg`);
          const mime = 'image/jpeg';
          const filePath = image.replace('file:', '');
          let uploadBlob = false;
          fs.readFile(filePath, 'base64')
            .then(data =>
              // console.log('step 1');
              Blob.build(data, { type: `${mime};BASE64` })
            )
            .then(blob => {
              // console.log('step 2');
              uploadBlob = blob;
              return imageRef.put(blob._ref, { contentType: mime });
            })
            .then(() => {
              // console.log('step 3');
              uploadBlob.close();
              return imageRef.getDownloadURL();
            })
            .then(firebaseUrl => {
              console.log('step 3 - upload worked', firebaseUrl);
              postRef.update({ image: firebaseUrl });
              this.setState({
                triggerActivity: false,
                imageSource: firebaseUrl,
              });
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          this.setState({ triggerActivity: false });
        }
      })
      .catch(error => {
        console.error('errors? xxx', error);
        this.setState({ triggerActivity: false });
      });
    this.setState({ triggerActivity: false });
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
      image,
    } = this.state;

    let imagePreview = <></>;
    if (image) {
      imagePreview = (
        <View style={defaults.logoPreviewWrap}>
          <Image style={defaults.logoPreview} source={{ uri: image }} />
        </View>
      );
    }

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
                  style={[
                    defaults.buttonStyle,
                    defaults.imageUploadButton,
                    { marginRight: 10 },
                  ]}
                  onPress={this.imageSelect}
                  underlayColor={colors.lightGray}
                >
                  <Text style={defaults.buttonText}>Logo/Profile</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[
                    defaults.buttonStyle,
                    defaults.blueButton,
                    { marginLeft: 10 },
                  ]}
                  onPress={this.updateBusinessInfo}
                  underlayColor={colors.brandPrimary}
                >
                  <Text style={defaults.buttonText}>Update</Text>
                </TouchableHighlight>
              </View>
              {imagePreview}
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
