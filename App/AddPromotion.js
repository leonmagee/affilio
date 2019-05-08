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
import RNFirebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { colors } from './variables';

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
    paddingVertical: 7,
    paddingHorizontal: 14,
    fontSize: 19,
    fontFamily: 'Lato-Regular',
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
  },
  datePicker: {
    marginBottom: 20,
    flex: 1,
  },
  imageUploadButton: {
    backgroundColor: colors.brandSecond,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  textSubmit: {
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lato-Bold',
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
      endingDate: '',
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

  setEndingDate = endingDate => {
    // regular new Date() seems to work for this...
    // const newEndDate = RNFirebase.firestore.Timestamp.fromDate(
    //   new Date(endingDate)
    // );
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
    const { companyName, newPromo, endDateSubmit, imageSource } = this.state;
    if (companyName !== '' && newPromo !== '' && endDateSubmit && imageSource) {
      const promotion = {
        company: companyName,
        promotion: newPromo,
        end: endDateSubmit,
        createdAt: new Date(),
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
          const uid = '12345'; // different folder for different users?
          const imageRef = RNFirebase.storage()
            .ref(uid)
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
                companyName: '',
                newPromo: '',
                endingDate: '',
                imageSource: false,
                processing: false,
              });
            })
            .catch(error => {
              console.error(error);
            });

          // image should show activity indicator first?
          // the images should be in directories per each user?
          // validation for missing fields - all will be required for now - except for image...
        });
    }
  };

  render() {
    const {
      companyName,
      imageSource,
      newPromo,
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
        <ScrollView>
          <View style={styles.formWrap}>
            <TextInput
              style={styles.textInput}
              value={companyName}
              onChangeText={e => {
                this.updateTextInput(e, 'companyName');
              }}
              placeholder="Company Name"
            />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newPromo}
              multiline
              onChangeText={e => {
                this.updateTextInput(e, 'newPromo');
              }}
              placeholder="Promotion Details"
            />
            <View style={styles.datePickerWrap}>
              <DatePicker
                style={styles.datePicker}
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
                    fontSize: 19,
                    fontFamily: 'Lato-Regular',
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
        </ScrollView>
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
