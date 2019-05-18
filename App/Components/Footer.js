import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../Styles/variables';

const styles = StyleSheet.create({
  bottomNavWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 18,
  },
});

class Footer extends Component {
  openDrawer = () => {
    const { navigation } = this.props;
    navigation.openDrawer();
  };

  goToPromotions = () => {
    const { navigation } = this.props;
    navigation.navigate('Home');
  };

  render() {
    return (
      <View style={styles.bottomNavWrap}>
        <TouchableHighlight onPress={this.goToPromotions}>
          <Icon name="home" size={36} color="#ddd" />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.openDrawer}>
          <IconMaterial name="settings" size={36} color="#ddd" />
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = Footer;
