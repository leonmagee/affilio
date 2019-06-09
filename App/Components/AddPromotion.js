import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
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

const firestore = RNFirebase.firestore();

class AddPromotion extends Component {
  constructor() {
    super();
    this.state = {
      promotionTitle: '',
      promotionTitleReq: false,
      promotionDetails: '',
      promotionDetailsReq: false,
      promoUrl: '',
      promoUrlReq: false,
      startingDate: '',
      startingDateReq: false,
      endingDate: '',
      endingDateReq: false,
      startDateSubmit: false,
      endDateSubmit: false,
      imageSource: false,
      imageSourceReq: false,
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
      maxWidth: 475,
      mediaType: 'photo',
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.error('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          imageSource: response.uri,
        });
      }
    });
  };

  addNewPromotion = () => {
    this.setState({
      promotionTitleReq: false,
      promotionDetailsReq: false,
      promoUrlReq: false,
      startingDateReq: false,
      endingDateReq: false,
      imageSourceReq: false,
    });
    const {
      promotionTitle,
      promotionDetails,
      startDateSubmit,
      endDateSubmit,
      imageSource,
      promoUrl,
    } = this.state;

    const { navigation } = this.props;

    if (promotionTitle === '') {
      this.setState({ promotionTitleReq: true });
    }
    if (promotionDetails === '') {
      this.setState({ promotionDetailsReq: true });
    }
    if (promoUrl === '') {
      this.setState({ promoUrlReq: true });
    }
    if (!startDateSubmit) {
      this.setState({ startingDateReq: true });
    }
    if (!endDateSubmit) {
      this.setState({ endingDateReq: true });
    }
    if (!imageSource) {
      this.setState({ imageSourceReq: true });
    }

    if (
      promotionTitle === '' ||
      promotionDetails === '' ||
      promoUrl === '' ||
      !startDateSubmit ||
      !endDateSubmit ||
      !imageSource
    ) {
      return;
    }

    this.setState({
      processing: true,
    });

    const { currentUser, modalToggle } = this.props;
    let userId = false;
    if (currentUser) {
      userId = currentUser.uid;
    }
    if (
      promotionTitle !== '' &&
      promotionDetails !== '' &&
      endDateSubmit &&
      imageSource &&
      userId
    ) {
      // const firestoreId = result.id;
      // const firestoreId = Date.now();
      const currentDate = Date.now();
      // const postRef = firestore.doc(`promos/${firestoreId}`);

      const { Blob } = RNFetchBlob.polyfill;
      const { fs } = RNFetchBlob;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
      const imageRef = RNFirebase.storage()
        .ref(userId)
        .child(`image-${currentDate}.jpg`);
      const mime = 'image/jpeg';

      const filePath = imageSource.replace('file:', '');
      let uploadBlob = false;
      fs.readFile(filePath, 'base64')
        .then(data => Blob.build(data, { type: `${mime};BASE64` }))
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob._ref, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(firebaseUrl => {
          console.log('step 3 - upload worked', firebaseUrl);

          const promotion = {
            title: promotionTitle,
            promotion: promotionDetails,
            start: startDateSubmit,
            end: endDateSubmit,
            url: promoUrl,
            createdAt: currentDate,
            companyId: userId,
            image: firebaseUrl,
          };

          firestore
            .collection('promos')
            .add(promotion)
            .then(result => {
              this.setState({
                promotionTitle: '',
                promotionDetails: '',
                startingDate: '',
                endingDate: '',
                promoUrl: '',
                imageSource: false,
                processing: false,
              });

              modalToggle();
              navigation.navigate('New');
            });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.log("didn't pass validation...");
    }
  };

  render() {
    const {
      promotionTitle,
      promotionTitleReq,
      promotionDetails,
      promotionDetailsReq,
      promoUrl,
      promoUrlReq,
      imageSource,
      imageSourceReq,
      startingDate,
      startingDateReq,
      endingDate,
      endingDateReq,
      processing,
    } = this.state;
    const { loggedIn } = this.props;

    let imagePreview = <View />;
    if (imageSource) {
      imagePreview = (
        <Image style={defaults.imagePreview} source={{ uri: imageSource }} />
      );
    }

    let formWrap = <></>;

    if (loggedIn) {
      if (processing) {
        formWrap = (
          <View style={defaults.processingWrap}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
          </View>
        );
      } else {
        formWrap = (
          <View style={defaults.formWrapModal}>
            <TextInput
              style={[
                defaults.textInput,
                promotionTitleReq && defaults.required,
              ]}
              value={promotionTitle}
              onChangeText={e => {
                this.updateTextInput(e, 'promotionTitle');
              }}
              placeholder="Promotion Title"
            />
            <TextInput
              style={[
                defaults.textInput,
                defaults.textArea,
                promotionDetailsReq && defaults.required,
              ]}
              value={promotionDetails}
              multiline
              onChangeText={e => {
                this.updateTextInput(e, 'promotionDetails');
              }}
              placeholder="Promotion Details"
            />
            <TextInput
              style={[defaults.textInput, promoUrlReq && defaults.required]}
              value={promoUrl}
              autoCapitalize="none"
              onChangeText={e => {
                this.updateTextInput(e, 'promoUrl');
              }}
              placeholder="Promotion URL"
            />
            <View style={defaults.datePickerWrap}>
              <DatePicker
                style={[
                  defaults.datePicker,
                  { marginRight: 10 },
                  startingDateReq && defaults.required,
                ]}
                date={startingDate}
                mode="date"
                placeholder="Starting Date"
                format="MM/DD/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                customStyles={{
                  placeholderText: {
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                    alignItems: 'flex-start',
                  },
                  dateInput: {
                    alignItems: 'flex-start',
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    borderColor: startingDateReq
                      ? colors.brandSecond
                      : 'rgba(0,0,0,0.25)',
                  },
                }}
                onDateChange={this.setStartingDate}
              />
              <DatePicker
                style={[
                  defaults.datePicker,
                  { marginLeft: 10 },
                  endingDateReq && defaults.required,
                ]}
                date={endingDate}
                mode="date"
                placeholder="Expiration Date"
                format="MM/DD/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                customStyles={{
                  placeholderText: {
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                    alignItems: 'flex-start',
                  },
                  dateInput: {
                    alignItems: 'flex-start',
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    borderColor: endingDateReq
                      ? colors.brandSecond
                      : 'rgba(0,0,0,0.25)',
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
                  imageSourceReq && defaults.redButton,
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
        );
      }
    }

    return <View>{formWrap}</View>;
  }
}
const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
});
module.exports = connect(mapStateToProps)(AddPromotion);
