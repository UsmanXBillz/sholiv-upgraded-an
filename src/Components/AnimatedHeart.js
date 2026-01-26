/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Images, Metrix} from '../Config';

const window = Dimensions.get('window');

const AnimatedHeart = ({onPress, style, image}) => {
  const positionY = useSharedValue(0);
  const maxPositionY = Math.ceil(window.height / 0.5) * 0.1;

  const animate = () => {
    onPress();
    positionY.value = withTiming(0, {duration: 0}); // Reset instantly
    positionY.value = withTiming(-maxPositionY, {
      duration: 2000,
    });
    setTimeout(() => {
      positionY.value = withTiming(0, {duration: 0}); // Reset instantly
    }, 2000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const yAnimation = interpolate(
      positionY.value,
      [maxPositionY * -1, 0],
      [maxPositionY, 0],
    );

    const xAnimation = interpolate(
      yAnimation,
      [
        0,
        maxPositionY * 0.25,
        maxPositionY * 0.35,
        maxPositionY * 0.45,
        maxPositionY * 0.55,
        maxPositionY * 0.65,
      ],
      [25, -5, 15, -10, 30, 20],
    );

    const opacityAnimation = interpolate(yAnimation, [0, maxPositionY], [1, 0]);

    return {
      transform: [
        {
          translateY: positionY.value,
        },
        {
          translateX: xAnimation,
        },
      ],
      opacity: opacityAnimation,
    };
  });

  return (
    <TouchableOpacity onPress={animate} style={{style}}>
      <Image
        resizeMode={'contain'}
        style={{
          zIndex: 0,
          height: Metrix.VerticalSize(35),
          aspectRatio: 1,
          right: 0,
        }}
        source={image ?? Images.fireball}
      />
      {/* Animated Heart Icon */}
      <Animated.View style={[animatedStyle, {position: 'absolute', zIndex: 1}]}>
        <Image
          resizeMode={'contain'}
          style={{
            height: Metrix.VerticalSize(35),
            aspectRatio: 1,
            right: Metrix.HorizontalSize(20),
          }}
          source={image ?? Images.fireball}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedHeart;
