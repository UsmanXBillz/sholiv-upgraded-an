import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Metrix} from '../Config';

const ScreenTopImage = ({
  image,
  size = 200,
  style = {},
  resizeMode = 'cover',
  rounded = true,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: Metrix.HorizontalSize(size),
          height: Metrix.HorizontalSize(size),
        },
        !rounded && styles.noRadius,
        style,
      ]}>
      <Image
        source={typeof image === 'string' ? {uri: image} : image}
        style={[styles.image, !rounded && styles.noRadius]}
        resizeMode={resizeMode}
      />
    </View>
  );
};

export default ScreenTopImage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noRadius: {
    borderRadius: 0,
  },
});
