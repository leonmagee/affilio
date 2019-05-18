import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsExpiring extends Component {
  render() {
    const { navigation } = this.props;
    return <Promotions navigation={navigation} filter="expiring" />;
  }
}

module.exports = PromotionsExpiring;
