import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Promotions from './Promotions';
// import AddPromotion from './AddPromotion';
import Profile from './Profile';
import About from './About';
import { colors } from '../Styles/variables';

const TabNavigator = createBottomTabNavigator(
  {
    Promotions,
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

export default createAppContainer(TabNavigator);
