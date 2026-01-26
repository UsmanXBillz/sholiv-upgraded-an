import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {Colors, Icons, Images, Metrix, NavigationService} from '../Config';
import {fonts} from '../Config/Helper';
import gstyles from '../styles';

const Header = ({
  back = true,
  goBackFunc = () => NavigationService.goBack(),
  backBtnColor = Colors.white,
  title,
  icon = 'bell',
  isIcon = true,
  isChat = false,
  isImage = false,
  image = null,
  isProfile = null,
  iconPress = () => {},
  handleOptionsToggle = () => {},
  onLeftIconPress = () => {},
  disabled = false,
  profileImage = null,
  isLoggedUser = false,
  showIconTop = false,
  renderRightIcon,
}) => {
  return (
    <View>
      {showIconTop && (
        <View
          style={{
            marginLeft: Metrix.HorizontalSize(43),
            bottom: Metrix.HorizontalSize(-20),
          }}>
          <Image
            source={Images.logo}
            // height={40}
            // width={70}
            resizeMode="contain"
            style={{height: 40, width: 70}}
          />
        </View>
      )}
      <View style={[styles.container, showIconTop && {paddingTop: 0}]}>
        <View style={styles.titleContainer}>
          {back && (
            <TouchableOpacity onPress={goBackFunc} activeOpacity={0.7}>
              <Icons.AntDesign
                name={'arrowleft'}
                color={Colors.blue}
                size={Metrix.customFontSize(28)}
              />
            </TouchableOpacity>
          )}
          {isChat && (
            <View>
              <Image
                source={{uri: profileImage}}
                style={styles.notificationImageStyle}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: 10,
                  backgroundColor: Colors.onlineGreen,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
          )}
          {title && (
            <Text allowFontScaling={false} style={[gstyles.HeaderTitleText, {color: backBtnColor}]}>
              {title}
            </Text>
          )}
        </View>
        {isProfile && !isLoggedUser && (
          <TouchableOpacity onPress={handleOptionsToggle}>
            <Icons.Feather
              name={'more-vertical'}
              color={Colors.placeholder}
              size={Metrix.customFontSize(33)}
            />
          </TouchableOpacity>
        )}

        {isIcon && !isImage && (
          <TouchableOpacity
            style={[styles.backBtnContainer]}
            onPress={iconPress}
            activeOpacity={0.7}
            disabled={disabled}>
            {title?.toLowerCase().includes('setting') ||
            title?.toLowerCase().includes('change password') ? (
              <Icons.AntDesign
                name={icon}
                color={Colors.blue}
                size={Metrix.customFontSize(33)}
              />
            ) : (
              <Icons.EvilIcons
                name={icon}
                color={Colors.blue}
                size={Metrix.customFontSize(33)}
              />
            )}
          </TouchableOpacity>
        )}
        {isIcon && isImage && (
          <TouchableOpacity onPress={onLeftIconPress} disabled={disabled}>
            <Image source={image} style={styles.iconImage} />
          </TouchableOpacity>
        )}
        {renderRightIcon && renderRightIcon()}
      </View>
    </View>
  );
};

export default memo(Header);

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrix.VerticalSize(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationImageStyle: {
    width: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    borderRadius: 100,
    marginLeft: Metrix.HorizontalSize(15),
    position: 'relative',
  },
  iconImage: {
    height: Metrix.VerticalSize(40),
    resizeMode: 'contain',
  },
  titleText: {
    marginLeft: Metrix.HorizontalSize(16),
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
  },
  whiteLine: {
    width: '40%',
    height: Metrix.VerticalSize(5),
    marginTop: Metrix.VerticalSize(10),
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  quizImageStyle: {
    width: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
  },
});
