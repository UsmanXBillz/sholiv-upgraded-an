import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import gstyles from '../styles';
import {fonts} from '../Config/Helper';
import {Metrix} from '../Config';
import {useTranslation} from 'react-i18next';

const LableWithSeeAll = ({title, onPress = () => {}, isShowSeeAll = true}) => {
  const {t} = useTranslation();

  return (
    <View style={gstyles.spacedBetweenRow}>
      <Text allowFontScaling={false} style={gstyles.sectionTitle}>{t(title)}</Text>
      {isShowSeeAll && (
        <TouchableOpacity onPress={onPress}>
          <Text allowFontScaling={false} style={styles.seeAll}>{t('SEE_ALL')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(LableWithSeeAll);

const styles = StyleSheet.create({
  seeAll: {
    fontFamily: fonts.RubikRegular,
    color: Colors.blue,
    fontSize: Metrix.customFontSize(18),
    textDecorationLine: 'underline',
  },
});
