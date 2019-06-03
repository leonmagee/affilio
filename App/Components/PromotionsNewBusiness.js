import React, { Component } from 'react';
import { View } from 'react-native';
import Promotions from './Promotions';
import Footer from './Footer';

class PromotionsNewBusiness extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Promotions navigation={navigation} filter="new" />
        <Footer navigation={navigation} />
      </View>
    );
  }
}

module.exports = PromotionsNewBusiness;
