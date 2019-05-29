import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
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
import { CloseIcon } from './CloseIcon';
import { colors } from '../Styles/variables';
import { defaults, promos } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

class PromotionBusiness extends Component {
  constructor(props) {
    super(props);
    const startingDate = props.start
      ? moment(props.start.toDate()).format('MM-DD-YYYY')
      : '';
    this.state = {
      modalVisible: false,
      id: props.id,
      cardOpen: false,
      promotionTitle: props.title,
      promotionDetails: props.promo,
      promoUrl: props.url,
      startingDate,
      endingDate: moment(props.end.toDate()).format('MM-DD-YYYY'),
      startDateSubmit: props.start,
      endDateSubmit: props.end,
      imageSource: props.image,
      busDetails: false,
      imageUpdated: false,
      processing: false,
      showSpinner: true, // just in update modal
      promotionTitleReq: false,
      promotionDetailsReq: false,
      promoUrlReq: false,
      imageSourceReq: false,
    };

    const businessDetailsRef = props.firestore.doc(
      `businesses/${props.companyId}`
    );
    businessDetailsRef.get().then(result => {
      // console.log('here is a result?', result);
      this.setState({ busDetails: result._data });
      // console.log('final state?', this.state.businessDetails);
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  urlLink = url => {
    Linking.openURL(url);
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
      promotionTitleReq: false,
      promotionDetailsReq: false,
      promoUrlReq: false,
      imageSourceReq: false,
    });
    const {
      id,
      promotionTitle,
      startDateSubmit,
      endDateSubmit,
      promotionDetails,
      promoUrl,
      imageSource,
      imageUpdated,
    } = this.state;

    if (promotionTitle === '') {
      this.setState({ promotionTitleReq: true });
    }
    if (promotionDetails === '') {
      this.setState({ promotionDetailsReq: true });
    }
    if (promoUrl === '') {
      this.setState({ promoUrlReq: true });
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

    const { firestore, currentUser } = this.props;

    const promoRef = firestore.doc(`promos/${id}`);

    if (
      promotionTitle !== '' &&
      promotionDetails !== '' &&
      endDateSubmit &&
      imageSource
    ) {
      if (imageUpdated) {
        const { Blob } = RNFetchBlob.polyfill;
        const { fs } = RNFetchBlob;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        const userId = currentUser.uid;
        const imageRef = RNFirebase.storage()
          .ref(userId)
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
                title: promotionTitle,
                promotion: promotionDetails,
                url: promoUrl,
                start: startDateSubmit,
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
                // this.viewSingle();
              });
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        promoRef
          .update({
            title: promotionTitle,
            promotion: promotionDetails,
            url: promoUrl,
            start: startDateSubmit,
            end: endDateSubmit,
            updatedAt: new Date(),
          })
          .then(() => {
            this.setState({
              modalVisible: false,
              processing: false,
              imageUpdated: false,
            });
            // this.viewSingle();
          });
      }
    }
  };

