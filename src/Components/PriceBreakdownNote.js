import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Metrix} from '../Config';
import {fonts} from '../Config/Helper';

const PriceBreakdownNote = () => {
  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>
        Price breakdown
      </Text>
      <Text allowFontScaling={false} style={styles.note}>
        Artists earn 40% of every earnings, with 30% supporting platform
        operations and 30% covering Apple/Google transaction processing fees.
      </Text>
      <Text allowFontScaling={false} style={styles.note}>
        The payout for the artist will take approximately 30-45 days to be
        processed.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
    paddingHorizontal: Metrix.HorizontalSize(14),
    paddingVertical: Metrix.VerticalSize(12),
    marginTop: Metrix.VerticalSize(20),
    marginBottom: Metrix.VerticalSize(24),
  },
  title: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(14),
    color: Colors.white,
    marginBottom: Metrix.VerticalSize(6),
  },
  note: {
    fontFamily: fonts.MontserratRegular,
    fontSize: Metrix.customFontSize(12),
    color: Colors.placeholderLight,
    lineHeight: Metrix.VerticalSize(18),
  },
});

export default PriceBreakdownNote;
