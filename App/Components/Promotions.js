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
  // mainWrap: {
  //   flex: 1,
  // },
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

  getItemLayout = (data, index) => ({
    length: deviceHeight * 0.6,
    offset: deviceHeight * 0.6 * index,
    index,
  });

  scrollToIndex = index => {
    // let randomIndex = Math.floor(Math.random(Date.now()) * this.props.data.length);
    this.flatListRef.scrollToIndex({ animated: true, index });
  };

  componentDidMount = () => {
    // this.flatListRef.scrollToIndex({ animated: true, index: 0.2 });
    // this.list.scrollToIndex(3);
    const { currentUser, userType, loggedIn, filter } = this.props;

    if (filter === 'new') {
      if (userType && loggedIn) {
        this.unsubscribeFromFirestore = firestore
          .collection('promos')
          // .where('companyId', '==', currentUser.uid)
          .orderBy('createdAt', 'asc')
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
            // current: 'ex',
          });
        });
    } else if (filter === 'featured') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .where('featured', '==', true)
        // .orderBy('createdAt')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
            // current: 'ex',
          });
        });
    } else if (filter === 'expiring') {
      this.unsubscribeFromFirestore = firestore
        .collection('promos')
        .orderBy('createdAt', 'asc')
        // .orderBy('createdAt')
        .onSnapshot(snapshot => {
          const promotions = snapshot.docs.map(getDocAndId);
          this.setState({
            promotions,
            // current: 'ex',
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

    // const scrollKey = 0;

    return (
      <View style={promos.mainWrap}>
        {/* <TouchableHighlight onPress={() => this.scrollToIndex(2)}>
          <Text
            style={{
              padding: 20,
              color: '#fff',
              fontSize: 20,
              backgroundColor: 'tomato',
            }}
          >
            Scroll me
          </Text>
        </TouchableHighlight> */}
        <FlatList
          data={promotions}
          style={{ backgroundColor: '#ddd', paddingHorizontal: promoPadding }}
          ref={ref => {
            this.flatListRef = ref;
          }}
          getItemLayout={this.getItemLayout}
          keyExtractor={item => item.key}
          // initialScrollIndex={1}
          // initialNumToRender={3}
          renderItem={({ item, index }) => {
            // renderItem={({ item }, scrollKey) => {
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
