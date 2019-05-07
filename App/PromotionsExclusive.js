import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import RNFirebase from 'react-native-firebase';

import Promotion from './Promotion';
import { getDocAndId } from './utils';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
});

class Promotions extends Component {
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
      .where('exclusive', '==', true)
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

    return (
      <View style={styles.mainWrap}>
        {/* <View style={styles.titleWrap}>
          <Text style={styles.title}>Current Promotions</Text>
        </View> */}
        <FlatList
          data={promotions}
          renderItem={({ item }) => (
            <Promotion
              company={item.data.company}
              promo={item.data.promotion}
              start={item.data.start}
              end={item.data.end}
              image={item.data.image}
            />
          )}
        />
      </View>
    );
  }
}

module.exports = Promotions;
