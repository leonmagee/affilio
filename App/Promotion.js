import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './variables';

const styles = StyleSheet.create({
  promotionWrap: {
    marginBottom: 50,
  },
  companyName: {
    fontSize: 27,
    color: '#444',
    fontFamily: 'Assistant-Bold',
    marginVertical: 10,
  },
  promoWrap: {
    flexDirection: 'row',
  },
  promoText: {
    color: colors.lightGray,
    paddingLeft: 10,
    fontSize: 18,
    flex: 1,
  },
  promoImage: {
    height: 100,
    // width: 200,
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
        <Text style={styles.companyName}>{company}</Text>
        <View style={styles.promoWrap}>
          <Icon name="tag" size={27} color={colors.lightGray} />
          <Text style={styles.promoText}>{promo}</Text>
        </View>
      </View>
    );
  }
}

module.exports = Promotion;
