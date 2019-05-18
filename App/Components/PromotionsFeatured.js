import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsFeatured extends Component {
  render() {
    return <Promotions filter="featured" />;
  }
}

module.exports = PromotionsFeatured;
