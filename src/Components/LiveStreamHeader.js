import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors, Icons, Images, Metrix} from '../Config';
import {capitalize, fonts} from '../Config/Helper';
import ScreenTopImage from './ScreenTopImage';

const LiveStreamHeader = ({
  name,
  status,
  count,
  likesCount,
  leaveSession,
  hostImage,
  liveStatus = 1,
}) => {
  // Create an animated value for scaling the image
  const scaleAnim = useState(new Animated.Value(1))[0];

  const user = useSelector(state => state?.AuthReducer?.user);
  const {t} = useTranslation();

  useEffect(() => {
    if (likesCount) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 3, // scale up by 20%
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1, // scale back down to original size
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [likesCount]);

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <ScreenTopImage
          image={hostImage ?? user?.profile_pic_URL}
          size={50}
          rounded={true}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text allowFontScaling={false} style={styles.artistName}>
            {capitalize(name ? name : user?.name ?? user?.username)}
          </Text>
          <Text allowFontScaling={false} style={styles.status}>{status}</Text>
        </View>
      </View>
      <View style={styles.badgeContainer}>
        <Text allowFontScaling={false} style={styles.badgeText}>
          {t(liveStatus === 1 ? 'LIVE' : 'WAS_LIVE')}
        </Text>
      </View>
      <View style={styles.liveCountSection}>
        <View style={styles.liveCountContainer}>
          <Icons.Feather
            name={'eye'}
            size={Metrix.customFontSize(22)}
            color={Colors.white}
          />
          <Text allowFontScaling={false} style={styles.liveCountText}>{count}</Text>
        </View>
        <View
          style={[
            styles.liveCountContainer,
            {marginLeft: Metrix.HorizontalSize(10)},
          ]}>
          <Animated.Image
            resizeMode="contain"
            style={{
              height: Metrix.VerticalSize(28),
              width: Metrix.VerticalSize(28),
              transform: [{scale: scaleAnim}],
            }}
            source={Images.fireball} // Your fireball image
          />
          <Text allowFontScaling={false} style={styles.liveCountText}>{likesCount}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            leaveSession();
          }}>
          <Icons.AntDesign
            name={'close'}
            size={Metrix.customFontSize(22)}
            color={Colors.white}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveStreamHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(10),
    marginTop: Metrix.VerticalSize(20),
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    borderRadius: 100,
    marginRight: Metrix.HorizontalSize(22),
  },
  userInfo: {
    marginLeft: Metrix.HorizontalSize(-10),
  },
  artistName: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  status: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.RubikRegular,
    color: Colors.status,
  },
  liveCountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveCountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.liveColorCode,
    // padding: Metrix.VerticalSize(8),
    // borderRadius:8
  },
  liveCountText: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.RubikRegular,
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(5),
  },
  closeIcon: {
    marginLeft: Metrix.HorizontalSize(30),
    // backgroundColor: Colors.liveColorCode,
    // padding: Metrix.VerticalSize(8),
    // borderRadius:8
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    left: 38,
    backgroundColor: 'red',
    paddingHorizontal: Metrix.HorizontalSize(12),
    paddingVertical: Metrix.VerticalSize(2),
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.MontserratSemiBold,
  },
});
