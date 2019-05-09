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
import { defaults } from './defaultStyles';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff',
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
    // console.log('enderz', endingDate);
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
        <View style={defaults.imagePreviewWrap}>
          <Image style={defaults.imagePreview} source={{ uri: imageSource }} />
        </View>
      );
    }

    let formWrap = <View />;

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
              value={companyName}
              onChangeText={e => {
                this.updateTextInput(e, 'companyName');
              }}
              placeholder="Company Name"
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
            <View style={defaults.datePickerWrap}>
              <DatePicker
                style={defaults.datePicker}
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
              style={defaults.imageUploadButton}
              onPress={this.imageSelect}
              underlayColor={colors.brandSecond}
            >
              <Text style={defaults.imageUploadText}>Choose Image</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={defaults.textSubmit}
              onPress={this.addNewPromotion}
              underlayColor={colors.brandPrimary}
            >
              <Text style={defaults.buttonText}>Add Promotion</Text>
            </TouchableHighlight>
          </View>
          {imagePreview}
        </ScrollView>
      );
    }

    return (
      <View style={styles.mainWrap}>
        <Text style={defaults.subTitle}>Add New Promotion</Text>
        {formWrap}
      </View>
    );
  }
}

module.exports = AddPromotion;
