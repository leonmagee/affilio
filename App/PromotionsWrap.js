import React, { Component } from 'react';
// import { View } from 'react-native';
import RNFirebase from 'react-native-firebase';
import Promotions from './Promotions';

import { getDocAndId } from './utils';

const firestore = RNFirebase.firestore();

class PromotionsWrap extends Component {
  unsubscribeFromFirestore = null;

  unsubscribeFromAuth = null;

  constructor() {
    super();
    this.state = {
      promotions: [],
    };
  }

  componentDidMount = () => {
    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      // .where('exclusive', '==', true)
      .onSnapshot(snapshot => {
        const promotions = snapshot.docs.map(getDocAndId);
        this.setState({ promotions });
      });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  render() {
    const { promotions } = this.state;
    return <Promotions promotions={promotions} />;
  }
}

module.exports = PromotionsWrap;
