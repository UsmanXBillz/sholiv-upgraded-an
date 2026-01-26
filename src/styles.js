import {StyleSheet, Platform} from 'react-native';
import {Colors, Metrix} from './Config';
import {fonts} from './Config/Helper';

export default globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Metrix.HorizontalSize(12),
  },
  flexRow: {
    flexDirection: 'row',
  },
  justifyAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listEmptyStyle: {
    fontFamily: fonts.SemiBold,
    fontSize: Metrix.customFontSize(14),
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(20),
    color: Colors.white,
  },
  centeredAlignedRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacedBetweenRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchTextFieldIconStyle: {
    position: 'absolute',
    zIndex: 100,
    top: Metrix.VerticalSize(25),
    left: Metrix.HorizontalSize(12),
  },
  sectionTitle: {
    marginVertical: Metrix.VerticalSize(15),
    color: Colors.white,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(18),
    marginLeft: Metrix.HorizontalSize(6),
  },
  multiLineTextFieldInput: {
    marginTop: Metrix.VerticalSize(10),
    width: '100%',
    height: Metrix.VerticalSize(44),
    fontSize: Metrix.customFontSize(12),
    padding: 5,
    paddingLeft: Metrix.HorizontalSize(10),
    color: Colors.TEXT_DARK,
    borderRadius: 8,
    borderColor: Colors.LIGHTGRAY,
    borderWidth: 1,
  },
  marginVertical5: {
    marginVertical: Metrix.VerticalSize(5),
  },
  marginVertical8: {
    marginVertical: Metrix.VerticalSize(8),
  },
  marginVertical10: {
    marginVertical: Metrix.VerticalSize(10),
  },
  marginVertical15: {
    marginVertical: Metrix.VerticalSize(15),
  },
  marginVertical20: {
    marginVertical: Metrix.VerticalSize(20),
  },
  marginVertical30: {
    marginVertical: Metrix.VerticalSize(30),
  },
  marginVertical40: {
    marginVertical: Metrix.VerticalSize(40),
  },
  marginVertical50: {
    marginVertical: Metrix.VerticalSize(50),
  },
  marginVertical60: {
    marginVertical: Metrix.VerticalSize(60),
  },
  //margintop
  marginTop5: {
    marginTop: Metrix.VerticalSize(5),
  },
  marginTop10: {
    marginTop: Metrix.VerticalSize(10),
  },
  marginTop20: {
    marginTop: Metrix.VerticalSize(20),
  },
  marginTop30: {
    marginTop: Metrix.VerticalSize(30),
  },
  marginTop40: {
    marginTop: Metrix.VerticalSize(40),
  },
  marginTop50: {
    marginTop: Metrix.VerticalSize(50),
  },
  marginTop70: {
    marginTop: Metrix.VerticalSize(70),
  },
  marginTop100: {
    marginTop: Metrix.VerticalSize(100),
  },
  // marginbottom
  marginBottom10: {
    marginBottom: Metrix.VerticalSize(10),
  },
  marginBottom20: {
    marginBottom: Metrix.VerticalSize(20),
  },
  marginBottom30: {
    marginBottom: Metrix.VerticalSize(30),
  },
  marginBottom40: {
    marginBottom: Metrix.VerticalSize(40),
  },
  marginBottom50: {
    marginBottom: Metrix.VerticalSize(50),
  },
  //marginleft
  marginLeft5: {
    marginLeft: Metrix.HorizontalSize(5),
  },
  marginLeft8: {
    marginLeft: Metrix.HorizontalSize(8),
  },
  marginLeft10: {
    marginLeft: Metrix.HorizontalSize(10),
  },
  marginLeft20: {
    marginLeft: Metrix.HorizontalSize(20),
  },
  marginLeft30: {
    marginLeft: Metrix.HorizontalSize(30),
  },
  marginLeft40: {
    marginLeft: Metrix.HorizontalSize(40),
  },
  marginLeft50: {
    marginLeft: Metrix.HorizontalSize(50),
  },
  //margin right
  marginRight5: {
    marginRight: Metrix.HorizontalSize(5),
  },
  marginRight8: {
    marginRight: Metrix.HorizontalSize(8),
  },
  marginRight10: {
    marginRight: Metrix.HorizontalSize(10),
  },
  marginRight20: {
    marginRight: Metrix.HorizontalSize(20),
  },
  marginRight30: {
    marginRight: Metrix.HorizontalSize(30),
  },
  marginRight40: {
    marginRight: Metrix.HorizontalSize(40),
  },
  marginRight50: {
    marginRight: Metrix.HorizontalSize(50),
  },
  //padding
  paddingVertical10: {
    paddingVertical: Metrix.VerticalSize(10),
  },
  paddingVertical12: {
    paddingVertical: Metrix.VerticalSize(12),
  },
  paddingVertical20: {
    paddingVertical: Metrix.VerticalSize(20),
  },
  paddingHorizontal10: {
    paddingHorizontal: Metrix.HorizontalSize(10),
  },
  paddingHorizontal15: {
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  paddingHorizontal20: {
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  paddingHorizontal30: {
    paddingHorizontal: Metrix.HorizontalSize(43),
  },
  paddingHorizontal40: {
    paddingHorizontal: Metrix.HorizontalSize(40),
  },
  followBtnStyle: {
    backgroundColor: Colors.red,
    width: '33%',
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
  },
  followingBtnStyle: {
    backgroundColor: Colors.blue,
    width: '33%',
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
  },
  editBtnStyle: {
    backgroundColor: Colors.blue,
    width: '42%',
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
  },
  messageBtnStyle: {
    backgroundColor: Colors.blue,
    width: '33%',
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
    marginLeft: Metrix.VerticalSize(10),
  },
  //input-label-style
  labelStyle: {
    color: Colors.placeholder,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(16),
    marginLeft: Metrix.VerticalSize(10),
  },
  input: {
    marginTop: Metrix.VerticalSize(10),
    width: '100%',
    // paddingTop: Metrix.VerticalSize(2),
    paddingRight: Metrix.VerticalSize(5),
    paddingLeft: Metrix.VerticalSize(15),
    // height: Metrix.VerticalSize(44),
    fontSize: Metrix.customFontSize(12),
    borderRadius: 8,
    borderColor: Colors.LIGHTGRAY,
    borderWidth: 1,
    backgroundColor: Colors.WHITE,
    ...Platform.select({
      android: {
        elevation: 0.5,
      },
      ios: {
        shadowColor: '#101828',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  artistName: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    textAlign: 'center',
  },
  artistDescription: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    textAlign: 'center',
  },
  artistDescriptionContainer: {
    width: '80%',
    justifyContent: 'center',
  },

  // end
  whiteContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: fonts.MontserratBold,
    color: Colors.textDarkColor,
    fontSize: Metrix.customFontSize(26),
  },
  desc: {
    fontFamily: fonts.Regular,
    color: Colors.textDarkColor,
    marginVertical: Metrix.VerticalSize(10),
    fontSize: Metrix.customFontSize(14),
  },
  forgotPasswordText: {
    fontFamily: fonts.Regular,
    fontSize: Metrix.customFontSize(14),
    color: Colors.primary,
  },
  scrollViewStyle: {
    flex: 1,
    marginTop: Metrix.VerticalSize(40),
    padding: Metrix.VerticalSize(20),
    marginHorizontal: Metrix.HorizontalSize(10),
    backgroundColor: Colors.white,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  CardTitleText: {
    color: Colors.primary,
    fontFamily: fonts.Medium,
    fontSize: Metrix.customFontSize(14),
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Metrix.VerticalSize(10),
  },
  logoutIconImage: {
    width: Metrix.VerticalSize(30),
    height: Metrix.VerticalSize(30),
  },
  logoutText: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(15),
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(10),
  },
  bottomButtonStyle: {
    position: 'absolute',
    zIndex: 20,
    bottom: Metrix.VerticalSize(40),
    alignSelf: 'center',
  },
  eyeIconStyle: {
    position: 'absolute',
    zIndex: 100,
    top: Metrix.VerticalSize(25),
    right: Metrix.HorizontalSize(15),
  },
  lightGrayDesc: {
    fontFamily: fonts.Regular,
    fontSize: Metrix.customFontSize(12),
    color: Colors.lightGray,
  },
  usernameText: {
    fontFamily: fonts.MontserratBold,
    color: Colors.white,
    fontSize: Metrix.customFontSize(28),
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  customModalWrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrix.HorizontalSize(20),
    borderRadius: 8,
  },
  customModalBtnTextStyle: {
    fontFamily: fonts.MontserratMedium,
  },
  customModalBtnStyle: {
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    marginTop: Metrix.VerticalSize(15),
  },
  customModalMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    width: '90%',
  },
  customModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(20),
  },
  incomeLabel: {
    color: Colors.white,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(16),
  },
  incomeAmount: {
    color: Colors.white,
    fontFamily: fonts.RubikBold,
    fontSize: Metrix.customFontSize(30),
  },
  withdraw: {
    marginRight: Metrix.HorizontalSize(16),
    marginBottom: Metrix.VerticalSize(20),
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -15}],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: Metrix.VerticalSize(10),
  },
  pauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -15}],
    backgroundColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: Metrix.HorizontalSize(8),
    paddingVertical: Metrix.VerticalSize(10),
  },
  postTitleMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.blue,
  },
  textLimitStyle: {
    color: Colors.placeholder,
    fontSize: Metrix.customFontSize(12),
  },
  captionText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(20),
    marginBottom: Metrix.VerticalSize(10),
  },
  width48: {
    width: '48%',
  },
  HeaderTitleText: {
    marginLeft: Metrix.HorizontalSize(16),
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
  },
  exploreDetailContainer: {
    backgroundColor: Colors.liveColorCode,
    padding: Metrix.VerticalSize(6),
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 4,
    left: 2,
    justifyContent: 'center',
  },
  exploreDetailContainerText: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(12),
    // backgroundColor: Colors.liveColorCode,
    paddingHorizontal: Metrix.HorizontalSize(6),
    paddingVertical: Metrix.VerticalSize(4),
    borderRadius: 4,
  },
  verificationBadge: {
    height: Metrix.VerticalSize(33),
    width: Metrix.VerticalSize(33),
    marginLeft: Metrix.HorizontalSize(10),
  },
});
