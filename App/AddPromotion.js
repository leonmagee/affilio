import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import RNFirebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { colors } from './variables';

const { Blob } = RNFetchBlob.polyfill;
const { fs } = RNFetchBlob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const uid = '12345'; // different folder for different users?
const imageRef = RNFirebase.storage()
  .ref(uid)
  .child('dbx.jpg'); // name of the file - this will need to be dynamic?
const mime = 'image/jpeg';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  formWrap: {
    marginHorizontal: 30,
    padding: 20,
  },
  subTitle: {
    color: '#222',
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'Assistant-Bold',
  },
  textInput: {
    backgroundColor: 'white',
    padding: 7,
    fontSize: 21,
    marginBottom: 20,
    borderColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    color: '#676867',
  },
  textArea: {
    height: 120,
  },
  datePickerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    marginBottom: 20,
  },
  imageUploadButton: {
    backgroundColor: colors.brandPrimary,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Assistant-Bold',
  },
  textSubmit: {
    backgroundColor: '#333',
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Assistant-Bold',
  },
  imagePreviewWrap: {
    marginTop: 20,
    paddingHorizontal: 50,
  },
  imagePreview: {
    height: 100,
  },
  processingWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});

class AddPromotion extends Component {
  constructor() {
    super();
    this.state = {
      companyName: '',
      newPromo: '',
      startingDate: '',
      endingDate: '',
      startDateSubmit: '',
      endDateSubmit: '',
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
    const newStartDate = RNFirebase.firestore.Timestamp.fromDate(
      new Date(startingDate)
    );
    this.setState({
      startingDate,
      startDateSubmit: newStartDate,
    });
  };

  setEndingDate = endingDate => {
    const newEndDate = RNFirebase.firestore.Timestamp.fromDate(
      new Date(endingDate)
    );
    this.setState({
      endingDate,
      endDateSubmit: newEndDate,
    });
  };

  imageSelect = () => {
    // console.log('button clicked');
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: 'Choose Promotion Image',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 750,
      mediaType: 'photo',
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
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
    const {
      companyName,
      newPromo,
      startDateSubmit,
      endDateSubmit,
      imageSource,
    } = this.state;
    if (companyName !== '' && newPromo !== '' && imageSource) {
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

          const promotion = {
            company: companyName,
            promotion: newPromo,
            start: startDateSubmit,
            end: endDateSubmit,
            image: firebaseUrl,
          };
          firestore
            .collection('promos')
            .add(promotion)
            .then(result => {
              console.log('xxxxxx', result.id);
            });
          this.setState({
            companyName: '',
            newPromo: '',
            startingDate: '',
            endingDate: '',
            imageSource: false,
            processing: false,
          });
        })
        .catch(error => {
          console.log('HERE IS THE ERROR!', error);
        });
    }
  };

  render() {
    const {
      companyName,
      imageSource,
      newPromo,
      startingDate,
      endingDate,
      processing,
    } = this.state;

    let imagePreview = <View />;
    if (imageSource) {
      imagePreview = (
        <View style={styles.imagePreviewWrap}>
          <Image style={styles.imagePreview} source={{ uri: imageSource }} />
        </View>
      );
    }

    let formWrap = <View />;

    if (processing) {
      formWrap = (
        <View style={styles.processingWrap}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      );
    } else {
      formWrap = (
        <View>
          <View style={styles.formWrap}>
            <TextInput
              style={styles.textInput}
              value={companyName}
              onChangeText={e => {
                this.updateTextInput(e, 'companyName');
              }}
              placeholder="company name"
            />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newPromo}
              multiline
              onChangeText={e => {
                this.updateTextInput(e, 'newPromo');
              }}
              placeholder="promotion details"
            />
            <View style={styles.datePickerWrap}>
              <DatePicker
                style={styles.datePicker}
                date={startingDate}
                mode="date"
                placeholder="starting date"
                format="MM-DD-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                customStyles={{
                  placeholderText: {
                    fontSize: 21,
                  },
                }}
                onDateChange={this.setStartingDate}
              />
              <DatePicker
                style={styles.datePicker}
                date={endingDate}
                mode="date"
                placeholder="ending date"
                format="MM-DD-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minDate={new Date()}
                showIcon={false}
                customStyles={{
                  placeholderText: {
                    fontSize: 21,
                  },
                }}
                onDateChange={this.setEndingDate}
              />
            </View>
            <TouchableHighlight
              style={styles.imageUploadButton}
              onPress={this.imageSelect}
            >
              <Text style={styles.imageUploadText}>Choose Image</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.textSubmit}
              onPress={this.addNewPromotion}
            >
              <Text style={styles.buttonText}>Add Promotion</Text>
            </TouchableHighlight>
          </View>
          {imagePreview}
        </View>
      );
    }

    return (
      <View style={styles.mainWrap}>
        <Text style={styles.subTitle}>Add New Promotion</Text>
        {formWrap}
      </View>
    );
  }
}

module.exports = AddPromotion;
