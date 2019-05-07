import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeImage from './HomeImage';
import Promotions from './Promotions';
import AddPromotion from './AddPromotion';
import { colors } from './variables';

const TabNavigator = createBottomTabNavigator(
  {
    HomeImage,
    Promotions,
    AddPromotion,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'HomeImage') {
          iconName = 'home';
        } else if (routeName === 'Promotions') {
          iconName = 'tag';
        } else if (routeName === 'AddPromotion') {
          iconName = 'tag-plus';
        }

        return <Icon name={iconName} size={35} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.brandPrimary,
      inactiveTintColor: '#DDD',
      showLabel: false,
      style: {
        backgroundColor: '#222',
        paddingTop: 15,
      },
    },
  }
);

export default createAppContainer(TabNavigator);
