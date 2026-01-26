import moment from 'moment';
import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images, Metrix} from '../Config';
import {capitalize, fonts} from '../Config/Helper';

const ArtistCard = ({item, width = 100, height = 130, onPress = () => {}}) => {
  // State to track if the image is loading
  const [loading, setLoading] = useState(true);

  // Function to handle when the image has loaded
  const handleImageLoad = () => {
    setLoading(false); // Stop loading when the image is successfully loaded
  };

  // Function to handle image load error
  const handleImageError = () => {
    setLoading(false); // Stop loading even if the image fails to load
  };

  const isBoosted = moment().isBefore(item?.artist_expiry);

  return (
    <TouchableOpacity style={styles.artistContainer} onPress={onPress}>
      <View style={styles.imageWrapper}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        <Image
          source={{uri: item?.profile_pic_URL}}
          style={[
            styles.artistImage,
            // isBoosted && styles.boostedPhoto,
            {
              width: Metrix.HorizontalSize(width),
              height: Metrix.VerticalSize(height),
            },
          ]}
          onLoad={handleImageLoad}
          onError={handleImageError}
          resizeMode="cover"
        />

        {isBoosted && (
          <Image
            source={Images.varificationBadge}
            style={styles.floatVerification}
          />
        )}
      </View>
      {/* <Text allowFontScaling={false} numberOfLinres={1} style={styles.artistName}>
        {item?.username && capitalize(item?.username)}
      </Text> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Metrix.VerticalSize(10),
        }}>
        <Text allowFontScaling={false} style={styles.artistName}>
          {capitalize(item?.name ?? item?.username)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ArtistCard);

const styles = StyleSheet.create({
  artistContainer: {
    // marginRight: Metrix.HorizontalSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: Metrix.VerticalSize(16),
    width: Metrix.HorizontalSize(80),
  },
  imageWrapper: {
    position: 'relative', // To position the loader on top of the image
  },
  artistImage: {
    borderWidth: 1,
    borderRadius: 14,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -12}, {translateY: -12}], // Center the loader
  },
  artistName: {
    color: Colors.white,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(12),
    // marginTop: Metrix.VerticalSize(10),
    width: Metrix.HorizontalSize(80),
    textAlign: 'center',
    overflow: 'hidden',
  },
  boostedPhoto: {
    borderWidth: 2,
    borderRadius: Metrix.Radius,
    borderColor: Colors.blue,
  },
  floatVerification: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: 20,
    width: 20,
  },
});
