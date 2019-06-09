import React, { Component } from 'react';
import {
  Dimensions,
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
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../Styles/variables';
import Promotion from './Promotion';
import PromotionBusiness from './PromotionBusiness';
import { getDocAndId } from '../Utils/utils';
import { defaults, promos } from '../Styles/defaultStyles';
import AddPromotion from './AddPromotion';
import { CloseIcon } from './CloseIcon';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

let promoPadding = 0;
if (deviceWidth > 700) {
  promoPadding = 100;
}

const firestore = RNFirebase.firestore();

const styles = StyleSheet.create({
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
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getItemLayout = (data, index) => ({
    length: deviceHeight * 0.6,
    offset: deviceHeight * 0.6 * index,
    index,
  });

  scrollToIndex = index => {
    this.flatListRef.scrollToIndex({ animated: true, index });
  };

  componentDidMount = () => {
    const { filter } = this.props;

    if (filter === 'new') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({ promotions });
        });
    } else if (filter === 'exclusive') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('exclusive', '==', true)
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
          });
        });
    } else if (filter === 'featured') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('featured', '==', true)
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
          });
        });
    } else if (filter === 'expiring') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
          });
        });
    }
  };

  componentWillUnmount = () => {
    this.unsubscribeFromFirestore();
  };

  render() {
    const { promotions, modalVisible } = this.state;
    const { currentUser, loggedIn, navigation, userType } = this.props;

    let addNewPromo = <></>;

    let promotionsData = promotions;

    if (userType) {
      promotionsData = promotions.filter(
        promo => promo.data.companyId === currentUser.uid
      );
      addNewPromo = (
        <TouchableHighlight
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
      <View style={promos.mainWrap}>
        <FlatList
          data={promotionsData}
          style={{ backgroundColor: '#ddd', paddingHorizontal: promoPadding }}
          ref={ref => {
            this.flatListRef = ref;
          }}
          getItemLayout={this.getItemLayout}
          keyExtractor={item => item.key}
          renderItem={({ item, index }) => {
            if (userType && loggedIn) {
              return (
                <PromotionBusiness
                  scrollKey={index}
                  scroll={this.scrollToIndex}
                  id={item.key}
                  title={item.data.title}
                  companyId={item.data.companyId}
                  promo={item.data.promotion}
                  url={item.data.url}
                  start={item.data.start}
                  end={item.data.end}
                  image={item.data.image}
                  firestore={firestore}
                  exclusive={item.data.exclusive}
                />
              );
            }
            return (
              <Promotion
                scrollKey={index}
                scroll={this.scrollToIndex}
                id={item.key}
                title={item.data.title}
                companyId={item.data.companyId}
                promo={item.data.promotion}
                url={item.data.url}
                start={item.data.start}
                end={item.data.end}
                image={item.data.image}
                firestore={firestore}
                exclusive={item.data.exclusive}
              />
            );
          }}
        />
        {addNewPromo}
        <Modal animationType="slide" visible={modalVisible} transparent>
          <ScrollView style={defaults.modalWrapInner}>
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
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  promoFilter: state.promoFilter,
  userType: state.userType,
  loggedIn: state.loggedIn,
  currentUser: state.currentUser,
});

module.exports = connect(mapStateToProps)(Promotions);
