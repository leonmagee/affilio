import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import RNFirebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import RNShare, { ShareSheet, Button } from 'react-native-share';
import { CloseIcon } from './CloseIcon';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

// const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry?userId=123&companyName=CopaVida&redirectUrl=https://espn.com';

const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry';

const styles = StyleSheet.create({
  promotionWrap: {
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.05,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  promoImage: {
    height: 160,
    width: null,
  },
  // promoImageSingle: {
  //   height: 300,
  //   width: null,
  // },
  detailsWrap: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#FFF',
  },
  companyNameWrap: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyName: {
    fontSize: 24,
    color: '#111',
    fontFamily: 'Lato-Bold',
  },
  sectionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
  },
  promoText: {
    color: '#444',
    fontSize: 18,
    flex: 1,
    fontFamily: 'Lato-Regular',
  },
  shareWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dateRangeWrap: {
    flexDirection: 'row',
  },
  dateItem: {
    fontSize: 16,
    color: colors.lightGray,
    marginRight: 8,
    fontFamily: 'Lato-Regular',
  },
  url: {
    fontSize: 12,
    // color: colors.lightGray,
    color: colors.brandPrimary,
    paddingRight: 40,
    fontFamily: 'Lato-Regular',
  },
});
// start = { item.data.start }
// end = { item.data.end }
// image = { item.data.image }
class Promotion extends Component {
  constructor(props) {
    super(props);
    const userId = 123; // get from auth
    const finalUrl = `${baseUrl}?userId=${userId}&companyName=${
      props.company
    }&redirectUrl=${props.url}`;
    this.state = {
      modalVisible: false,
      id: props.id,
      cardOpen: false,
      companyName: props.company,
      newPromo: props.promo,
      promoUrl: props.url,
      finalUrl,
      endingDate: moment(props.end.toDate()).format('MM-DD-YYYY'),
      endDateSubmit: props.end,
      imageSource: props.image,
      imageUpdated: false,
      processing: false,
      loggedIn: props.loggedIn,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  shareSocial = () => {
    const { finalUrl } = this.state;
    Share.share(
      {
        // message: 'Share Promotion',
        url: finalUrl,
        title: 'PIEC',
      },
      {
        // Android only:
        dialogTitle: 'Share Promotion',
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      }
    );
  };

  // shareFacebook = () => {
  //   const shareOptions = {
  //     title: 'Share via',
  //     message: 'some message',
  //     url: 'some share url',
  //     social: RNShare.Social.FACEBOOK,
  //   };
  //   // RNShare.shareSingle(shareOptions);
  //   Share.shareSingle(
  //     Object.assign(shareOptions, {
  //       social: 'facebook',
  //     })
  //   );

  //   // RNShare.open(shareOptions)
  //   //   .then(res => {
  //   //     console.log(res);
  //   //   })
  //   //   .catch(err => {
  //   //     err && console.log(err);
  //   //   });
  // };

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  setEndingDate = endingDate => {
    const endDateSubmit = new Date(endingDate);
    this.setState({
      endingDate,
      endDateSubmit,
    });
  };

  viewSingle = () => {
    const { id } = this.state;
    const { filterId } = this.props;
    filterId(id);
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
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.error('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          imageSource: response.uri,
          imageUpdated: true,
        });
      }
    });
  };

  toggleCard = () => {
    const { cardOpen } = this.state;
    this.setState({
      cardOpen: !cardOpen,
    });
  };

  updateCurrentPromotion = () => {
    this.setState({
      processing: true,
    });
    const {
      id,
      companyName,
      endDateSubmit,
      newPromo,
      promoUrl,
      imageSource,
      imageUpdated,
    } = this.state;
    const { firestore } = this.props;

    const promoRef = firestore.doc(`promos/${id}`);

    if (companyName !== '' && newPromo !== '' && endDateSubmit && imageSource) {
      if (imageUpdated) {
        const { Blob } = RNFetchBlob.polyfill;
        const { fs } = RNFetchBlob;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        const uid = '12345'; // different folder for different users?
        const imageRef = RNFirebase.storage()
          .ref(uid)
          .child(`image-${id}.jpg`);
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
            promoRef
              .update({
                company: companyName,
                promotion: newPromo,
                url: promoUrl,
                end: endDateSubmit,
                updatedAt: new Date(),
                image: firebaseUrl,
              })
              .then(() => {
                this.setState({
                  modalVisible: false,
                  processing: false,
                  imageUpdated: false,
                });
                this.viewSingle();
              });
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        promoRef
          .update({
            company: companyName,
            promotion: newPromo,
            url: promoUrl,
            end: endDateSubmit,
            updatedAt: new Date(),
          })
          .then(() => {
            this.setState({
              modalVisible: false,
              processing: false,
              imageUpdated: false,
            });
            this.viewSingle();
          });
      }
    }
  };

  render() {
    const { company, promo, url, end, image } = this.props;
    const {
      companyName,
      endingDate,
      modalVisible,
      newPromo,
      promoUrl,
      imageSource,
      processing,
      loggedIn, // global state? redux? firebase auth?
      cardOpen,
      finalUrl,
    } = this.state;
    // console.log('are we logged in?', loggedIn);
    const endDate = end ? moment(end.toDate()).format('MMMM Do YYYY') : '';
    // const endDateModal = end ? moment(end.toDate()).format('MM-DD-YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;

    let processIndicator = <></>;
    if (processing) {
      processIndicator = (
        <View style={defaults.indicatorWrap}>
          <ActivityIndicator size="large" color="#222" />
        </View>
      );
    }

    let toggleArea = <></>;
    if (cardOpen) {
      toggleArea = (
        <>
          <View style={styles.sectionWrap}>
            <View style={styles.iconWrap}>
              <Icon name="link" size={28} color={colors.lightGray} />
            </View>
            <View style={styles.dateRangeWrap}>
              <TouchableHighlight
                onPress={this.shareSocial}
                underlayColor="transparent"
              >
                <Text style={styles.url}>{finalUrl}</Text>
              </TouchableHighlight>
            </View>
          </View>
          {/* <View style={styles.shareWrap}>
            <TouchableHighlight onPress={this.shareFacebook}>
              <Icon name="facebook" size={33} color={colors.brandPrimary} />
            </TouchableHighlight>
            <Icon name="twitter" size={33} color={colors.brandPrimary} />
            <Icon name="share" size={33} color={colors.brandPrimary} />
          </View> */}
        </>
      );
    }

    return (
      <TouchableHighlight underlayColor="transparent" onPress={this.toggleCard}>
        <View style={styles.promotionWrap}>
          <Image style={styles.promoImage} source={imageUrl} />
          <View style={styles.detailsWrap}>
            <View style={styles.companyNameWrap}>
              <Text style={styles.companyName}>{company}</Text>
            </View>
            <View style={styles.sectionWrap}>
              <View style={styles.iconWrap}>
                <Icon name="tag" size={22} color={colors.lightGray} />
              </View>
              <Text style={styles.promoText}>{promo}</Text>
            </View>
            <View style={styles.sectionWrap}>
              <View style={styles.iconWrap}>
                <Icon name="calendar" size={24} color={colors.lightGray} />
              </View>
              <View style={styles.dateRangeWrap}>
                <Text style={styles.dateItem}>Expires: {endDate}</Text>
              </View>
            </View>

            {toggleArea}
          </View>

          <Modal
            sytle={{ flex: 1 }}
            animationType="slide"
            transparent
            visible={modalVisible}
          >
            <ScrollView style={defaults.modalWrapInner}>
              <View style={defaults.modalHeader}>
                <Text style={defaults.hiddenItem}>X</Text>
                <Text style={defaults.title}>Update Promotion</Text>
                <CloseIcon
                  toggle={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                />
              </View>
              <View style={defaults.formWrapModal}>
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
                        fontSize: 19,
                        fontFamily: 'Lato-Regular',
                      },
                    }}
                    onDateChange={this.setEndingDate}
                  />
                </View>
                <View style={defaults.bigButtonWrap}>
                  <TouchableHighlight
                    // style={defaults.imageUploadButton}
                    style={[defaults.buttonStyle, defaults.imageUploadButton]}
                    onPress={this.imageSelect}
                    underlayColor={colors.brandSecond}
                  >
                    <Text style={defaults.buttonText}>Image</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={[defaults.buttonStyle, defaults.updateSubmitButton]}
                    onPress={this.updateCurrentPromotion}
                    underlayColor={colors.brandPrimary}
                  >
                    <Text style={defaults.buttonText}>Update</Text>
                  </TouchableHighlight>
                </View>
                <Image
                  style={defaults.imagePreview}
                  source={{ uri: imageSource }}
                />
                {processIndicator}
              </View>
            </ScrollView>
          </Modal>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
});

// module.exports = Promotion;

module.exports = connect(mapStateToProps)(Promotion);
