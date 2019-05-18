import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsExclusive extends Component {
  render() {
    const { navigation } = this.props;
    return <Promotions navigation={navigation} filter="exclusive" />;
  }
}

module.exports = PromotionsExclusive;
