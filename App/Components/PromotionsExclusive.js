import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsExclusive extends Component {
  render() {
    return <Promotions filter="exclusive" />;
  }
}

module.exports = PromotionsExclusive;
