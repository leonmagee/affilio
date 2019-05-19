import React from 'react';
import {
  createBottomTabNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PromotionsWrap from './PromotionsWrap';
import Profile from './Profile';
import Account from './Account';
import About from './About';
import { colors } from '../Styles/variables';

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
    About: {
      screen: About,
      navigationOptions: {
        drawerLabel: 'About',
        drawerIcon: ({ tintColor }) => (
          <Icon name="information" size={26} color={tintColor} />
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

// export const Drawer = createAppContainer(DrawerNavigator);

const TabNavigator = createBottomTabNavigator(
  {
    Promotions: PromotionsWrap,
    Profile,
    About,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Promotions') {
          iconName = 'home';
        } else if (routeName === 'AddPromotion') {
          iconName = 'tag-plus';
        } else if (routeName === 'Profile') {
          iconName = 'account';
        } else if (routeName === 'About') {
          iconName = 'comment-question';
        }
        return <Icon name={iconName} size={35} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.brandPrimary,
      inactiveTintColor: '#DDD',
      showLabel: false,
      style: {
        backgroundColor: '#000',
        height: 75,
      },
    },
  }
);

export default createAppContainer(DrawerNavigator);
