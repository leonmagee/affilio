import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsFeatured extends Component {
  render() {
    const { navigation } = this.props;
    return <Promotions navigation={navigation} filter="featured" />;
  }
}

module.exports = PromotionsFeatured;
