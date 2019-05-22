// import React from 'react';
import {
  // createBottomTabNavigator,
  createAppContainer,
  // createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import PromotionsWrap from './PromotionsWrap';
import LoginProfile from './LoginProfile';
// import Account from './Account';
// import About from './About';
import SignUp from './SignUp';
// import { colors } from '../Styles/variables';

const navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}`,
});

const LoginStack = createStackNavigator(
  {
    ChooseType: {
      screen: SignUp,
      navigationOptions: {
        title: 'AccountType',
        headerBackTitle: 'Back',
        headerTitleStyle: {
          color: '#111',
          // padding: 0,
          // margin: 0,
          // fontFamily: 'Lato-Bold',
          fontFamily: 'Lato-Bold',
          fontSize: 23,
        },
      },
    },
    ProfileSettings: {
      screen: LoginProfile,
      navigationOptions,
    },
  },
  {
    // mode: 'modal',
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: '#FFF',
      },
    }),
    transparentCard: true,
    defaultNavigationOptions: {
      headerStyle: {
        // backgroundColor: 'transparent',
        // headerTransparent: true,
        // height: 57,
        // paddingTop: 0,
        // paddingBottom: 15,
        // height: 60,
        paddingBottom: 10,
      },
      // headerTransparent: true,
      headerTitleStyle: {
        // header you switch too - required data?
        color: '#111',
        fontFamily: 'Lato-Bold',
        fontSize: 23,
      },
      headerBackTitleStyle: {
        color: '#777',
        fontSize: 15,
        fontFamily: 'Lato-Bold',
      },
      headerTintColor: '#777', // back arrow
      //     cardStyle: {
      //   backgroundColor: 'transparent',
      //   opacity: 1,
      // },
      // transitionConfig: () => ({
      //   containerStyle: {
      //     backgroundColor: 'transparent',
      //   },
      // })
    },
  }
);

// const DrawerNavigator = createDrawerNavigator(
//   {
//     Home: {
//       screen: SignUp,
//       navigationOptions: {
//         drawerLabel: 'Home',
//         drawerIcon: ({ tintColor }) => (
//           <Icon name="home" size={26} color={tintColor} />
//         ),
//       },
//     },
//     Profile: {
//       screen: Profile,
//       navigationOptions: {
//         drawerLabel: 'Profile',
//         drawerIcon: ({ tintColor }) => (
//           <Icon name="account" size={26} color={tintColor} />
//         ),
//       },
//     },
//     Account: {
//       screen: Account,
//       navigationOptions: {
//         drawerLabel: 'Account',
//         drawerIcon: ({ tintColor }) => (
//           <Icon name="account-box" size={26} color={tintColor} />
//         ),
//       },
//     },
//     Type: {
//       screen: SignUp,
//       navigationOptions: {
//         drawerLabel: 'Type',
//         drawerIcon: ({ tintColor }) => (
//           <Icon name="account-check" size={26} color={tintColor} />
//         ),
//       },
//     },
//     About: {
//       screen: About,
//       navigationOptions: {
//         drawerLabel: 'About',
//         drawerIcon: ({ tintColor }) => (
//           <Icon name="comment-question" size={26} color={tintColor} />
//         ),
//       },
//     },
//   },
//   {
//     intialRouteName: 'Home',
//     drawerPosition: 'right',
//     drawerBackgroundColor: '#EEE',
//     drawerWidth: 180,
//     contentOptions: {
//       activeTintColor: colors.brandPrimary,
//       activeBackgroundColor: '#FFF',
//       inactiveTintColor: '#777',
//       iconContainerStyle: {
//         opacity: 0.9,
//         width: 35,
//       },
//     },
//   }
// );

// export const Drawer = createAppContainer(DrawerNavigator);

// const TabNavigator = createBottomTabNavigator(
//   {
//     Promotions: PromotionsWrap,
//     Profile,
//     About,
//   },
//   {
//     defaultNavigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ tintColor }) => {
//         const { routeName } = navigation.state;
//         let iconName;
//         if (routeName === 'Promotions') {
//           iconName = 'home';
//         } else if (routeName === 'AddPromotion') {
//           iconName = 'tag-plus';
//         } else if (routeName === 'Profile') {
//           iconName = 'account';
//         } else if (routeName === 'About') {
//           iconName = 'comment-question';
//         }
//         return <Icon name={iconName} size={35} color={tintColor} />;
//       },
//     }),
//     tabBarOptions: {
//       activeTintColor: colors.brandPrimary,
//       inactiveTintColor: '#DDD',
//       showLabel: false,
//       style: {
//         backgroundColor: '#000',
//         height: 75,
//       },
//     },
//   }
// );

export default createAppContainer(LoginStack);
