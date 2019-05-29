import React, { Component } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import RNFirebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../Styles/variables';
import Promotion from './Promotion';
import PromotionBusiness from './PromotionBusiness';
import { getDocAndId } from '../Utils/utils';
import { defaults } from '../Styles/defaultStyles';
import AddPromotion from './AddPromotion';
import { CloseIcon } from './CloseIcon';

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
  },
  navWrap: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 17,
    paddingHorizontal: 13,
    backgroundColor: '#fff',
  },
  navItem: {
    fontFamily: 'Lato-Black',
    fontSize: 14,
    color: '#777',
  },
  navItemSelected: {
    color: colors.brandPrimary,
  },
  addNewPromoWrap: {
    // backgroundColor: 'tomato',
    position: 'absolute',
    top: 20,
    left: 20,
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  plusIcon: {
    marginTop: 1.5,
    marginLeft: 0.5,
  },
});

class Promotions extends Component {
  unsubscribeFromFirestore = null;

  constructor() {
    super();
    this.state = {
      promotions: [],
      // current: 'all',
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount = () => {
    const { userType, loggedIn, filter } = this.props;

    if (filter === 'new') {
      if (userType && loggedIn) {
        this.unsubscribeFromFirestore = firestore
          .collection('promos')
          // .where('companyId', '==', currentUser.uid)
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const promotions = snapshot.docs.map(getDocAndId);
            this.setState({ promotions });
          });
      } else {
        this.unsubscribeFromFirestore = firestore
          .collection('promos')
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const promotions = snapshot.docs.map(getDocAndId);
            this.setState({ promotions });
          });
      }
    } else if (filter === 'exclusive') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('exclusive', '==', true)
        // .orderBy('createdAt')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
            current: 'ex',
          });
        });
    } else if (filter === 'featured') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('exclusive', '==', true)
        // .orderBy('createdAt')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
            current: 'ex',
          });
        });
    } else if (filter === 'expiring') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('exclusive', '==', true)
        // .orderBy('createdAt')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
            current: 'ex',
          });
        });
    }
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  render() {
    const { promotions, modalVisible } = this.state;
    const { userType, loggedIn, navigation } = this.props;

    let addNewPromo = <></>;

    if (userType) {
      addNewPromo = (
        <TouchableHighlight
          // onPress={this.addPromo}
          onPress={() => this.setModalVisible(!modalVisible)}
          style={styles.addNewPromoWrap}
          underlayColor="#fff"
        >
          <Icon
            style={styles.plusIcon}
            name="plus-circle"
            size={40}
            color={colors.brandPrimary}
          />
        </TouchableHighlight>
      );
    }

    return (
      <View style={styles.mainWrap}>
        <FlatList
          data={promotions}
          style={{ backgroundColor: '#ddd' }}
          renderItem={({ item }) => {
            if (userType && loggedIn) {
              return (
                <PromotionBusiness
                  id={item.key}
                  title={item.data.title}
                  companyId={item.data.companyId}
                  promo={item.data.promotion}
                  url={item.data.url}
                  start={item.data.start}
                  end={item.data.end}
                  image={item.data.image}
                  firestore={firestore}
                  filterId={this.filterId}
                />
              );
            }
            return (
              <Promotion
                id={item.key}
                title={item.data.title}
                companyId={item.data.companyId}
                promo={item.data.promotion}
                url={item.data.url}
                start={item.data.start}
                end={item.data.end}
                image={item.data.image}
                firestore={firestore}
                filterId={this.filterId}
              />
            );
          }}
        />
        {addNewPromo}
        <Modal animationType="slide" visible={modalVisible}>
          <View style={defaults.modalWrapInner}>
            <View style={defaults.modalHeader}>
              <CloseIcon
                toggle={() => {
                  this.setModalVisible(!modalVisible);
                }}
              />
              <Text style={defaults.title}>Add New Promotion</Text>
              <Text style={defaults.hiddenItem}>X</Text>
            </View>
            <AddPromotion
              modalToggle={() => {
                this.setModalVisible(!modalVisible);
              }}
              navigation={navigation}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  promoFilter: state.promoFilter,
  userType: state.userType,
  loggedIn: state.loggedIn,
  // currentUser: state.currentUser,
});

module.exports = connect(mapStateToProps)(Promotions);
