import { createAppContainer, createStackNavigator } from 'react-navigation';
import LoginStart from './LoginStart';
import LoginType from './LoginType';
import SignUpStart from './SignUpStart';
import LoginProfile from './LoginProfile';

const LoginStack = createStackNavigator(
  {
    LoginStart: {
      screen: LoginStart,
      navigationOptions: {
        title: 'Login',
        headerBackTitle: 'Back',
      },
    },
    ChooseType: {
      screen: LoginType,
      navigationOptions: {
        title: 'Account Type',
        headerBackTitle: 'Back',
      },
    },
    SignUpStart: {
      screen: SignUpStart,
      navigationOptions: {
        title: 'Sign Up',
        headerBackTitle: 'Back',
      },
    },
    ProfileSettings: {
      screen: LoginProfile,
      navigationOptions: {
        title: 'Create Profile',
        headerBackTitle: 'Back',
      },
    },
  },
  {
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: '#FFF',
      },
    }),
    transparentCard: true,
    defaultNavigationOptions: {
      headerForceInset: { top: 'never', bottom: 'never' },
      headerStyle: {
        marginTop: 10,
        paddingBottom: 10,
        height: 50,
      },
      headerTitleStyle: {
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
    },
  }
);

export default createAppContainer(LoginStack);
