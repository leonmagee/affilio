import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import RNFirebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
// import { colors } from './variables';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  formWrap: {
    marginHorizontal: 30,
    padding: 20,
  },
  subTitle: {
    color: '#222',
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'Assistant-Bold',
  },
  textInput: {
    backgroundColor: 'white',
    padding: 7,
    fontSize: 21,
    marginBottom: 20,
    borderColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    color: '#676867',
  },
  textArea: {
    height: 120,
  },
  textSubmit: {
    backgroundColor: '#333',
    alignItems: 'center',
    padding: 15,
  },
  datePickerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Assistant-Bold',
  },
});

class AddPromotion extends Component {
  constructor() {
    super();
    this.state = {
      companyName: '',
      newPromo: '',
      startingDate: '',
      endingDate: '',
      startDateSubmit: '',
      endDateSubmit: '',
    };
  }

  updateTextInput = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  setStartingDate = startingDate => {
    const newStartDate = RNFirebase.firestore.Timestamp.fromDate(
      new Date(startingDate)
    );
    this.setState({
      startingDate,
      startDateSubmit: newStartDate,
    });
  };

  setEndingDate = endingDate => {
    const newEndDate = RNFirebase.firestore.Timestamp.fromDate(
      new Date(endingDate)
    );
    this.setState({
      endingDate,
      endDateSubmit: newEndDate,
    });
  };

  addNewPromotion = () => {
    const {
      companyName,
      newPromo,
      startDateSubmit,
      endDateSubmit,
    } = this.state;
    if (companyName !== '' && newPromo !== '') {
      const promotion = {
        company: companyName,
        promotion: newPromo,
        start: startDateSubmit,
        end: endDateSubmit,
      };
      firestore.collection('promos').add(promotion);
      this.setState({
        companyName: '',
        newPromo: '',
        startingDate: '',
        endingDate: '',
      });
    }
  };

  render() {
    const { companyName, newPromo, startingDate, endingDate } = this.state;

    return (
      <View style={styles.mainWrap}>
        <Text style={styles.subTitle}>Add New Promotion</Text>
        <View style={styles.formWrap}>
          <TextInput
            style={styles.textInput}
            value={companyName}
            onChangeText={e => {
              this.updateTextInput(e, 'companyName');
            }}
            placeholder="company name"
          />
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={newPromo}
            multiline
            onChangeText={e => {
              this.updateTextInput(e, 'newPromo');
            }}
            placeholder="promotion details"
          />
          <View style={styles.datePickerWrap}>
            <DatePicker
              style={styles.datePicker}
              date={startingDate}
              mode="date"
              placeholder="starting date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              minDate={new Date()}
              showIcon={false}
              customStyles={{
                placeholderText: {
                  fontSize: 21,
                },
              }}
              onDateChange={this.setStartingDate}
            />
            <DatePicker
              style={styles.datePicker}
              date={endingDate}
              mode="date"
              placeholder="ending date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              minDate={new Date()}
              showIcon={false}
              customStyles={{
                placeholderText: {
                  fontSize: 21,
                },
              }}
              onDateChange={this.setEndingDate}
            />
          </View>
          <TouchableHighlight
            style={styles.textSubmit}
            onPress={this.addNewPromotion}
          >
            <Text style={styles.buttonText}>Add Promotion</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

module.exports = AddPromotion;
