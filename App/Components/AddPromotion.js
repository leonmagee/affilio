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
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';

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
      companyName: '',
      newPromo: '',
      promoUrl: '',
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

  // redirectPromos = () => {
  //   const { navigation } = this.props;
  //   navigation.navigate('Promotions');
  // };

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
    /**
     * @todo validation? required fields? field types?
     */
    const {
      companyName,
      newPromo,
      endDateSubmit,
      imageSource,
      promoUrl,
    } = this.state;
    if (companyName !== '' && newPromo !== '' && endDateSubmit && imageSource) {
      const promotion = {
        company: companyName,
        promotion: newPromo,
        end: endDateSubmit,
        url: promoUrl,
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

              const { navigation } = this.props;
              navigation.navigate('Promotions');
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
      newPromo, // @todo change this to 'promoText' or something else
      promoUrl,
      endingDate,
      processing,
    } = this.state;

    let imagePreview = <View />;
    if (imageSource) {
      imagePreview = (
        <Image style={defaults.imagePreview} source={{ uri: imageSource }} />
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
                    fontSize: 17,
                    fontFamily: 'Lato-Regular',
                    alignItems: 'flex-start',
                  },
                  dateInput: {
                    // backgroundColor: 'red',
                    // textAlign: 'left',
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
                style={[defaults.buttonStyle, defaults.imageUploadButton]}
                onPress={this.imageSelect}
                underlayColor={colors.brandSecond}
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

    return (
      <View style={defaults.mainWrap}>
        <Text style={defaults.title}>Add New Promotion</Text>
        {formWrap}
      </View>
    );
  }
}

module.exports = AddPromotion;
