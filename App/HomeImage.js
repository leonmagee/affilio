import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

let { width, height } = Dimensions.get('window');
height -= 80;

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    backgroundColor: '#222',
  },
  appTitleWrap: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 4000,
  },
  appTitle: {
    color: '#fff',
    fontSize: 80,
    fontFamily: 'Assistant-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: null,
    height: null,
  },
});

class HomeImage extends Component {
  render() {
    return (
      <View style={styles.mainWrap}>
        <Image
          source={require('./Assets/Images/blurry-buses.png')}
          style={styles.imageContainer}
        />
        <View style={styles.appTitleWrap}>
          <Text style={styles.appTitle}>AFFILIO</Text>
        </View>
      </View>
    );
  }
}

module.exports = HomeImage;
