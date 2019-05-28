import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import RNFirebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import LoginButton from './LoginButton';

const firestore = RNFirebase.firestore();

// const styles = StyleSheet.create({
//   mainWrap: {
//     flex: 1,
//     paddingTop: 45,
//     backgroundColor: '#fff',
//   },
// });

class AddPromotion extends Component {
  constructor() {
    super();
    this.state = {
      promotionTitle: '',
      newPromo: '',
      promoUrl: '',
      startingDate: '',
      endingDate: '',
      startDateSubmit: false,
      endDateSubmit: false,
      imageSource: false,
      processing: false,
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  setStartingDate = startingDate => {
    const startDateSubmit = new Date(startingDate);
    this.setState({
      startingDate,
      startDateSubmit,
    });
  };

  setEndingDate = endingDate => {
    const endDateSubmit = new Date(endingDate);
    this.setState({
      endingDate,
      endDateSubmit,
    });
  };

  imageSelect = () => {
    const options = {
      title: 'Choose Promotion Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 550,
      mediaType: 'photo',
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          imageSource: response.uri,
        });
      }
    });
  };

  addNewPromotion = () => {
    this.setState({
      processing: true,
    });
    /**
     * @todo validation? required fields? field types?
     */
    const {
      promotionTitle,
      newPromo,
      startDateSubmit,
      endDateSubmit,
      imageSource,
      promoUrl,
    } = this.state;
    const { currentUser, modalToggle } = this.props;
    let userId = false;
    if (currentUser) {
      userId = currentUser.uid;
    }
    if (
      promotionTitle !== '' &&
      newPromo !== '' &&
      endDateSubmit &&
      imageSource &&
      userId
    ) {
      const promotion = {
        title: promotionTitle,
        promotion: newPromo,
        start: startDateSubmit,
        end: endDateSubmit,
        url: promoUrl,
        createdAt: new Date(),
        companyId: userId,
      };
      firestore
        .collection('promos')
        .add(promotion)
        .then(result => {
          const firestoreId = result.id;
          const postRef = firestore.doc(`promos/${firestoreId}`);

          const { Blob } = RNFetchBlob.polyfill;
          const { fs } = RNFetchBlob;
          window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
          window.Blob = Blob;
          const imageRef = RNFirebase.storage()
            .ref(userId)
            .child(`image-${firestoreId}.jpg`);
          const mime = 'image/jpeg';

          const filePath = imageSource.replace('file:', '');
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

              // finalize by restting state
              // this should redirect instead - use nav method?
              this.setState({
                promotionTitle: '',
                newPromo: '',
                startingDate: '',
                endingDate: '',
                promoUrl: '',
                imageSource: false,
                processing: false,
              });

              modalToggle();
              this.props.navigation.navigate('New');

              // const { navigation } = this.props;
              // navigation.navigate('Promotions');
            })
            .catch(error => {
              console.error(error);
            });

          // image should show activity indicator first?
          // the images should be in directories per each user?
          // validation for missing fields - all will be required for now - except for image...
        });
    } else {
      console.log("didn't pass validation...");
    }
  };

  render() {
    const {
      promotionTitle,
      imageSource,
      newPromo, // @todo change this to 'promoText' or something else
      promoUrl,
      startingDate,
      endingDate,
      processing,
    } = this.state;
    const { loggedIn } = this.props;

    let imagePreview = <View />;
    if (imageSource) {
      imagePreview = (
        <Image style={defaults.imagePreview} source={{ uri: imageSource }} />
      );
    }

    let formWrap = <LoginButton />;

    if (loggedIn) {
      if (processing) {
        formWrap = (
          <View style={defaults.processingWrap}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
          </View>
        );
      } else {
        formWrap = (
          <ScrollView>
            <View style={defaults.formWrap}>
              <TextInput
                style={defaults.textInput}
                value={promotionTitle}
                onChangeText={e => {
                  this.updateTextInput(e, 'promotionTitle');
                }}
                placeholder="Promotion Title"
              />
              <TextInput
                style={[defaults.textInput, defaults.textArea]}
                value={newPromo}
                multiline
                onChangeText={e => {
                  this.updateTextInput(e, 'newPromo');
                }}
                placeholder="Promotion Details"
              />
              <TextInput
                style={defaults.textInput}
                value={promoUrl}
                autoCapitalize="none"
                onChangeText={e => {
                  this.updateTextInput(e, 'promoUrl');
                }}
                placeholder="Promotion URL"
              />
              <View style={defaults.datePickerWrap}>
                <DatePicker
                  style={[defaults.datePicker, { marginRight: 10 }]}
                  date={startingDate}
                  mode="date"
                  placeholder="Starting Date"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  minDate={new Date()}
                  showIcon={false}
                  customStyles={{
                    placeholderText: {
                      fontSize: 17,
                      fontFamily: 'Lato-Regular',
                      alignItems: 'flex-start',
                    },
                    dateInput: {
                      alignItems: 'flex-start',
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                      borderColor: 'rgba(0,0,0,0.25)',
                    },
                  }}
                  onDateChange={this.setStartingDate}
                />
                <DatePicker
                  style={[defaults.datePicker, { marginLeft: 10 }]}
                  date={endingDate}
                  mode="date"
                  placeholder="Expiration Date"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  minDate={new Date()}
                  showIcon={false}
                  customStyles={{
                    placeholderText: {
                      fontSize: 17,
                      fontFamily: 'Lato-Regular',
                      alignItems: 'flex-start',
                    },
                    dateInput: {
                      alignItems: 'flex-start',
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                      borderColor: 'rgba(0,0,0,0.25)',
                    },
                  }}
                  onDateChange={this.setEndingDate}
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
                  <Text style={defaults.buttonText}>Image</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[defaults.buttonStyle, defaults.updateSubmitButton]}
                  onPress={this.addNewPromotion}
                  underlayColor={colors.brandPrimary}
                >
                  <Text style={defaults.buttonText}>Submit</Text>
                </TouchableHighlight>
              </View>
              {imagePreview}
            </View>
          </ScrollView>
        );
      }
    }

    return <View style={defaults.mainWrap}>{formWrap}</View>;
  }
}
const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
});
module.exports = connect(mapStateToProps)(AddPromotion);
