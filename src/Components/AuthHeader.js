import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Icons, Metrix} from '../Config';
import {fonts} from '../Config/Helper';
import gStyle from '../styles';

const AuthHeader = ({greeting, containerStyle, title, onPress}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={gStyle.centeredAlignedRow}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{marginRight: 10, display: onPress ? 'flex' : 'none'}}>
          <Icons.AntDesign
            name={'arrowleft'}
            color={Colors.blue}
            size={Metrix.customFontSize(28)}
          />
        </TouchableOpacity>
        <View style={styles.greetingContainer}>
          <Text allowFontScaling={false} style={styles.greetingText}>{greeting}</Text>
          {title && (
            <Text allowFontScaling={false} numberOfLines={3} style={styles.titleText}>
              {title}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default AuthHeader;
const styles = StyleSheet.create({
  container: {
    paddingTop: Metrix.VerticalSize(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    marginLeft: Metrix.HorizontalSize(14),
  },
  greetingText: {
    fontFamily: fonts.MontserratMedium,
    fontSize: Metrix.customFontSize(16),
    color: Colors.white,
    marginBottom: Metrix.VerticalSize(8),
  },
  titleText: {
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
    marginRight: Metrix.HorizontalSize(50),
  },
});
