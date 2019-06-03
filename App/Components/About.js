import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';
import Footer from './Footer';

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'Baumans-Regular',
    color: '#111',
    fontSize: 60,
    textAlign: 'center',
  },
  aboutWrap: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  aboutTextTitle: {
    color: colors.brandPrimary,
    fontSize: 30,
    fontFamily: 'Lato-Black',
    // textAlign: 'center',
  },
  aboutText: {
    color: '#777',
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginTop: 15,
  },
});

class About extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={defaults.mainWrap}>
          <Text style={styles.logo}>PIEC</Text>
          <View style={styles.aboutWrap}>
            <Text style={styles.aboutTextTitle}>
              Posts Incentivized to Elevate the Clout
            </Text>
            <Text style={styles.aboutText}>
              PIEC is an online platform that provides businesses qualified
              leads by incentivizing customer posts. Utilizing customer’s social
              circle connects businesses with people of similar interests as
              their customers. While improving business’s success, customers are
              empowered by giving them incentives for the use of their data as
              well as the power to choose who to share their data with. Our
              vision is to become a trusted transparent data-sharing platform
              where people truly own their personal data. We want to eliminate
              the misuse of personal data from companies who profit off them and
              give people the power to reclaim their personal data.
            </Text>
          </View>
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

export default About;
