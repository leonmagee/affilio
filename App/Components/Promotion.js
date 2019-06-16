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
import { colors } from '../Styles/variables';
import { promos } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

const baseUrl =
  'https://us-central1-piec-1192e.cloudfunctions.net/addDataEntry';

class Promotion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardOpen: false,
      finalUrl: false,
      busDetails: false,
      userName: '',
    };
  }

  componentDidMount = () => {
    const { companyId, currentUser, id, firestore, url } = this.props;
    if (currentUser) {
      const userId = currentUser.uid;
      const finalUrl = `${baseUrl}?userId=${userId}&promoId=${id}&redirectUrl=${url}`;
      this.setState({ finalUrl });
    }

    const userDetailsRef = firestore.doc(`users/${companyId}`);
    userDetailsRef
      .get()
      .then(result => {
        this.setState({
          userName: result._data.displayName,
        });
      })
      .catch(error => {
        console.log('promise rejected', error);
      });

    const businessDetailsRef = firestore.doc(`businesses/${companyId}`);
    businessDetailsRef.get().then(result => {
      this.setState({
        busDetails: result._data,
      });
    });
  };

  shareSocial = () => {
    const { finalUrl } = this.state;
    if (finalUrl) {
      Share.share(
        {
          // message: finalUrl,
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
    }
  };

  toggleCard = () => {
    const { scroll, scrollKey, loggedIn } = this.props;
    if (loggedIn) {
      const { cardOpen } = this.state;
      this.setState({
        cardOpen: !cardOpen,
      });
    }
    // else {
    //   toggleLoginModal(true);
    // }

    setTimeout(function() {
      scroll(scrollKey);
    }, 100);
  };

  urlLink = url => {
    Linking.openURL(url);
  };

  sendEmail = email => {
    const emailAddress = `mailto:${email}`;
    Linking.openURL(emailAddress);
  };

  render() {
    const { title, promo, start, end, image, exclusive } = this.props;
    const { cardOpen, busDetails, userName } = this.state;
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

// const mapActionsToProps = dispatch => ({
//   toggleLoginModal(open) {
//     dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
//   },
// });

module.exports = connect(
  mapStateToProps
  // mapActionsToProps
)(Promotion);
