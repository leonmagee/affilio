import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import RNFirebase, { auth } from 'react-native-firebase';
import { colors } from '../Styles/variables';

import Promotion from './Promotion';
import { getDocAndId } from '../Utils/utils';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    // backgroundColor: '#ddd',
  },
  navWrap: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 17,
    paddingHorizontal: 13,
    backgroundColor: '#fff',
  },
  navItem: {
    fontFamily: 'Lato-Black',
    fontSize: 14,
    color: '#777',
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

    this.unsubscribeFromAuth = RNFirebase.auth().onAuthStateChanged(user => {
      console.log('login state is changing????', user);
      this.setState({ user });
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

  filterId = id => {
    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      .doc(id)
      .onSnapshot(snapshot => {
        const promotions = [getDocAndId(snapshot)];
        this.setState({
          promotions,
          current: '',
        });
      });
  };

  render() {
    const { promotions, current } = this.state;

    return (
      <View style={styles.mainWrap}>
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
        <FlatList
          data={promotions}
          style={{ backgroundColor: '#ddd' }}
          renderItem={({ item }) => (
            <Promotion
              id={item.key}
              company={item.data.company}
              promo={item.data.promotion}
              url={item.data.url}
              start={item.data.start}
              end={item.data.end}
              image={item.data.image}
              firestore={firestore}
              filterId={this.filterId}
            />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  promoFilter: state.promoFilter,
  promos: state.promos,
});

module.exports = connect(mapStateToProps)(Promotions);
