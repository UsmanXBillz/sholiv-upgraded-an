import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fonts} from '../Config/Helper';
import {Colors, Metrix} from '../Config';
import {useTranslation} from 'react-i18next';

const Tabs = ({
  style = {},
  onPress,
  tabs = [],
  profile = true,
  selectedTab,
  tabLabelStyle = {},
  tabStyle = {},
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.tabContainer, {...style}]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          onPress={() => {
            onPress(tab, index);
          }}
          style={{...tabStyle}}>
          {index === selectedTab && !profile && (
            <View style={styles.selectedBorderTop} />
          )}
          <Text
            allowFontScaling={false}
            style={[
              styles.tabLabel,
              index === selectedTab && !profile && {color: Colors.blue},
              index === selectedTab && styles.selectedBorderBottom,
              {...tabLabelStyle},
              tab == 'VIDEO_STREAMING' && {color: 'red', fontWeight:"500"},
            ]}>
            {t(tab)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    width: '62%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrix.VerticalSize(10),
  },
  tabLabel: {
    color: Colors.white,
    fontFamily: fonts.LatoRegular,
    fontSize: Metrix.customFontSize(15),
    paddingHorizontal: Metrix.HorizontalSize(22),
    paddingVertical: Metrix.VerticalSize(6),
    textAlign: 'center',
  },
  selectedBorderTop: {
    borderWidth: 1,
    borderColor: Colors.blue,
    width: Metrix.HorizontalSize(14),
  },
  selectedBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
});
