import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Icons, Images, Metrix, NavigationService} from '../Config';
import {capitalize, fonts} from '../Config/Helper';
import gstyles from '../styles';
import VideoContainer from './VideoContainer';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PostCard = ({item, user, screen}) => {
  // const isMultiple = item?.url?.length > 1 ? true : false;
  const isVideo = item?.url ? item?.url[0].includes('.mp4') : item?.intro_video;

  const isBoosted = moment().isBefore(item?.artist_expiry);

  const onPress = () => {
    NavigationService.navigate('PostsListing', {item, user, screen});
  };

  return (
    <View style={styles.cardContainer}>
      {screen === 'explore' ? (
        <View style={[styles.imageContainer]}>
          {item?.intro_video ? (
            <TouchableOpacity onPress={onPress} style={{overflow: 'hidden'}}>
              <VideoContainer
                video={item?.intro_video}
                style={styles.video}
                showControls={false}
                item={item}
                allowsFullscreenVideo
                autoPlay={false}
                initialMuted={true}
              />
              <View style={styles.multiImageContainer}>
                <Icons.FontAwesome5
                  name={'video'}
                  size={18}
                  color={Colors.black}
                />
              </View>
              <View style={gstyles.exploreDetailContainer}>
                <Text
                  allowFontScaling={false}
                  style={gstyles.exploreDetailContainerText}
                  onPress={() =>
                    NavigationService.navigate('ArtistProfile', {
                      isPaid: false,
                      id: item?.id,
                    })
                  }>
                  {capitalize(item.name ?? item.username)}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() =>
                NavigationService.navigate('ArtistProfile', {
                  isPaid: false,
                  id: item?.id,
                })
              }>
              <Image
                source={{uri: item?.profile_pic_URL}}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() =>
                  NavigationService.navigate('ArtistProfile', {
                    isPaid: false,
                    id: item?.id,
                  })
                }
                style={gstyles.exploreDetailContainer}>
                <Text
                  allowFontScaling={false}
                  style={gstyles.exploreDetailContainerText}>
                  {item?.user
                    ? item.user.name ?? item.user.username
                    : item.name ?? item.username}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}

          {isBoosted && (
            <View style={styles.floatVerification}>
              <Image
                source={Images.varificationBadge}
                style={styles.floatVerification}
              />
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
          {isVideo ? (
            <View style={{width: '100%', height: '100%', overflow: 'hidden'}}>
              <VideoContainer
                video={item?.url[0]}
                style={styles.video}
                showControls={false}
                item={item}
                allowsFullscreenVideo
                autoPlay={false}
                initialMuted={true}
              />
              <View style={styles.multiImageContainer}>
                <Icons.FontAwesome5
                  name={'video'}
                  size={18}
                  color={Colors.black}
                />
              </View>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <Image
                source={{uri: item?.url[0]}}
                style={styles.image}
                resizeMode="cover"
              />
              {item?.url?.length > 1 && (
                <View style={styles.multiImageContainer}>
                  <Icons.FontAwesome5
                    name={'images'}
                    size={18}
                    color={Colors.black}
                  />
                </View>
              )}
            </View>
          )}
          {isBoosted && (
            <Image
              source={Images.varificationBadge}
              style={styles.floatVerification}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
  imageContainer: {
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 160 : 162),
    height: Metrix.VerticalSize(Platform.OS === 'ios' ? 256 : 320),
    // width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 140 : 100),
    // height: Metrix.VerticalSize(Platform.OS === 'ios' ? 236 : 200),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  boostedContaier: {
    borderColor: Colors.blue,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  multiImageContainer: {
    borderRadius: 10,
    position: 'absolute',
    top: 14,
    right: 10,
  },
  cardContainer: {
    // margin: Metrix.VerticalSize(10),
    overflow: 'hidden',
  },
  video: {
    height: Metrix.VerticalSize(300),
    width: Metrix.HorizontalSize(200),
    left: -20,
    bottom: 20,
    borderRadius: 8,
  },
  detailCaontainer: {
    backgroundColor: Colors.liveColorCode,
    padding: Metrix.VerticalSize(6),
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 6,
    left: 2,
    justifyContent: 'center',
  },
  detailCaontainerText: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(12),
    // backgroundColor: Colors.liveColorCode,
    paddingHorizontal: Metrix.HorizontalSize(6),
    paddingVertical: Metrix.VerticalSize(4),
    borderRadius: 4,
  },
  floatVerification: {
    position: 'absolute',
    bottom: 3,
    right: 2,
    height: 32,
    width: 32,
  },
});
