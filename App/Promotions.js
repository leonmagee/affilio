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
  scrollViewWrap: {
    flex: 1,
  },
  titleWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    color: '#200',
    fontSize: 30,
    textAlign: 'center',
    padding: 15,
    fontFamily: 'Assistant-Bold',
  },
  subTitle: {
    color: '#222',
    fontSize: 23,
    textAlign: 'center',
    padding: 13,
    fontFamily: 'Assistant-Bold',
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
        <View style={styles.subSectionWrap}>
          <Text style={styles.subTitle}>Current Promotions</Text>
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
      </View>
    );
  }
}

module.exports = Promotions;
