import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { colors } from './variables';

const styles = StyleSheet.create({
  promotionWrap: {
    // marginBottom: 50,
    borderWidth: 2,
    // borderColor: '#dfdfdf',
    borderColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 20,
    marginVertical: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
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
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    borderBottomWidth: 1,
  },
  companyName: {
    fontSize: 27,
    color: '#111',
    // fontFamily: 'Assistant-Bold',
    // fontFamily: 'Lato-Regular',
    fontFamily: 'Lato-Bold',
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
    // marginTop: 20,
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
  render() {
    const { company, promo, start, end, image } = this.props;
    const startDate = start
      ? moment(start.toDate()).format('MMMM Do YYYY')
      : '';
    const endDate = end ? moment(end.toDate()).format('MMMM Do YYYY') : '';

    const placeholderUrl = require('./Assets/Images/placeholder.jpg');
    // const imageUrl = image || 'https://picsum.photos/600/200';
    const imageUrl = image ? { uri: image } : placeholderUrl;
    // const imageUrl = image || require('./Assets/Images/placeholder.jpg');

    return (
      <View style={styles.promotionWrap}>
        <Image style={styles.promoImage} source={imageUrl} />
        <View style={styles.detailsWrap}>
          <View style={styles.companyNameWrap}>
            <Text style={styles.companyName}>{company}</Text>
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
      </View>
    );
  }
}

Promotion.propTypes = {
  company: PropTypes.string,
  promo: PropTypes.string,
  start: PropTypes.object,
  end: PropTypes.object,
  image: PropTypes.string,
};

module.exports = Promotion;
