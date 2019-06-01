import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  // Linking,
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
import { getUserDocument } from '../Utils/utils';
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
      cardOpen: true,
      promotionTitle: props.title,
      promotionDetails: props.promo,
      promoUrl: props.url,
      startingDate,
      endingDate: moment(props.end.toDate()).format('MM-DD-YYYY'),
      startDateSubmit: props.start,
      endDateSubmit: props.end,
      imageSource: props.image,
      // busDetails: false,
      imageUpdated: false,
      processing: false,
      showSpinner: true, // just in update modal
      promotionTitleReq: false,
      promotionDetailsReq: false,
      promoUrlReq: false,
      // imageSourceReq: false,
      clicks: false,
      userData: {},
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

  componentDidMount = () => {
    const { firestore } = this.props;
    const { id } = this.state;
    firestore
      .collection('clicks')
      .where('promo', '==', id)
      .onSnapshot(snapshot => {
        // const promotions = snapshot.docs.map(getDocAndId);
        // this.setState({ promotions });
        const dataArray = [];
        // const obj = {};
        snapshot.docs.map(click => {
          const data = click.data();
          getUserDocument(data.user).then(result => {
            const { userData } = this.state;
            if (!userData[data.user]) {
              this.setState({
                userData: { [data.user]: result },
              });
            }
          });
          let arrayValue = [];
          if (dataArray[data.user]) {
            arrayValue = dataArray[data.user];
            dataArray[data.user] = [...arrayValue, data.promo];
            // console.log('working?');
          } else {
            console.log('does this ever happen?', data.user, data.promo);

            dataArray[data.user] = [data.promo];
            console.log('first timezzz', dataArray[data.user]);
          }
          // obj[data.user] = data.promo;
          // dataArray.push(obj);
          // dataArray.push(data.user);
          // newArray.push(data.promo);
        });
        console.log('testy', dataArray, snapshot.docs);
        this.setState({
          // clicks: snapshot.docs,
          clicks: dataArray,
        });
      });
  };

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

  // urlLink = url => {
  //   Linking.openURL(url);
  // };

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
      // busDetails,
      showSpinner,
      promotionTitleReq,
      promotionDetailsReq,
      promoUrlReq,
      // imageSourceReq,
      clicks,
      userData,
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

    let shareData = <></>;
    if (clicks.length) {
      // console.log('here is the clicks?', clicks);
      const clickData = clicks.map((item, key) => {
        console.log('IIIIIIIIII', item);
        // const data = item.data();
        let name = <></>;
        // if (userData[data.user]) {
        if (userData[item]) {
          // name = userData[data.user].displayName;
          name = userData[item].displayName;
        }
        return (
          <View style={promos.tableItemWrap} key={key}>
            <Text style={promos.tableUser}>{name}</Text>
            <Text style={promos.tableCount}>3</Text>
          </View>
        );
      });

      shareData = (
        <View style={promos.tableWrap}>
          <View style={promos.tableHeaderWrap}>
            <Text style={promos.tableHeader}>Users</Text>
            <Text style={promos.tableHeader}>Impressions</Text>
          </View>
          <View style={promos.tableBody}>{clickData}</View>
        </View>
      );
    }

    // snapshot.docs.map(click => {
    //   console.log('click item', click.id, click.data());
    // });

    let toggleArea = <></>;
    if (cardOpen) {
      toggleArea = <View style={promos.sharingDetailsWrap}>{shareData}</View>;
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

          <Modal animationType="slide" visible={modalVisible} transparent>
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
