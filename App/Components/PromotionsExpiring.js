import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsExpiring extends Component {
  render() {
    return <Promotions filter="expiring" />;
  }
}

module.exports = PromotionsExpiring;
