import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {Colors, Metrix} from '../Config';

const Loader = () => {
  const loading = useSelector(state => state?.LoaderReducer?.loading);
  // console.log("loading======", loading)

  return loading ? (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    </View>
  ) : null;
};

export default Loader;

const styles = StyleSheet.create({
  loadingContainer: {
    height: Metrix.VerticalSize(),
    width: Metrix.HorizontalSize(),
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrapper: {
    paddingHorizontal: Metrix.VerticalSize(15),
    paddingVertical: Metrix.VerticalSize(15),
    borderRadius: Metrix.VerticalSize(100),
    backgroundColor: Colors.black,
    padding: 2,
  },
});
