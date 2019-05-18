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
    fontSize: 36,
    fontFamily: 'Lato-Black',
    // textAlign: 'center',
  },
  aboutText: {
    color: '#777',
    fontSize: 18,
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
              Efficiently aggregate flexible methodologies via value-added
              mindshare. Monotonectally benchmark innovative processes whereas
              enterprise-wide niches. Credibly deliver progressive.
            </Text>
          </View>
        </View>
        <Footer navigation={navigation} />
      </View>
    );
  }
}

export default About;
