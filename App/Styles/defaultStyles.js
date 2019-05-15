import { colors } from './variables';

export const defaults = {
  mainWrap: {
    flex: 1,
    paddingTop: 17,
    backgroundColor: '#fff',
  },
  title: {
    color: '#111',
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  formWrap: {
    marginHorizontal: 20,
    padding: 20,
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
    marginRight: 10,
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
  // modalTitle: {
  //   marginTop: 30,
  // },
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
