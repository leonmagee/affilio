import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  createAppContainer,
  createMaterialTopTabNavigator,
} from 'react-navigation';
// import Promotions from './Promotions';
import PromotionsFeatured from './PromotionsFeatured';
import PromotionsNew from './PromotionsNew';
import PromotionsExclusive from './PromotionsExclusive';
import PromotionsExpiring from './PromotionsExpiring';
import { colors } from '../Styles/variables';
// exclusive - new - featured - expiring

const SlideNavigator = createMaterialTopTabNavigator(
  {
    Featured: PromotionsFeatured,
    New: PromotionsNew,
    Exclusive: PromotionsExclusive,
    Expiring: PromotionsExpiring,
  },
  {
    // defaultNavigationOptions: ({ navigation }) => ({
    //   tabBarLabel: () => {
    //     const { routeName } = navigation.state;
    //     let newRouteName;
    //     if (routeName === 'Expires') {
    //       newRouteName = 'Expires Soon';
    //     } else {
    //       newRouteName = routeName;
    //     }
    //     return <Text>{newRouteName}</Text>;
    //   },
    // }),
    tabBarOptions: {
      activeTintColor: '#555',
      inactiveTintColor: '#777',
      indicatorStyle: {
        backgroundColor: colors.brandPrimary,
        height: 3,
      },
      // animationEnabled: true,
      labelStyle: {
        fontSize: 12,
      },
      tabStyle: {
        width: 100,
      },
      style: {
        backgroundColor: '#fff',
        paddingVertical: 10,
      },
    },
  }
);

export default createAppContainer(SlideNavigator);
