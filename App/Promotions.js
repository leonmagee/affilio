import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import RNFirebase from 'react-native-firebase';
import { colors } from './variables';

import Promotion from './Promotion';
import { getDocAndId } from './utils';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  navWrap: {
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 17,
  },
  navItem: {
    // fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: '#aaa',
  },
  navItemSelected: {
    color: colors.brandPrimary,
  },
});

class Promotions extends Component {
  unsubscribeFromFirestore = null;

  unsubscribeFromAuth = null;

  constructor() {
    super();
    this.state = {
      promotions: [],
      current: 'all',
    };
  }

  componentDidMount = () => {
    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const promotions = snapshot.docs.map(getDocAndId);
        this.setState({ promotions });
      });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  filterAll = () => {
    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const promotions = snapshot.docs.map(getDocAndId);
        this.setState({
          promotions,
          current: 'all',
        });
      });
  };

  filterExclusive = () => {
    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      .where('exclusive', '==', true)
      // .orderBy('createdAt')
      .onSnapshot(snapshot => {
        const promotions = snapshot.docs.map(getDocAndId);
        this.setState({
          promotions,
          current: 'ex',
        });
      });
  };

  render() {
    const { promotions, current } = this.state;

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
        <View style={styles.navWrap}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.filterAll}
          >
            <Text
              style={[
                styles.navItem,
                current === 'all' && styles.navItemSelected,
              ]}
            >
              New
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.filterExclusive}
          >
            <Text
              style={[
                styles.navItem,
                current === 'ex' && styles.navItemSelected,
              ]}
            >
              Exclusive
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.filterAll}
          >
            <Text
              style={[
                styles.navItem,
                current === 'feat' && styles.navItemSelected,
              ]}
            >
              Featured
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.filterAll}
          >
            <Text
              style={[
                styles.navItem,
                current === 'soon' && styles.navItemSelected,
              ]}
            >
              Expires Soon
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = Promotions;
