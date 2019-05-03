import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import moment from 'moment';
import { colors } from './variables';

const styles = StyleSheet.create({
  promotionWrap: {
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  promoImage: {
    height: 120,
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
    color: '#444',
    fontFamily: 'Assistant-Bold',
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
    fontSize: 18,
    flex: 1,
  },
  shareWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dateRangeWrap: {
    flexDirection: 'row',
  },
  dateItem: {
    fontSize: 18,
    color: colors.lightGray,
    marginRight: 8,
  },
});

class Promotion extends Component {
  render() {
    const { company, promo, start, end } = this.props;
    console.log(start);
    const startDate = moment(start.toDate()).format('MMMM Do YYYY');
    const endDate = moment(end.toDate()).format('MMMM Do YYYY');
    return (
      <View style={styles.promotionWrap}>
        <Image
          style={styles.promoImage}
          source={{ uri: 'https://picsum.photos/600/200' }}
        />
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
              <Text style={styles.dateItem}>{startDate}</Text>
              <Icon
                name="arrow-right"
                size={20}
                color={colors.lightGray}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.dateItem}>{endDate}</Text>
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
};

module.exports = Promotion;
