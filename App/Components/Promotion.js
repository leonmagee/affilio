import React, { Component } from 'react';
import {
  Image,
  Linking,
  Share,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
// import RNShare, { ShareSheet, Button } from 'react-native-share';
import { colors } from '../Styles/variables';
import { defaults, promos } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

// const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry?userId=123&companyName=CopaVida&redirectUrl=https://espn.com';

const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry';

class Promotion extends Component {
  constructor(props) {
    super(props);
    let finalUrl = false;
    if (props.currentUser) {
      const userId = props.currentUser.uid;
      finalUrl = `${baseUrl}?userId=${userId}&promoId=${props.id}&redirectUrl=${
        props.url
      }`;
    }
    console.log(finalUrl, 'ppppppppppppp');
    this.state = {
      cardOpen: false,
      finalUrl,
      busDetails: false,
      userName: '',
    };
    const userDetailsRef = props.firestore.doc(`users/${props.companyId}`);
    userDetailsRef.get().then(result => {
      this.setState({ userName: result._data.displayName });
    });

    const businessDetailsRef = props.firestore.doc(
      `businesses/${props.companyId}`
    );
    businessDetailsRef.get().then(result => {
      this.setState({ busDetails: result._data });
    });
  }

  shareSocial = () => {
    const { finalUrl } = this.state;
    Share.share(
      {
        // message: 'Share Promotion',
        url: finalUrl,
        title: 'PIEC',
      },
      {
        // Android only:
        dialogTitle: 'Share Promotion',
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      }
    );
  };

  toggleCard = () => {
    const { loggedIn, toggleLoginModal } = this.props;
    if (loggedIn) {
      const { cardOpen } = this.state;
      this.setState({
        cardOpen: !cardOpen,
      });
    } else {
      toggleLoginModal(true);
    }
  };

  urlLink = url => {
    Linking.openURL(url);
  };

  render() {
    const { title, promo, start, end, image } = this.props;
    const { cardOpen, busDetails, userName, finalUrl } = this.state;
    const startDate = start ? moment(start.toDate()).format('MM/DD/YYYY') : '';
    const endDate = end ? moment(end.toDate()).format('MM/DD/YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;
    const iconColor = colors.brandPrimary;

    let facebookLink = <></>;
    const socialMediaIconSize = 23;
    if (busDetails.facebook) {
      facebookLink = (
        <TouchableHighlight
          onPress={() => this.urlLink(busDetails.facebook)}
          underlayColor="transparent"
        >
          <Icon
            style={promos.socialIcon}
            name="facebook"
            size={socialMediaIconSize}
            color={iconColor}
          />
        </TouchableHighlight>
      );
    }
    let twitterLink = <></>;
    if (busDetails.twitter) {
      twitterLink = (
        <TouchableHighlight
          onPress={() => this.urlLink(busDetails.twitter)}
          underlayColor="transparent"
        >
          <Icon
            style={promos.socialIcon}
            name="twitter"
            size={socialMediaIconSize}
            color={iconColor}
          />
        </TouchableHighlight>
      );
    }
    let instagramLink = <></>;
    if (busDetails.instagram) {
      instagramLink = (
        <TouchableHighlight
          onPress={() => this.urlLink(busDetails.instagram)}
          underlayColor="transparent"
        >
          <Icon
            style={promos.socialIcon}
            name="instagram"
            size={socialMediaIconSize}
            color={iconColor}
          />
        </TouchableHighlight>
      );
    }

    let socialMediaLinks = <></>;
    if (busDetails.facebook || busDetails.twitter || busDetails.instagram) {
      socialMediaLinks = (
        <View style={promos.socialMediaWrap}>
          {facebookLink}
          {twitterLink}
          {instagramLink}
        </View>
      );
    }

    let userNameLink = <Text style={promos.userNameLink}>{userName}</Text>;
    if (busDetails.website) {
      userNameLink = (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => this.urlLink(busDetails.website)}
        >
          <Text style={promos.userNameLink}>{userName}</Text>
        </TouchableHighlight>
      );
    }

    let addressDetails = <></>;

    if (busDetails.city && busDetails.state && busDetails.zip) {
      addressDetails = (
        <View style={promos.sectionWrap}>
          <View style={promos.iconWrap}>
            <Icon name="map-marker" size={22} color={iconColor} />
          </View>
          <Text style={promos.promoText}>
            {busDetails.city}, {busDetails.state} {busDetails.zip}
          </Text>
        </View>
      );
    }

    let emailAddress = <></>;
    if (busDetails.email) {
      emailAddress = (
        <View style={promos.sectionWrap}>
          <View style={promos.iconWrap}>
            <Icon name="email" size={20} color={iconColor} />
          </View>
          <Text style={promos.promoText}>{busDetails.email}</Text>
        </View>
      );
    }

    let logo = <></>;
    if (busDetails.image) {
      logo = (
        <Image style={promos.promoLogo} source={{ uri: busDetails.image }} />
      );
    }

    let toggleArea = <></>;
    if (cardOpen) {
      toggleArea = (
        <View style={promos.busDetailsWrap}>
          <View style={promos.promoLogoWrap}>
            {logo}
            {userNameLink}
          </View>
          <Text style={promos.detailsText}>{busDetails.details}</Text>
          {addressDetails}
          {emailAddress}
          {socialMediaLinks}
        </View>
      );
    }

    let startingData = <></>;
    if (startDate) {
      startingData = (
        <View style={promos.dateRangeWrap}>
          <Text style={promos.dateItem}>Starts: {startDate} -</Text>
        </View>
      );
    }

    return (
      <TouchableHighlight underlayColor="transparent" onPress={this.toggleCard}>
        <View style={promos.promotionWrap}>
          <Image style={promos.promoImage} source={imageUrl} />
          <View style={promos.detailsWrap}>
            <View style={promos.promotionTitleWrap}>
              <View style={promos.titleWrapInner}>
                <Text style={promos.promotionTitle}>{title}</Text>
                <View style={promos.iconGroup}>
                  <TouchableHighlight
                    style={promos.iconGroupIcon}
                    onPress={this.shareSocial}
                    underlayColor="transparent"
                  >
                    <Icon name="share" size={28} color={iconColor} />
                  </TouchableHighlight>
                </View>
              </View>

              <View style={promos.sectionWrap}>
                {startingData}
                <View style={promos.dateRangeWrap}>
                  <Text style={promos.dateItem}>Expires: {endDate}</Text>
                </View>
              </View>
            </View>
            <View style={promos.sectionWrap}>
              <View style={promos.iconWrap}>
                <Icon name="tag" size={22} color={iconColor} />
              </View>
              <Text style={promos.promoText}>{promo}</Text>
            </View>
            <View style={promos.sectionWrap}>
              <View style={promos.iconWrap}>
                <Icon name="link" size={22} color={iconColor} />
              </View>
              <TouchableHighlight
                onPress={this.shareSocial}
                underlayColor="transparent"
              >
                <Text style={promos.promoLinkText}>{finalUrl}</Text>
              </TouchableHighlight>
            </View>
            {toggleArea}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
});

const mapActionsToProps = dispatch => ({
  toggleLoginModal(open) {
    dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Promotion);
