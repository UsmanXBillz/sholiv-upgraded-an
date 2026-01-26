/* eslint-disable react/no-unstable-nested-components */
import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts} from '../../Config/Helper';
import gstyles from '../../styles';

const ChatCard = ({item}) => {
  const [loading, setLoading] = useState(true); // State to track image loading
  const participant = item?.participants[0]?.user;

  const RenderAvatar = () => {
    return (
      <View style={styles.circle}>
        <Image
          source={{uri: participant?.profile_pic_URL}}
          style={styles.image}
        />
      </View>
    );
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        NavigationService.navigate('ChatDetails', {
          item,
          participantData: participant,
        })
      }>
      <RenderAvatar />
      {/* <View style={styles.imageContainer}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.white}
            style={styles.loader} // Loading spinner style
          />
        )}
        <Image
          source={{uri: participant?.profile_pic_URL}}
          style={styles.image}
          onLoad={handleImageLoad} // Set loading to false once the image is loaded
          onError={handleImageError} // Handle image load error
        />
      </View> */}
      <View style={styles.detailsContainer}>
        <Text allowFontScaling={false} style={styles.name}>
          {capitalize(participant?.name ?? participant?.username)}
        </Text>
        <Text allowFontScaling={false} numberOfLines={1} style={[styles.latestText, gstyles.marginTop5]}>
          {item?.latest_text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChatCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Metrix.VerticalSize(10),
  },
  imageContainer: {
    width: Metrix.HorizontalSize(50),
    height: Metrix.HorizontalSize(50),
    overflow: 'hidden',
    position: 'absolute',
    left: 8,
    top: 4,
    zIndex: 1,
  },
  image: {
    width: Metrix.HorizontalSize(60),
    aspectRatio: 1,
    borderRadius: Metrix.HorizontalSize(40),
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -12}, {translateY: -12}], // Center the loader
  },
  circle: {
    width: Metrix.HorizontalSize(66),
    aspectRatio: 1,
    borderRadius: Metrix.HorizontalSize(100),
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.RubikRegular,
    color: Colors.white,
  },
  latestText: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.RubikRegular,
    color: Colors.white,
    maxWidth: '90%',
    minWidth: '90%',
  },
  detailsContainer: {
    marginLeft: Metrix.HorizontalSize(20),
  },
});
