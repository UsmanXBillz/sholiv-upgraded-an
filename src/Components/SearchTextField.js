import React, {memo} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import TextField from './TextField';
import gstyle from '../styles';
import {fonts} from '../Config/Helper';
import {useTranslation} from 'react-i18next';

const SearchTextField = ({
  placeholder = 'SEARCH',
  autofocus,
  value,
  onChangeText,
  style = {},
  placeholderTextColor = Colors.placeholder,
  isIcon = true,
}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.searchContainer}>
      <View style={{width: isIcon ? '90%' : '100%'}}>
        <View
          style={[
            gstyle.searchTextFieldIconStyle,
            {
              top: Metrix.VerticalSize(Platform.OS === 'ios' ? 26 : 25),
              left: Metrix.HorizontalSize(12),
            },
          ]}>
          <Icons.Feather
            name={'search'}
            color={Colors.white}
            size={Metrix.customFontSize(18)}
          />
        </View>
        <TextField
          placeholder={t(placeholder)}
          value={value}
          autofocus={autofocus}
          onChangeText={text => onChangeText(text)}
          style={[styles.searchTextStyle, {...style}]}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
      {isIcon && (
        <View style={styles.iconContainer}>
          <Icons.Feather
            name={'search'}
            color={Colors.white}
            size={Metrix.customFontSize(18)}
          />
        </View>
      )}
    </View>
  );
};
export default memo(SearchTextField);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 7,
    paddingRight: 5,
  },
  iconContainer: {
    backgroundColor: Colors.blue,
    padding: Metrix.VerticalSize(14),
    borderRadius: 11,
    marginTop: Metrix.VerticalSize(8),
  },
  searchTextStyle: {
    paddingLeft: Metrix.HorizontalSize(22),
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
  },
});
