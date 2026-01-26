import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import {fonts} from '../Config/Helper';
import gstyles from '../styles';

const VideoStreamCard = ({item, onPress, isFollowed}) => {
  const Wrapper = !isFollowed ? View : TouchableOpacity;

  return (
    <Wrapper
      disabled={!isFollowed}
      onPress={onPress}
      style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item?.url?.[0]}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          ...styles.liveLabelContainer,
          backgroundColor:
            item?.status === 1 ? Colors.badgeColor : 'transparent',
        }}>
        <Text allowFontScaling={false} style={styles.livetext}>
          {item?.status === 2 ? 'Was Live' : 'Live'}
          {/* : (!isArtist && item?.user ? item.user.name ?? item.user.username : item.name ?? item.username)} */}
        </Text>
      </View>
      <TouchableOpacity style={[gstyles.exploreDetailContainer]}>
        <Text allowFontScaling={false} style={gstyles.exploreDetailContainerText}>
          {item?.user?.name ??
            item?.user?.username ??
            item?.name ??
            item?.username}
        </Text>
      </TouchableOpacity>

      {!isFollowed && (
        <View style={styles.lockIconContainer}>
          <Icons.AntDesign name="lock" size={40} color={Colors.white} />
        </View>
      )}
    </Wrapper>
  );
};

export default VideoStreamCard;

const styles = StyleSheet.create({
  imageContainer: {
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 160 : 162),
    height: Metrix.VerticalSize(Platform.OS === 'ios' ? 256 : 320),
    // width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 140 : 100),
    // height: Metrix.VerticalSize(Platform.OS === 'ios' ? 236 : 200),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 8,
  },
  liveStatsContainer: {
    backgroundColor: Colors.lightGray,
    width: Metrix.HorizontalSize(50),
    padding: Metrix.VerticalSize(4),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 14,
    left: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  liveStatstext: {
    color: Colors.white,
    fontFamily: fonts.RubikRegular,
    marginLeft: Metrix.HorizontalSize(8),
    fontSize: Metrix.customFontSize(12),
  },
  livetext: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(12),
    backgroundColor: Colors.badgeColor,
    paddingHorizontal: Metrix.HorizontalSize(6),
    paddingVertical: Metrix.VerticalSize(4),
    borderRadius: 4,
  },
  liveLabelContainer: {
    backgroundColor: Colors.badgeColor,
    // width: Metrix.HorizontalSize(60),
    padding: Metrix.VerticalSize(6),
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconContainer: {
    backgroundColor: 'rgba(245, 245, 245, 0.28)',
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 160 : 162),
    position: 'absolute',
    borderRadius: 8,
    minHeight: Metrix.VerticalSize(Platform.OS === 'ios' ? 252 : 320),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    // margin: Metrix.VerticalSize(10),
    overflow: 'hidden',
    // borderWidth: 1, borderColor: 'red' this to check why videos are limited size
  },
});
