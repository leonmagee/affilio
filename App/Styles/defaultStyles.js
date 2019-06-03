import { colors } from './variables';

export const defaults = {
  mainWrap: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
  titleWrap: {
    marginBottom: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  title: {
    color: '#111',
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  formWrap: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  inputGroup: {
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: 'white',
    paddingVertical: 7,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    marginBottom: 20,
    borderColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    color: '#676867',
    // flex: 1,
  },
  required: {
    backgroundColor: colors.required,
    borderColor: colors.brandSecond,
  },
  warning: {
    fontFamily: 'Lato-Black',
    backgroundColor: colors.brandSecond,
    paddingVertical: 15,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 15,
    marginBottom: 20,
    // textAlign: 'center',
  },
  textArea: {
    height: 100,
  },
  datePickerWrap: {
    flexDirection: 'row',
  },
  datePicker: {
    marginBottom: 20,
    flex: 1,
  },
  bigButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageUploadButton: {
    backgroundColor: '#999',
  },
  cancelButton: {
    backgroundColor: colors.brandSecond,
    marginRight: 10,
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    flex: 1,
  },
  // button: {
  //   paddingVertical: 14,
  //   color: '#FFF',
  //   fontSize: 18,
  //   fontFamily: 'Lato-Black',
  //   textAlign: 'center',
  //   backgroundColor: '#222',
  // },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Lato-Black',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: 0.1,
  },
  blueButton: {
    backgroundColor: colors.brandPrimary,
  },
  redButton: {
    backgroundColor: colors.brandSecond,
  },
  loginButton: {
    width: 280,
    marginBottom: 20,
  },
  updateSubmitButton: {
    backgroundColor: colors.brandPrimary,
    marginLeft: 10,
  },
  imagePreviewModal: {
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  imagePreviewWrap: {
    backgroundColor: '#eee',
    height: 140,
  },
  indicatorWrapModal: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 140,
  },
  logoPreviewWrap: {
    alignItems: 'center',
  },
  logoPreview: {
    height: 70,
    width: 70,
    borderRadius: 35,
    marginTop: -5,
  },
  processingWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  hiddenItem: {
    padding: 5,
    opacity: 0,
  },
  modalWrapInner: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 40,
    marginBottom: 20,
    marginHorizontal: 13,
    borderRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  formWrapModal: {
    paddingHorizontal: 20,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 30,
    paddingBottom: 25,
    marginBottom: 30,
    backgroundColor: '#fcfcfc',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  buttonWrap: {
    alignItems: 'center',
  },
  indicatorWrap: {
    paddingTop: 15,
  },
  formSubTitle: {
    paddingBottom: 15,
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  radioButtonWrap: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopColor: colors.borderColor,
    borderTopWidth: 1,
  },
  radioButtonInner: {
    paddingBottom: 7,
  },
};

export const promos = {
  promotionWrap: {
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.05,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  promoImage: {
    height: 160,
    width: null,
  },
  detailsWrap: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#FFF',
  },
  promotionTitleWrap: {
    marginBottom: 10,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    borderBottomWidth: 1,
  },
  titleWrapInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  promotionTitle: {
    fontSize: 24,
    color: '#111',
    fontFamily: 'Lato-Bold',
  },
  sectionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  iconWrap: {
    width: 35,
    alignItems: 'center',
    marginRight: 10,
  },
  promoText: {
    color: '#444',
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    flex: 1,
  },
  promoLinkText: {
    color: colors.brandPrimary,
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    paddingRight: 50,
  },
  userNameLink: {
    color: colors.brandPrimary,
    fontFamily: 'Lato-Black',
    fontSize: 19,
  },
  shareWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dateRangeWrap: {
    flexDirection: 'row',
  },
  dateItem: {
    fontSize: 13,
    color: colors.lightGray,
    marginRight: 8,
    fontFamily: 'Lato-Regular',
  },
  url: {
    fontSize: 12,
    color: colors.brandPrimary,
    paddingRight: 40,
    fontFamily: 'Lato-Regular',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconGroupIcon: {
    marginLeft: 20,
  },
  linkUrl: {
    fontSize: 13,
    color: colors.lightGray,
    marginRight: 8,
    fontFamily: 'Lato-Regular',
  },
  sharingDetailsWrap: {
    // backgroundColor: '#ddd',
  },
  sharingDetails: {
    // color: 'tomato',
  },
  busDetailsWrap: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 13,
    marginTop: 8,
  },
  detailsText: {
    fontFamily: 'Lato-Regular',
    color: '#888',
    fontSize: 14,
    marginVertical: 10,
  },
  promoLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoLogo: {
    height: 38,
    width: 38,
    borderRadius: 19,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  socialMediaWrap: {
    flexDirection: 'row',
    marginTop: 5,
    paddingTop: 13,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  socialIcon: {
    marginRight: 15,
  },
  tableWrap: {
    // padding: 10,
    // backgroundColor: '#ddd',
  },
  tableHeaderWrap: {
    paddingVertical: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  tableHeader: {
    fontFamily: 'Lato-Black',
    color: '#777',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  tableBody: {
    // padding: 10,
  },
  tableItemWrap: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableUser: {
    fontSize: 15,
    fontFamily: 'Lato-Black',
    flex: 1,
    textAlign: 'center',
    color: colors.brandSecond,
  },
  tableCount: {
    fontSize: 20,
    fontFamily: 'Lato-Black',
    flex: 1,
    textAlign: 'center',
    color: colors.brandPrimary,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: 0.05,
  },
  noActivityWrap: {
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 3,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    alignItems: 'center',
  },
  noActivityText: {
    color: '#777',
    fontFamily: 'Lato-Bold',
  },
};

//   <View style={promos.tableItemWrap}>
//     <Text style={promos.tableUser}>Leon Magee</Text>
//     <Text style={promos.tableCount}>3

// promos.tableWrap}>
//   <View style={promos.tableHeaderWrap}>
//     <Text style={promos.tableHeader}>Users</Text>
//     <Text style={promos.tableHeader}>Impressions</Text>
//   </View>
//   <View style={promos.tableBody}>
//     <View style={promos.tableLeft} />
//     <View style={promos.tableRight} />
