import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  promotionWrap: {
    paddingVertical: 20,
  },
  companyName: {
    fontSize: 20,
    color: '#444',
    fontFamily: 'Assistant-Bold',
    marginVertical: 3,
  },
  promoText: {
    color: '#888',
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
        <Text style={styles.promoText}>{promo}</Text>
      </View>
    );
  }
}

module.exports = Promotion;
