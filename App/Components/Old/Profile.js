import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { colors } from '../Styles/variables';
import { defaults } from '../Styles/defaultStyles';
import LoginButton from './LoginButton';
import Footer from './Footer';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

const iconColor = '#BBB';

const styles = StyleSheet.create({
  titleWrap: {
    marginTop: 20,
    paddingTop: 17,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  profileIconsWrap: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    justifyContent: 'space-around',
  },
  profileIcon: {
    paddingTop: 11,
    paddingHorizontal: 4,
    borderWidth: 10,
  },
  label: {
    textAlign: 'center',
    padding: 7,
    fontSize: 17,
    fontFamily: 'Lato-Bold',
    color: iconColor,
  },
  labelSelect: {
    color: colors.brandPrimary,
    fontFamily: 'Lato-Black',
  },
  logo: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      imageSource: false,
    };
  }

  changeUserType = type => {
    const { changeUserType } = this.props;
    changeUserType(type);
    if (type) {
      AsyncStorage.setItem('@UserType', 'business');
    } else {
      AsyncStorage.setItem('@UserType', 'user');
    }
  };

  imageSelect = () => {
    const options = {
      title: 'Choose Promotion Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 550,
      mediaType: 'photo',
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          imageSource: response.uri,
        });
      }
    });
  };

  render() {
    const { userType, loggedIn, navigation } = this.props;
    const { imageSource } = this.state;
    const imageUrl = imageSource ? { uri: imageSource } : placeholderUrl;

    let businessSettings = <></>;
    if (userType) {
      businessSettings = (
        <View>
          <View style={styles.titleWrap}>
            <Text style={defaults.formSubTitle}>Business Details</Text>
          </View>
          <View style={defaults.formWrap}>
            <TextInput style={defaults.textInput} placeholder="Business Name" />
            <View style={defaults.bigButtonWrap}>
              <TouchableHighlight
                style={[defaults.buttonStyle, defaults.imageUploadButton]}
                onPress={this.imageSelect}
                underlayColor={colors.lightGray}
              >
                <Text style={defaults.buttonText}>Set Business Logo</Text>
              </TouchableHighlight>
            </View>
            <View>
              <Image style={styles.logo} source={imageUrl} />
            </View>
          </View>
        </View>
      );
    }

    let settings = <LoginButton />;
    if (loggedIn) {
      settings = (
        <>
          <View style={styles.titleWrap}>
            <Text style={defaults.formSubTitle}>Change Account Type</Text>
          </View>
          <View style={styles.profileIconsWrap}>
            <TouchableHighlight onPress={() => this.changeUserType(1)}>
              <View>
                <View
                  style={[
                    styles.profileIcon,
                    { borderColor: userType ? colors.brandPrimary : iconColor },
                  ]}
                >
                  <Icon
                    name="office-building"
                    size={80}
                    color={userType ? colors.brandPrimary : iconColor}
                  />
                </View>
                <Text style={[styles.label, userType && styles.labelSelect]}>
                  Business
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.changeUserType(0)}>
              <View>
                <View
                  style={[
                    styles.profileIcon,
                    {
                      borderColor: !userType ? colors.brandPrimary : iconColor,
                    },
                  ]}
                >
                  <Icon
                    name="account"
                    size={80}
                    color={!userType ? colors.brandPrimary : iconColor}
                  />
                </View>
                <Text style={[styles.label, !userType && styles.labelSelect]}>
                  User
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          {businessSettings}
        </>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={defaults.title}>Profile Settings</Text>
          {settings}
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userType: state.userType,
  loggedIn: state.loggedIn,
});

const mapActionsToProps = dispatch => ({
  changeUserType(type) {
    dispatch({ type: 'USER_TYPE', payload: type });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Profile);
