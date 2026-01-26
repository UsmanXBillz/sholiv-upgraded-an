import React, {useEffect, useState} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Images, Metrix} from '../Config';

const window = Dimensions.get('window');

const AnimatedFireballArtist = ({trigger, image, style}) => {
  const positionY = useSharedValue(0);
  const maxPositionY = Math.ceil(window.height / 0.3) * 0.1;
  const [isHidden, setIsHidden] = useState(true);

  const animate = () => {
    positionY.value = withTiming(0, {duration: 0}); // Reset instantly
    positionY.value = withTiming(-maxPositionY, {
      duration: 4000,
    });
    setTimeout(() => {
      positionY.value = withTiming(0, {duration: 0}); // Reset instantly
      setIsHidden(true);
    }, 4200);
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
      ...style,
    };
  });

  useEffect(() => {
    if (trigger > 0) {
      setIsHidden(false);
      setTimeout(() => {
        animate();
      }, 500);
    }
  }, [trigger]);

  if (isHidden) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={animate}
      style={{alignItems: 'center', backgroundColor: 'red'}}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            zIndex: 1,
            bottom: Metrix.VerticalSize(20),
            right: Metrix.HorizontalSize(30),
          },
          style,
        ]}>
        <Image
          resizeMode={'contain'}
          style={{
            height: Metrix.VerticalSize(28),
            width: Metrix.VerticalSize(28),
          }}
          source={image ?? Images.fireball}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedFireballArtist;
