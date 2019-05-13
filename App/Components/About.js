import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';

const styles = StyleSheet.create({
  aboutWrap: {
    paddingTop: 15,
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
    return (
      <View style={defaults.mainWrap}>
        <Text style={defaults.title}>PIEC</Text>
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
    );
  }
}

export default About;
