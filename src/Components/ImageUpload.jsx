import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Colors, Metrix} from '../Config';
import {fonts} from '../Config/Helper';

const ImageUpload = ({file, setFile}) => {
  const handleImageUpload = async () => {
    try {
      const fileResponse = await ImageCropPicker.openPicker({
        compressImageQuality: Platform.select({ios: 0.6, android: 0.5}),
        forceJpg: true,
      });
      setFile(fileResponse);
      if (fileResponse?.path) {
        await ImageCropPicker.clean();
      }
    } catch (error) {
      console.log('===error===>', error);
    }
  };

  const clearImage = () => setFile(null);

  return (
    <TouchableOpacity style={styles.container} onPress={handleImageUpload}>
      {file ? (
        <Image
          source={{
            uri: `${Platform.OS === 'android' ? file?.path : file.sourceURL}`,
          }}
          style={styles.image}
        />
      ) : (
        <View style={styles.icon}>
          <Icon type="octions" name="upload" color={Colors.white} size={40} />
          <Text allowFontScaling={false} style={styles.uploadText}>Upload Image/Video</Text>
        </View>
      )}
      {file && (
        <View style={styles.crossIcon}>
          <Icon
            type="materialicons"
            name="cancel"
            color={'red'}
            size={30}
            onPress={clearImage}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    // padding: 10,
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  icon: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  crossIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 100,
  },
  uploadText: {
    color: Colors.white,
    fontFamily: fonts.LatoRegular,
    fontSize: Metrix.FontMedium,
  },
});
