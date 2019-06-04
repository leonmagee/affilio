import React, { Component } from 'react';
import { View } from 'react-native';
import Promotions from './Promotions';
import Footer from './Footer';
import { promos } from '../Styles/defaultStyles';

class PromotionsNewBusiness extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={promos.mainWrap}>
          <Promotions navigation={navigation} filter="new" />
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

module.exports = PromotionsNewBusiness;
