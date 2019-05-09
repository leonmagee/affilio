import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Router from './App/Router';

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#000',
    padding: 15,
  },
  headerText: {
    color: '#FFF',
  },
});

class AppMain extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>Header Bar - login - toggle</Text>
        </View>
        <Router />
      </View>
    );
  }
}

module.exports = AppMain;
