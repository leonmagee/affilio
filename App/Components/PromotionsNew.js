import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsNew extends Component {
  render() {
    return <Promotions filter="new" />;
  }
}

module.exports = PromotionsNew;
