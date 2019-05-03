import React, { Component } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import RNFirebase from 'react-native-firebase';

import Promotion from './Promotion';
import { getDocAndId } from './utils';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 50,
  },
  scrollViewWrap: {
    flex: 1,
  },
  subSectionWrap: {
    marginVertical: 15,
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
  textInput: {
    backgroundColor: 'white',
    padding: 7,
    fontSize: 21,
    marginBottom: 20,
  },
  textSubmit: {
    backgroundColor: '#333',
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
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
      companyName: '',
      newPromo: '',
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

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  addNewPromotion = () => {
    const { companyName, newPromo } = this.state;
    if (companyName !== '' && newPromo !== '') {
      const promotion = {
        company: companyName,
        promotion: newPromo,
      };
      firestore.collection('promos').add(promotion);
      this.setState({
        companyName: '',
        newPromo: '',
      });
    }
  };

  render() {
    const { promotions, companyName, newPromo } = this.state;

    return (
      <View style={styles.mainWrap}>
        <ScrollView style={styles.scrollViewWrap}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>Affilios</Text>
          </View>

          <View style={styles.subSectionWrap}>
            <Text style={styles.subTitle}>Current Promotions</Text>
            <FlatList
              data={promotions}
              renderItem={({ item }) => (
                <Promotion
                  company={item.data.company}
                  promo={item.data.promotion}
                />
              )}
            />
          </View>
          <View style={styles.subSectionWrap}>
            <Text style={styles.subTitle}>Add New Promotion</Text>
            <View style={styles.formWrap}>
              <TextInput
                style={styles.textInput}
                value={companyName}
                onChangeText={e => {
                  this.updateTextInput(e, 'companyName');
                }}
                placeholder="company name"
              />
              <TextInput
                style={styles.textInput}
                value={newPromo}
                onChangeText={e => {
                  this.updateTextInput(e, 'newPromo');
                }}
                placeholder="promotions"
              />
              <TouchableHighlight
                style={styles.textSubmit}
                onPress={this.addNewPromotion}
              >
                <Text style={styles.buttonText}>Add Promotion</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

module.exports = Promotions;
