import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors, Icons, Images, Metrix, NavigationService} from '../Config';
import {fonts, formatAmount} from '../Config/Helper';
import gStyle from '../styles';

const DashboardHeader = ({
  title,
  icon = 'bell',
  notificationCount,
  onPress = () => {},
}) => {
  const user = useSelector(state => state?.AuthReducer?.user);
  const {t} = useTranslation();

  const onWalletPress = () => {
    NavigationService.navigate(
      user?.user_role == 1 ? 'Withdraw' : 'RecentTransactions',
    );
  };

  return (
    <View style={styles.container}>
      <View style={gStyle.centeredAlignedRow}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Icons.Feather
            name={'menu'}
            color={Colors.blue}
            size={Metrix.customFontSize(28)}
          />
        </TouchableOpacity>
        <View style={styles.greetingContainer}>
          <Text allowFontScaling={false} style={styles.greetingText}>
            {t('GREETINGS')}{' '}
          </Text>
          {title && <Text allowFontScaling={false} style={styles.titleText}>{title}</Text>}
          <Image source={Images.logo} style={styles.logo} />
        </View>
      </View>

      <View style={gStyle.centeredAlignedRow}>
        <TouchableOpacity
          style={styles.diaryIcon}
          onPress={onWalletPress}
          activeOpacity={0.7}>
          {/* <TouchableOpacity style={styles.diaryIcon} onPress={()=> NavigationService.navigate('RecentTransactions')} activeOpacity={0.7}> */}
          {/* <TouchableOpacity style={styles.diaryIcon} onPress={()=> NavigationService.navigate('ProfileViewSubscription')} activeOpacity={0.7}> */}
          {user?.user_role == 1 && (
            <View style={styles.notificationBadgeBook}>
              <Text allowFontScaling={false} style={styles.notificationText}>
                ${formatAmount(user?.total_earning) ?? '0.00'}
              </Text>
            </View>
          )}
          <Icons.AntDesign
            name={'book'}
            color={Colors.blue}
            size={Metrix.customFontSize(28)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingLeft: Metrix.HorizontalSize(6)}}
          onPress={() => NavigationService.navigate('Notifications')}
          activeOpacity={0.7}>
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text allowFontScaling={false} style={styles.notificationText}>
                {notificationCount < 10 ? notificationCount : '10+'}
              </Text>
            </View>
          )}
          <Icons.EvilIcons
            name={icon}
            color={Colors.blue}
            size={Metrix.customFontSize(44)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrix.VerticalSize(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    marginLeft: Metrix.HorizontalSize(18),
  },
  greetingText: {
    fontFamily: fonts.Regular,
    fontSize: Metrix.customFontSize(16),
    color: Colors.white,
  },
  titleText: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(20),
    color: Colors.white,
  },
  diaryIcon: {
    marginTop: Metrix.VerticalSize(6),
    paddingHorizontal: Metrix.HorizontalSize(6),
  },
  notificationBadge: {
    backgroundColor: Colors.badgeColor,
    borderRadius: 100,
    width: Metrix.HorizontalSize(25),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -4,
    left: 3,
    zIndex: 1,
  },
  notificationBadgeBook: {
    backgroundColor: Colors.badgeColor,
    borderRadius: 8,
    width: Metrix.HorizontalSize(66),
    padding: 2,
    height: Metrix.HorizontalSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
    left: -46,
    zIndex: 1,
  },
  notificationText: {
    color: Colors.white,
    fontFamily: fonts.RubikMedium,
    fontSize: Metrix.customFontSize(11),
    paddingHorizontal: 2,
  },
  logo: {
    width: Metrix.VerticalSize(100),
    height: Metrix.VerticalSize(20),
    resizeMode: 'contain',
    position: 'absolute',
    left: 36,
  },
});
