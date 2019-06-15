import React, { Component } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
// import AsyncStorage from '@react-native-community/async-storage';
import RNFirebase from 'react-native-firebase';
import { getUserDocument } from './App/Utils/utils';
import Router from './App/Components/Router';
import LoginRouter from './App/Components/LoginRouter';
import { colors } from './App/Styles/variables';
import { defaults } from './App/Styles/defaultStyles';

const styles = StyleSheet.create({
  headerBar: {
    paddingBottom: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Baumans-Regular',
    color: colors.brandOrange,
    fontSize: 28,
  },
});

class App extends Component {
  unsubscribeFromAuth = null;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      backgroundColor: '#373738',
    };
  }

  async componentDidMount() {
    const { changeUserType, setCurrentUser, userLoggedIn } = this.props;
    try {
      /**
       * @todo user type will have nothing to do with async storage - this will
       * be set when you login...
       * only users with email / password can be business users.
       */
      // const value = await AsyncStorage.getItem('@UserType');
      // if (value === 'business') {
      //   changeUserType(1);
      // } else {
      //   changeUserType(0);
      // }

      const { currentUser } = RNFirebase.auth();
      if (currentUser) {
        userLoggedIn(1);
        const user = await getUserDocument(currentUser.uid);
        setCurrentUser(user);

        console.log('here is the current user info...', user);
        if (user.isBusiness) {
          changeUserType(1);
        }

        this.setState({
          loading: false,
          backgroundColor: '#000',
        });
      } else {
        this.setState({
          loading: false,
          backgroundColor: '#000',
        });
        userLoggedIn(0);
      }
    } catch (error) {
      console.error('user type error', error);
    }

    this.unsubscribeFromAuth = RNFirebase.auth().onAuthStateChanged(user => {
      if (user) {
        userLoggedIn(1);
      } else {
        userLoggedIn(0);
      }
    });
  }

  componentWillUnmount = () => {
    // this._isMounted = false;
    this.unsubscribeFromAuth();
  };

  render() {
    const { backgroundColor, loading } = this.state;
    const { loggedIn, userType } = this.props;

    let mainContent = (
      <View style={defaults.processingWrap}>
        <ActivityIndicator size="large" color={colors.brandOrange} />
      </View>
    );
    if (!loading) {
      const headerBar = (
        <View style={styles.headerBar}>
          <Text style={styles.logo}>PIEC</Text>
        </View>
      );

      let RouterComponent;
      if (loggedIn) {
        RouterComponent = Router;
      } else {
        RouterComponent = LoginRouter;
      }

      mainContent = (
        <View style={{ flex: 1 }}>
          {headerBar}
          <RouterComponent />
        </View>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        {mainContent}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
  userType: state.userType,
});

const mapActionsToProps = dispatch => ({
  userLoggedIn(type) {
    dispatch({ type: 'LOGGED_IN', payload: type });
  },
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
  setCurrentUser(user) {
    dispatch({ type: 'CURRENT_USER', payload: user });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(App);
