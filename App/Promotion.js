import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  companyName: {
    fontSize: 27,
    color: '#444',
    fontFamily: 'Assistant-Bold',
    marginBottom: 10,
  },
  promoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    color: colors.lightGray,
    paddingLeft: 13,
    fontSize: 18,
    flex: 1,
  },
  shareWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

class Promotion extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { company, promo } = this.props;
    return (
      <View style={styles.promotionWrap}>
        <Image
          style={styles.promoImage}
          source={{ uri: 'https://picsum.photos/600/200' }}
        />
        <View style={styles.detailsWrap}>
          <Text style={styles.companyName}>{company}</Text>
          <View style={styles.promoWrap}>
            <Icon name="tag" size={27} color={colors.lightGray} />
            <Text style={styles.promoText}>{promo}</Text>
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

module.exports = Promotion;
