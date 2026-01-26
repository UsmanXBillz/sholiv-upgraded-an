import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Icons, Metrix } from '../Config';
import TextField from './TextField';
import gstyle from '../styles';
import { fonts } from '../Config/Helper';

const SeparatorBar = () => {
  return (
    <View style={styles.barContainer}>
      <View style={styles.bar}></View>
      <View style={styles.circle}></View>
      <View style={[styles.circle, { backgroundColor: Colors.lightGray }]}></View>
      <View style={styles.bar}></View>
    </View>
  )
}

export default memo(SeparatorBar);

const styles = StyleSheet.create({
  bar: {
    height: Metrix.VerticalSize(6),
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    width: '40%'
  },
  circle: {
    backgroundColor: Colors.blue,
    height: Metrix.VerticalSize(14),
    width: Metrix.HorizontalSize(14),
    borderRadius: 100,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Metrix.VerticalSize(20)
  }
})