  render() {
    const { company, promo, url, start, end, image } = this.props;
    const {
      promotionTitle,
      startingDate,
      endingDate,
      modalVisible,
      promotionDetails,
      promoUrl,
      imageSource,
      processing,
      cardOpen,
      busDetails,
      showSpinner,
      promotionTitleReq,
      promotionDetailsReq,
      promoUrlReq,
      imageSourceReq,
    } = this.state;
    const startDate = start ? moment(start.toDate()).format('MM/DD/YYYY') : ''; // ('MMMM Do YYYY')
    const endDate = end ? moment(end.toDate()).format('MM/DD/YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;

    let processIndicator = <></>;
    if (processing) {
      processIndicator = (
        <View style={defaults.indicatorWrap}>
          <ActivityIndicator size="large" color={colors.activity} />
        </View>
      );
    }

    // let facebookLink = <></>;
    // if (busDetails.facebook) {
    //   facebookLink = (
    //     <TouchableHighlight
    //       onPress={() => this.urlLink(busDetails.facebook)}
    //       underlayColor="transparent"
    //     >
    //       <Icon name="facebook" size={38} color={colors.brandPrimary} />
    //     </TouchableHighlight>
    //   );
    // }
    // let twitterLink = <></>;
    // if (busDetails.twitter) {
    //   twitterLink = (
    //     <TouchableHighlight
    //       onPress={() => this.urlLink(busDetails.twitter)}
    //       underlayColor="transparent"
    //     >
    //       <Icon name="twitter" size={38} color={colors.brandPrimary} />
    //     </TouchableHighlight>
    //   );
    // }
    // let instagramLink = <></>;
    // if (busDetails.instagram) {
    //   instagramLink = (
    //     <TouchableHighlight
    //       onPress={() => this.urlLink(busDetails.instagram)}
    //       underlayColor="transparent"
    //     >
    //       <Icon name="instagram" size={38} color={colors.brandPrimary} />
    //     </TouchableHighlight>
    //   );
    // }

    let toggleArea = <></>;
    if (cardOpen) {
      toggleArea = (
        <View style={promos.sharingDetailsWrap}>
          <Text style={promos.sharingDetails}>No Data Yet</Text>
        </View>
      );
    }

    let startingData = <></>;
    if (startDate) {
      startingData = (
        <View style={promos.dateRangeWrap}>
          <Text style={promos.dateItem}>Starts: {startDate} -</Text>
        </View>
      );
    }

    let modalSpinner = <></>;

    if (showSpinner) {
      modalSpinner = (
        <View style={defaults.indicatorWrapModal}>
          <ActivityIndicator size="large" color={colors.activity} />
        </View>
      );
    }

    return (
      <TouchableHighlight underlayColor="transparent" onPress={this.toggleCard}>
        <View style={promos.promotionWrap}>
          <Image style={promos.promoImage} source={imageUrl} />
          <View style={promos.detailsWrap}>
            <View style={promos.promotionTitleWrap}>
              <View style={promos.titleWrapInner}>
                <Text style={promos.promotionTitle}>{promotionTitle}</Text>
                <View style={promos.iconGroup}>
                  <TouchableHighlight
                    style={promos.iconGroupIcon}
                    onPress={() => this.setModalVisible(!modalVisible)}
                    underlayColor="transparent"
                  >
                    <Icon name="pencil" size={22} color={colors.brandPrimary} />
                  </TouchableHighlight>
                </View>
              </View>
              <View style={promos.sectionWrap}>
                {startingData}
                <View style={promos.dateRangeWrap}>
                  <Text style={promos.dateItem}>Expires: {endDate}</Text>
                </View>
              </View>
            </View>
            <View style={promos.sectionWrap}>
              <View style={promos.iconWrap}>
                <Icon name="tag" size={22} color={colors.lightGray} />
              </View>
              <Text style={promos.promoText}>{promo}</Text>
            </View>
            <View style={promos.sectionWrap}>
              <View style={promos.iconWrap}>
                <Icon name="link" size={28} color={colors.lightGray} />
              </View>
              <View style={promos.dateRangeWrap}>
                <Text style={promos.linkUrl}>{url}</Text>
              </View>
            </View>
            {toggleArea}
          </View>

          <Modal animationType="slide" visible={modalVisible}>
            <ScrollView style={defaults.modalWrapInner}>
              <View style={defaults.modalHeader}>
                <CloseIcon
                  toggle={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                />
                <Text style={defaults.title}>Update Promotion</Text>
                <Text style={defaults.hiddenItem}>X</Text>
              </View>
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
                        fontSize: 19,
                        fontFamily: 'Lato-Regular',
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
                        fontSize: 19,
                        fontFamily: 'Lato-Regular',
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
                    style={[
                      defaults.buttonStyle,
                      defaults.updateSubmitButton,
                      { marginLeft: 10 },
                    ]}
                    onPress={this.updateCurrentPromotion}
                    underlayColor={colors.brandPrimary}
                  >
                    <Text style={defaults.buttonText}>Update</Text>
                  </TouchableHighlight>
                </View>
                <View style={defaults.imagePreviewWrap}>
                  {modalSpinner}
                  <Image
                    onLoadEnd={() => {
                      this.setState({
                        showSpinner: false,
                      });
                    }}
                    style={defaults.imagePreview}
                    source={{ uri: imageSource }}
                  />
                </View>
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
  currentUser: state.currentUser,
});

module.exports = connect(mapStateToProps)(PromotionBusiness);
