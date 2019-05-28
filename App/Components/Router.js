import React, { Component } from 'react';
import { View } from 'react-native';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PromotionsRouter from './PromotionsRouter';
import Profile from './Profile';
import Account from './Account';
import About from './About';
import Footer from './Footer';
import ChangeType from './ChangeType';
import { colors } from '../Styles/variables';

class PromotionsWrap extends Component {
  static router = PromotionsRouter.router;

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <PromotionsRouter navigation={navigation} />
        <Footer navigation={navigation} />
      </View>
    );
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: PromotionsWrap,
      navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
          <Icon name="home" size={26} color={tintColor} />
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        drawerLabel: 'Profile',
        drawerIcon: ({ tintColor }) => (
          <Icon name="account" size={26} color={tintColor} />
        ),
      },
    },
    Account: {
      screen: Account,
      navigationOptions: {
        drawerLabel: 'Account',
        drawerIcon: ({ tintColor }) => (
          <Icon name="account-box" size={26} color={tintColor} />
        ),
      },
    },
    Type: {
      screen: ChangeType,
      navigationOptions: {
        drawerLabel: 'Type',
        drawerIcon: ({ tintColor }) => (
          <Icon name="account-check" size={26} color={tintColor} />
        ),
      },
    },
    About: {
      screen: About,
      navigationOptions: {
        drawerLabel: 'About',
        drawerIcon: ({ tintColor }) => (
          <Icon name="comment-question" size={26} color={tintColor} />
        ),
      },
    },
  },
  {
    intialRouteName: 'Home',
    drawerPosition: 'right',
    drawerBackgroundColor: '#EEE',
    drawerWidth: 180,
    contentOptions: {
      activeTintColor: colors.brandPrimary,
      activeBackgroundColor: '#FFF',
      inactiveTintColor: '#777',
      iconContainerStyle: {
        opacity: 0.9,
        width: 35,
      },
    },
  }
);

export default createAppContainer(DrawerNavigator);
