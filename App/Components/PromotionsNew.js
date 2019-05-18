import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsNew extends Component {
  render() {
    const { navigation } = this.props;
    return <Promotions navigation={navigation} filter="new" />;
  }
}

module.exports = PromotionsNew;
