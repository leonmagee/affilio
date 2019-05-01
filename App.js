import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import RNFirebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
import { getDocAndId } from './App/utils';
// import LinearGradient from 'react-native-linear-gradient';
// import firebase from './App/firebase';
// import firebase, { firestore } from './App/firebase';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor: 'tomato',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  scrollViewWrap: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    // fontFamily: 'Assistant-Bold',
  },
  redditPost: {
    padding: 20,
  },
  redditTitle: {
    color: '#fff',
  },
  thumbnailImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

class App extends Component {
  unsubscribeFromFirestore = null;

  unsubscribeFromAuth = null;

  constructor() {
    super();
    this.state = {
      promotions: [],
    };
  }

  componentDidMount = async () => {
    // this.unsubscribeFromFirestore = firestore
    //   .collection("posts")
    //   .onSnapshot(snapshot => {
    //     const posts = snapshot.docs.map(collectIdsAndDocs);
    //     this.setState({ posts });
    //   });

    this.unsubscribeFromFirestore = firestore
      .collection('promos')
      .onSnapshot(snapshot => {
        const promotions = snapshot.docs.map(getDocAndId);
        this.setState({ promotions });
      });

    // const data = await firestore.collection('promos').get();
    // const promos = await data.docs.map(getDocAndId);
    // this.setState({
    //   promotions: promos,
    // });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  render() {
    const { promotions } = this.state;
    const promos = promotions.map((promo, key) => {
      const { company, promotion } = promo.data;

      return (
        <View key={key}>
          <Text>Company: {company}</Text>
          <Text>Promotion: {promotion}</Text>
        </View>
      );
    });

    return (
      <LinearGradient colors={['#cb2d3e', '#ef473a']} style={styles.mainWrap}>
        <ScrollView style={styles.scrollViewWrap}>
          <Text style={styles.title}>Affilio</Text>
          <View>{promos}</View>
        </ScrollView>
      </LinearGradient>
    );
  }
}

module.exports = App;

// this.state = {
//   promotions: [
//     {
//       id: 'xxxx',
//       data: {
//         company: 'starbucks',
//         promotion: 'free latte',
//       },
//     },
//     {
//       id: 'yyy',
//       data: {
//         company: 'coffee hub',
//         promotion: 'donuts',
//       },
//     },
//   ],
// };
