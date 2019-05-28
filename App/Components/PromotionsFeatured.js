import React, { Component } from 'react';
import Promotions from './Promotions';

class PromotionsFeatured extends Component {
  // componentDidMount() {
  //   this.props.navigation.navigate('New');
  //   // navigation.navigate('Home');
  // }

  render() {
    const { navigation } = this.props;
    return <Promotions navigation={navigation} filter="featured" />;
  }
}

module.exports = PromotionsFeatured;
