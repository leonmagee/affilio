import React, { Component } from 'react';
import {
  DatePicker,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { colors } from './variables';

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
  constructor() {
    super();
    this.state = {
      modalVisible: false,
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

  render() {
    const { company, promo, end, image } = this.props;
    const { modalVisible } = this.state;
    const endDate = end ? moment(end.toDate()).format('MMMM Do YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;
    const endingDate = '3-3-2019';

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
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <View style={styles.formWrap}>
                <TextInput
                  style={styles.textInput}
                  value={company}
                  onChangeText={e => {
                    this.updateTextInput(e, 'companyName');
                  }}
                  placeholder="Company Name"
                />
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={promo}
                  multiline
                  onChangeText={e => {
                    this.updateTextInput(e, 'newPromo');
                  }}
                  placeholder="Promotion Details"
                />
                <View style={styles.datePickerWrap} />
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

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

module.exports = Promotion;
