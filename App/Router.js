import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeImage from './HomeImage';
// import Promotions from './Promotions';
import Promotions from './Promotions';
import AddPromotion from './AddPromotion';
import { colors } from './variables';

// const PromoStack = createBottomTabNavigator(
//   {
//     Exclusive: PromotionsExclusive,
//     New: Promotions,
//     Featured: Promotions,
//     Expired: Promotions,
//   },
//   {
//     tabBarOptions: {
//       activeTintColor: colors.brandPrimary,
//       inactiveTintColor: '#AAA',
//       style: {
//         backgroundColor: '#FFF',
//         paddingBottom: 18,
//         height: 60,
//       },
//       labelStyle: {
//         fontSize: 15,
//         fontWeight: 'bold',
//       },
//     },
//   }
// );

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
        backgroundColor: '#000',
        height: 75,
      },
    },
  }
);

export default createAppContainer(TabNavigator);
