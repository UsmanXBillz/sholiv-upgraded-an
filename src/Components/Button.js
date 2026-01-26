import React, {memo} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Colors, Metrix} from '../Config';
import {fonts} from '../Config/Helper';
import {useTranslation} from 'react-i18next';

function Button({
  buttonText = '',
  textStyle = {},
  btnStyle = {},
  onPress = () => {},
  shadow = false,
  disabled = false,
  preIcon = null,
  postIcon = null,
  loading,
}) {
  const {t} = useTranslation();
  // shadow
  //   ? {...styles.buttonStyle, ...styles.btnShadow, ...btnStyle}
  //   : {...styles.buttonStyle, ...btnStyle}
  if (loading) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={loading || disabled}
        style={[
          styles.buttonStyle,
          shadow && styles.btnShadow,
          btnStyle,
          {alignItems: 'center', justifyContent: 'center'},
        ]}
        onPress={onPress}>
        <ActivityIndicator color={'white'} size={'small'} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.buttonStyle, shadow && styles.btnShadow, btnStyle]}
      onPress={onPress}>
      {preIcon}
      <Text
        allowFontScaling={false}
        style={{...styles.btnTextStyle, ...textStyle}}
        numberOfLines={textStyle?.numberOfLines || 1}
        ellipsizeMode="tail">
        {t(buttonText)}
      </Text>
      {postIcon}
    </TouchableOpacity>
  );
}

export default memo(Button);

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(12),
    // paddingVertical: Metrix.VerticalSize(16),
    minHeight: Metrix.VerticalSize(50),
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
  },
  btnShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },

  btnTextStyle: {
    fontSize: Metrix.customFontSize(16),
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
  },
});
