import React, { Component } from 'react';
import { View } from 'react-native';
import PromotionsRouter from './PromotionsRouter';
import Footer from './Footer';

class PromotionsFeatured extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <PromotionsRouter />
        <Footer navigation={navigation} />
      </View>
    );
  }
}

module.exports = PromotionsFeatured;
