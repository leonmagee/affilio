import React, { Component } from 'react';
import { Image, Share, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import RNShare, { ShareSheet, Button } from 'react-native-share';
import { colors } from '../Styles/variables';
import { promos } from '../Styles/defaultStyles';

const placeholderUrl = require('../Assets/Images/placeholder.jpg');

// const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry?userId=123&companyName=CopaVida&redirectUrl=https://espn.com';

const baseUrl = 'https://us-central1-affilio.cloudfunctions.net/addDataEntry';

class Promotion extends Component {
  constructor(props) {
    super(props);
    let finalUrl = false;
    if (props.currentUser) {
      const userId = props.currentUser.uid;
      finalUrl = `${baseUrl}?userId=${userId}&companyName=${
        props.company
      }&redirectUrl=${props.url}`;
    }
    this.state = {
      cardOpen: false,
      finalUrl,
    };
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

  render() {
    const { company, promo, start, end, image, loggedIn } = this.props;
    const { cardOpen, finalUrl } = this.state;
    const startDate = start ? moment(start.toDate()).format('MM/DD/YYYY') : '';
    const endDate = end ? moment(end.toDate()).format('MM/DD/YYYY') : '';
    const imageUrl = image ? { uri: image } : placeholderUrl;

    let toggleArea = <></>;
    if (cardOpen && loggedIn) {
      toggleArea = (
        <>
          <View style={promos.sectionWrap}>
            <View style={promos.iconWrap}>
              <Icon name="link" size={28} color={colors.lightGray} />
            </View>
            <View style={promos.dateRangeWrap}>
              <TouchableHighlight
                onPress={this.shareSocial}
                underlayColor="transparent"
              >
                <Text style={promos.url}>{finalUrl}</Text>
              </TouchableHighlight>
            </View>
          </View>
          {/* <View style={promos.shareWrap}>
            <TouchableHighlight onPress={this.shareFacebook}>
              <Icon name="facebook" size={33} color={colors.brandPrimary} />
            </TouchableHighlight>
            <Icon name="twitter" size={33} color={colors.brandPrimary} />
            <Icon name="share" size={33} color={colors.brandPrimary} />
          </View> */}
        </>
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
            <View style={promos.companyNameWrap}>
              <View style={promos.titleWrapInner}>
                <Text style={promos.companyName}>{company}</Text>
                <View style={promos.iconGroup}>
                  <TouchableHighlight
                    style={promos.iconGroupIcon}
                    onPress={this.shareSocial}
                    underlayColor="transparent"
                  >
                    <Icon name="share" size={28} color={colors.brandPrimary} />
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
                <Icon name="tag" size={22} color={colors.lightGray} />
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

const mapActionsToProps = dispatch => ({
  toggleLoginModal(open) {
    dispatch({ type: 'TOGGLE_LOG_IN', payload: open });
  },
});

module.exports = connect(
  mapStateToProps,
  mapActionsToProps
)(Promotion);