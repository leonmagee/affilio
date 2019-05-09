import React, { Component } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { colors } from './variables';
import { defaults } from './defaultStyles';

const placeholderUrl = require('./Assets/Images/placeholder.jpg');

const styles = StyleSheet.create({
  promotionWrap: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  promoImage: {
    height: 150,
    width: null,
  },
  detailsWrap: {
    paddingVertical: 15,
    paddingHorizontal: 25,
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
    fontSize: 27,
    color: '#111',
    fontFamily: 'Lato-Bold',
    // fontFamily: 'Lato-Regular',
    // fontFamily: 'Lato-Black',
  },
  sectionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 45,
  },
  promoText: {
    color: colors.lightGray,
    fontSize: 19,
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
    fontSize: 19,
    color: colors.lightGray,
    marginRight: 8,
    fontFamily: 'Lato-Regular',
  },
});

class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // copy props into state for update form
      modalVisible: false,
      id: props.id,
      companyName: props.company,
      newPromo: props.promo,
      endingDate: '',
      endDateSubmit: false,
      imageSource: false,
      processing: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  editPromo = () => {
    console.log('click');
    this.setState({
      modalVisible: true,
    });
  };

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  changeImage = () => {
    console.log('lets change the image');
  };

  updateCurrentPromotion = () => {
    const { id, companyName, newPromo } = this.state;
    const { firestore } = this.props;
    console.log('this was clickecccccc', companyName, id);

    const promoRef = firestore.doc(`promos/${id}`);
    promoRef
      .update({
        company: companyName,
        promotion: newPromo,
      })
      .then(() => {
        console.log('updated?');
      });
    this.setState({
      modalVisible: false,
    });

    // const postRef = firestore.doc(`posts/${id}`);
    // const remove = () => postRef.delete();
    // const star = () => postRef.update({ stars: stars + 1 });
  };

  render() {
    const { company, promo, end, image } = this.props;
    const { companyName, newPromo } = this.state;
    const { modalVisible } = this.state;
    const endDate = end ? moment(end.toDate()).format('MMMM Do YYYY') : '';
    const endDateModal = end ? moment(end.toDate()).format('MM-DD-YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;

    return (
      <View style={styles.promotionWrap}>
        <Image style={styles.promoImage} source={imageUrl} />
        <View style={styles.detailsWrap}>
          <View style={styles.companyNameWrap}>
            <Text style={styles.companyName}>{company}</Text>
            <TouchableHighlight onPress={this.editPromo}>
              <Icon name="pencil" size={25} color={colors.brandPrimary} />
            </TouchableHighlight>
          </View>
          <View style={styles.sectionWrap}>
            <View style={styles.iconWrap}>
              <Icon name="tag" size={27} color={colors.lightGray} />
            </View>
            <Text style={styles.promoText}>{promo}</Text>
          </View>
          <View style={styles.sectionWrap}>
            <View style={styles.iconWrap}>
              <Icon name="calendar" size={30} color={colors.lightGray} />
            </View>
            <View style={styles.dateRangeWrap}>
              <Text style={styles.dateItem}>Expires: {endDate}</Text>
            </View>
          </View>

          <View style={styles.shareWrap}>
            <Icon name="facebook" size={33} color={colors.brandPrimary} />
            <Icon name="twitter" size={33} color={colors.brandPrimary} />
            <Icon name="share" size={33} color={colors.brandPrimary} />
          </View>
        </View>

        <Modal
          sytle={{ flex: 1 }}
          animationType="slide"
          transparent
          visible={modalVisible}
        >
          <View style={defaults.modalWrapInner}>
            <Text style={defaults.subTitle}>Update Promotion</Text>
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
              <View style={defaults.datePickerWrap}>
                <DatePicker
                  style={defaults.datePicker}
                  date={endDateModal}
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
              <View style={defaults.imagePreviewModal}>
                <Image style={defaults.imagePreview} source={imageUrl} />
              </View>
              <TouchableHighlight
                style={defaults.imageUploadButton}
                onPress={this.changeImage}
                underlayColor={colors.brandSecond}
              >
                <Text style={defaults.imageUploadText}>Change Image</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={defaults.textSubmit}
                onPress={this.updateCurrentPromotion}
                underlayColor={colors.brandPrimary}
              >
                <Text style={defaults.buttonText}>Update</Text>
              </TouchableHighlight>
              <View style={defaults.closeIconWrap}>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Icon
                    name="close-circle"
                    size={40}
                    color={colors.brandSecond}
                    style={defaults.closeIcon}
                  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

module.exports = Promotion;
