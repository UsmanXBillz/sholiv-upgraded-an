/* eslint-disable react/no-unstable-nested-components */
import React, {memo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Icons, Metrix, NavigationService} from '../Config';
import {capitalize, fonts} from '../Config/Helper';
import gstyles from './../styles';

const ArtistListingCard = ({
  data,
  selectedTab,
  isSelectionEnabled,
  isSelected,
  onSelect,
}) => {
  const [loading, setLoading] = useState(true); // State to track image loading
  const isArtist = data?.user_role === 1;

  const onPress = () => {
    if (isArtist) {
      NavigationService.navigate('ArtistProfile', {id: data?.id});
    }
  };

  //   <View style={styles.circle}></View>
  //   <View style={styles.imageContainer}>

  //   <Image
  //     source={{uri: data?.profile_pic_URL}}
  //     style={styles.image}
  //     onLoad={onImageLoad} // Set loading to false when the image is loaded
  //     onError={onImageError} // Handle error
  //   />
  //   </View>

  const RenderAvatar = () => {
    return (
      <View style={styles.circle}>
        <Image source={{uri: data?.profile_pic_URL}} style={styles.image} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        disabled={!isArtist}
        style={[styles.container, gstyles.marginVertical10]}>
        <RenderAvatar />
        <View style={styles.detailsContainer}>
          <Text allowFontScaling={false} style={styles.artistName}>
            {capitalize(data?.name ?? data?.username)}
          </Text>
          <Text allowFontScaling={false} style={[styles.artistHandle, gstyles.marginTop5]}>
            @{data?.username}
          </Text>
        </View>
      </TouchableOpacity>

      {isSelectionEnabled && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onSelect}>
            <Icons.Feather
              name={isSelected ? 'check-square' : 'square'}
              color={Colors.white}
              size={Metrix.customFontSize(22)}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(ArtistListingCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: Metrix.HorizontalSize(61),
    height: Metrix.HorizontalSize(61),
    borderRadius: Metrix.HorizontalSize(100),
    overflow: 'hidden',
    position: 'absolute',
    left: 3,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: Metrix.HorizontalSize(50),
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -12}, {translateY: -12}],
  },
  circle: {
    width: Metrix.HorizontalSize(66),
    aspectRatio: 1,
    borderRadius: Metrix.HorizontalSize(100),
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: Metrix.HorizontalSize(20),
    zIndex: 0,
  },
  artistName: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.RubikRegular,
    color: Colors.white,
  },
  artistHandle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.RubikRegular,
    color: Colors.blue,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  followButton: {
    backgroundColor: Colors.red,
    width: Metrix.HorizontalSize(90),
    paddingVertical: Metrix.VerticalSize(6),
    borderRadius: 6,
  },
  followTextStyle: {
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(14),
  },
});
