import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './variables';
import HomeImage from './HomeImage';
import AddPromotion from './AddPromotion';

// import Promotions from './Promotions';

// let { width, height } = Dimensions.get('window');
// height -= 80;

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    backgroundColor: '#222',
  },
  navBar: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 'home',
    };
  }

  goToHome = () => {
    this.setState({
      currentPage: 'home',
    });
  };

  goToAddPromo = () => {
    this.setState({
      currentPage: 'addPromo',
    });
  };

  goToSettings = () => {};

  render() {
    let visiblePage = <HomeImage />;
    const { currentPage } = this.state;

    if (currentPage === 'addPromo') {
      visiblePage = (
        <View>
          <Text>xxx</Text>
        </View>
      );
    }
    return (
      <View style={styles.mainWrap}>
        {visiblePage}
        <View style={styles.navBar}>
          <Button
            onPress={this.goToHome}
            buttonStyle={{ backgroundColor: 'transparent' }}
            icon={<Icon name="home" size={35} color={colors.lighterGray} />}
          />
          <Button
            onPress={() => {
              console.log('clickz');
            }}
            buttonStyle={{ backgroundColor: 'transparent' }}
            icon={<Icon name="tag" size={35} color={colors.lighterGray} />}
          />
          <Button
            onPress={this.goToAddPromo}
            buttonStyle={{ backgroundColor: 'transparent' }}
            icon={<Icon name="tag-plus" size={35} color={colors.lighterGray} />}
          />
          <Button
            onPress={this.goToSettings}
            buttonStyle={{ backgroundColor: 'transparent' }}
            icon={<Icon name="account" size={35} color={colors.lighterGray} />}
          />
        </View>
      </View>
    );
  }
}

module.exports = Homepage;
