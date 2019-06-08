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
import { promos } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

// const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry?userId=123&companyName=CopaVida&redirectUrl=https://espn.com';

const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry';

class Promotion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardOpen: false,
      finalUrl: false,
      busDetails: false,
      userName: '',
    };
    // console.log('what are my props?', props);
    if (props.currentUser) {
      const userId = props.currentUser.uid;
      const finalUrl = `${baseUrl}?userId=${userId}&promoId=${
        props.id
      }&redirectUrl=${props.url}`;
      // this.setState({ finalUrl });
      this.rebrandlyApi(finalUrl);
    }

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

  rebrandlyApi = url => {
    const linkRequest = {
      destination: url,
      domain: { fullName: 'promo.mypiec.com' },
      // , slashtag: "A_NEW_SLASHTAG"
      // , title: "Rebrandly YouTube channel"
    };

    const YOUR_API_KEY = '456feafa5b4c40079ba09a6459695ca5';

    const requestHeaders = {
      'Content-Type': 'application/json',
      apikey: YOUR_API_KEY,
      // workspace: YOUR_WORKSPACE_ID,
    };

    const rbUrl = 'https://api.rebrandly.com/v1/links';

    fetch(rbUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(linkRequest),
    })
      .then(result => {
        // console.log('rebrandly result?', result);
        result.json().then(newResult => {
          this.setState({ finalUrl: newResult.shortUrl });
          // console.log('short url result?', newResult.shortUrl);
        });
      })
      .catch(error => {
        console.error('you have an error?', error);
      });
  };

  shareSocial = () => {
    const { finalUrl } = this.state;
    if (finalUrl) {
      Share.share(
        {
          message: finalUrl,
          // url: finalUrl,
          title: 'PIEC',
        },
        {
          // Android only:
          dialogTitle: 'Share Promotion',
          // iOS only:
          excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
        }
      );
    }
  };

  toggleCard = () => {
    // this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    // this.props.ref.scrollToOffset({ animated: true, offset: 0 });

    const { scroll, scrollKey } = this.props;

    const { loggedIn, toggleLoginModal } = this.props;
    if (loggedIn) {
      const { cardOpen } = this.state;
      this.setState({
        cardOpen: !cardOpen,
      });
    } else {
      toggleLoginModal(true);
    }

    setTimeout(function() {
      scroll(scrollKey);
    }, 100);
  };

  urlLink = url => {
    Linking.openURL(url);
  };

  sendEmail = email => {
    // Linking.openURL(mailto: email)
    // Linking.openURL(mailto: ${ email })
    const emailAddress = `mailto:${email}`;
    Linking.openURL(emailAddress);
  };

  render() {
    const { title, promo, start, end, image, exclusive } = this.props;
    const { cardOpen, busDetails, userName, finalUrl } = this.state;
    const startDate = start ? moment(start.toDate()).format('MM/DD/YYYY') : '';
    const endDate = end ? moment(end.toDate()).format('MM/DD/YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;
    const iconColor = colors.brandPrimary;

    let facebookLink = <></>;
    const socialMediaIconSize = 23;
    if (busDetails) {
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
    }
    let twitterLink = <></>;
    if (busDetails) {
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
    }
    let instagramLink = <></>;
    if (busDetails) {
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
    }

    let socialMediaLinks = <></>;
    if (busDetails) {
      if (busDetails.facebook || busDetails.twitter || busDetails.instagram) {
        socialMediaLinks = (
          <View style={promos.socialMediaWrap}>
            {facebookLink}
            {twitterLink}
            {instagramLink}
          </View>
        );
      }
    }

    let userNameLink = <Text style={promos.userNameLink}>{userName}</Text>;
    if (busDetails) {
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
    }

    let addressDetails = <></>;
    if (busDetails) {
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
    }

    let emailAddress = <></>;
    if (busDetails) {
      if (busDetails.email) {
        emailAddress = (
          <View style={promos.sectionWrap}>
            <View style={promos.iconWrap}>
              <Icon name="email" size={20} color={iconColor} />
            </View>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => this.sendEmail(busDetails.email)}
            >
              <Text style={promos.promoText}>{busDetails.email}</Text>
            </TouchableHighlight>
          </View>
        );
      }
    }

    let logo = <></>;
    if (busDetails) {
      if (busDetails.image) {
        logo = (
          <Image style={promos.promoLogo} source={{ uri: busDetails.image }} />
        );
      }
    }

    let toggleArea = <></>;
    if (cardOpen && busDetails) {
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

    let shareExlusiveIcon = <></>;
    let shareLinkArea = <></>;
    if (exclusive) {
      shareExlusiveIcon = (
        <Icon name="star" size={28} color={colors.brandOrange} />
      );
    } else {
      shareExlusiveIcon = (
        <TouchableHighlight
          style={promos.iconGroupIcon}
          onPress={this.shareSocial}
          underlayColor="transparent"
        >
          <Icon name="share" size={28} color={iconColor} />
        </TouchableHighlight>
      );
      shareLinkArea = (
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
                <View style={promos.iconGroup}>{shareExlusiveIcon}</View>
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
            {shareLinkArea}
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
