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
    fontSize: 17,
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
    fontSize: 20,
    marginBottom: 20,
    // textAlign: 'center',
  },
  textArea: {
    height: 120,
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
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  imageUploadButton: {
    backgroundColor: '#999',
  },
  cancelButton: {
    backgroundColor: colors.brandSecond,
    marginRight: 10,
  },
  button: {
    padding: 15,
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lato-Black',
    textAlign: 'center',
    backgroundColor: '#222',
  },
  blueButton: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 13,
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
  imagePreview: {
    height: 100,
    marginBottom: 20,
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
    paddingTop: 35,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 30,
    paddingBottom: 20,
  },
  formWrapModal: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
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
  companyNameWrap: {
    marginBottom: 10,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    borderBottomWidth: 1,
  },
  titleWrapInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyName: {
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
    width: 42,
  },
  promoText: {
    color: '#444',
    fontSize: 17,
    flex: 1,
    fontFamily: 'Lato-Regular',
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
  businessDetailsWrap: {
    backgroundColor: '#fdfdfd',
    borderColor: '#ebebeb',
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
  },
  busTitle: {
    color: colors.brandPrimary,
    fontSize: 25,
    fontFamily: 'Lato-Bold',
    paddingBottom: 5,
  },
  busAddress: {
    color: '#656565',
    fontSize: 16,
    fontFamily: 'Lato-Regular',
  },
  cszWrap: {
    flexDirection: 'row',
  },
  csz: {
    fontFamily: 'Lato-Regular',
    color: '#656565',
    fontSize: 15,
    marginRight: 5,
  },
  website: {
    color: colors.brandPrimary,
    fontFamily: 'Lato-Bold',
  },
  socialMediaWrap: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 15,
    justifyContent: 'space-around',
  },
};
