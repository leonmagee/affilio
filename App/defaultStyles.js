import { colors } from './variables';

export const defaults = {
  subTitle: {
    color: '#111',
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  formWrap: {
    marginHorizontal: 30,
    padding: 20,
    flex: 1,
  },
  textInput: {
    backgroundColor: 'white',
    paddingVertical: 7,
    paddingHorizontal: 14,
    fontSize: 19,
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
  imageUploadButton: {
    backgroundColor: colors.brandSecond,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  textSubmit: {
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lato-Bold',
  },
  imagePreviewWrap: {
    marginTop: 20,
    paddingHorizontal: 50,
  },
  imagePreviewModal: {
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  imagePreview: {
    height: 100,
  },
  processingWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  modalWrapInner: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    marginVertical: 80,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    flex: 1,
  },
  closeIconWrap: {
    textAlign: 'center',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  // closeIcon: {
  //   backgroundColor: 'red',
  //   // flex: 1,
  // },
};
