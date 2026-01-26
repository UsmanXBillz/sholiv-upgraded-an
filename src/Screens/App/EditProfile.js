import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Header, ScreenTopImage, TextField} from '../../Components';
import {AppData, Colors, Icons, Metrix, NavigationService} from '../../Config';
import {
  ToastError,
  emailValidityCheck,
  fonts,
  pickImage,
  textCharacterLimit,
} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import UploadImageModal from '../../Components/UploadProfileModal';

const {maxSizeMB, profilePicType, uploadType} = AppData;

const EditProfile = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [bio, setBio] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [textCount, setTextCount] = useState('');
  const [locationTextCount, setLocationTextCount] = useState('');
  const [followee, setFollowee] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [artistExpiry, setArtistExpiry] = useState(null);
  const [isPlanFound, setIsPlanFound] = useState('');

  const [imageModal, setImageModal] = useState(false);
  const closeImageModal = () => setImageModal(false);

  const onAlbum = async () => {
    pickImage('gallery', setImage, maxSizeMB, false, closeImageModal);
  };
  const onCamera = async () => {
    pickImage('camera', setImage, maxSizeMB, false, closeImageModal);
  };

  const userId = useSelector(state => state?.AuthReducer?.user?.id);

  useEffect(() => {
    getUserprofile();
    getActivePlan();
  }, []);

  const cb = res => {
    setProfileData(res);
    setEmail(res?.email_address);
    setName(res?.name);
    setLocation(res?.location);
    setBio(res?.bio);
    setProfilePicUrl(res?.profile_pic_URL);
    setFollowee(res?.followee);
    setArtistExpiry(res?.artist_expiry);
  };

  const getActivePlan = () => {
    const cb = data => {
      if (data != 'not found') {
        setIsPlanFound(data?.length);
      }
    };
    dispatch(ArtistMiddleware.GetActivePlan({cb, id: userId}));
  };

  const getUserprofile = () => {
    dispatch(AuthMiddleware.GetUserProfile({cb}));
  };

  const updateProfile = () => {
    const isEmailValid = emailValidityCheck(email);
    const isFieldEmpty = field =>
      field === null || field === undefined || field.trim() === '';

    if (
      isFieldEmpty(email) ||
      isFieldEmpty(name) ||
      isFieldEmpty(bio) ||
      isFieldEmpty(location)
    ) {
      return Toast.show(ToastError('All Fields are required'));
    }

    if (!isEmailValid) {
      return Toast.show(ToastError('Please enter the correct email address'));
    }

    const profileData = {
      email_address: email,
      name,
      location,
      bio,
    };

    // console.log("===image===>", JSON.stringify(image, null, 1));

    if (image) {
      const profileImage = {
        name: 'image.jpg',
        uri:
          Platform.OS === 'ios' ? image?.sourceURL ?? image?.path : image?.path,
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('images', profileImage);

      const onImageUploadSuccess = imageres => {
        let image = imageres[0]?.Location;
        const updatedData = {...profileData, profile_pic_URL: image};
        dispatch(
          AuthMiddleware.UpdateProfile({
            payload: updatedData,
            callback: getUserprofile,
            t,
          }),
        );
      };

      dispatch(
        AuthMiddleware.UploadImage({
          payload: formData,
          type: profilePicType,
          uploadType,
          cb: onImageUploadSuccess,
        }),
      );
    } else {
      dispatch(
        AuthMiddleware.UpdateProfile({
          payload: profileData,
          callback: getUserprofile,
          t,
        }),
      );
    }
  };

  const onFolloweePress = () => {
    NavigationService.navigate('ArtistStats', {
      name: profileData?.name ?? profileData?.username,
      id: profileData?.id,
      selectedTab: 1,
      isEditProfile: true,
    });
  };

  console.log("===profilePicUrl===>", JSON.stringify(profilePicUrl, null, 1));

  return (
    <View style={gstyles.container}>
      <Header
        back={true}
        title={t('PROFILE')}
        iconPress={() => NavigationService.navigate('Notifications')}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={gstyles.marginTop50}>
          <View style={[gstyles.justifyAlignCenter, styles.imageContainer]}>
            <View style={styles.circle}></View>
            <ScreenTopImage
              image={image ? image?.path : profilePicUrl}
              size={150}
              resizeMode="cover"
              style={{position: 'absolute'}}
            />
          </View>
          <TouchableOpacity
            style={styles.imagePickerIconContainer}
            onPress={() => setImageModal(true)}>
            <Icons.FontAwesome
              name={'pencil-square-o'}
              color={Colors.white}
              size={Metrix.customFontSize(22)}
              style={styles.imagePickerIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onFolloweePress} style={gstyles.marginTop30}>
          {/* <Text allowFontScaling={false} style={gstyles.artistName}>{followee ?? '0'}</Text> */}
          {/* <Text allowFontScaling={false} style={gstyles.artistDescription}>{t('FOLLOWERS')}</Text> */}

          <View style={[gstyles.centeredAlignedRow, gstyles.marginTop20]}>
            <Text allowFontScaling={false} style={gstyles.artistName}>{followee ?? '0'}</Text>
            <Text allowFontScaling={false} style={[gstyles.artistDescription, gstyles.marginLeft10]}>
              {t('FOLLOWING')}
            </Text>
            {
              isPlanFound || moment().isBefore(artistExpiry) ? (
                <MaterialCommunityIcons
                  name="lightning-bolt-outline"
                  color="yellow"
                  size={30}
                />
              ) : null
              // <Icons.MaterialIcons name={'verified'} color={Colors.blue} size={Metrix.customFontSize(26)} style={gstyles.marginLeft10} />
            }
          </View>
        </TouchableOpacity>

        <View style={gstyles.marginVertical20}>
          <TextField
            value={name}
            placeholder="Chaz MD"
            label={t('NAME')}
            onChangeText={text => setName(text)}
            icon={
              <Icons.FontAwesome
                name={'user-o'}
                color={Colors.blue}
                size={Metrix.customFontSize(20)}
              />
            }
          />
        </View>

        <View style={gstyles.marginVertical20}>
          <TextField
            value={email}
            placeholder="Info@gmail.com"
            label={t('EMAIL_ADDRESS')}
            disable={false}
            onChangeText={text => setEmail(text)}
            icon={
              <Icons.FontAwesome
                name={'envelope-o'}
                color={Colors.blue}
                size={Metrix.customFontSize(20)}
              />
            }
          />
        </View>

        <View style={gstyles.marginVertical20}>
          <View style={styles.formItemContainer}>
            <Text allowFontScaling={false} style={gstyles.labelStyle}>{t('Bio')} </Text>
            <View style={styles.descContianer}>
              <Icons.Feather
                name={'info'}
                color={Colors.blue}
                size={Metrix.customFontSize(20)}
              />
              <TextInput
                style={[styles.textInput, styles.descInput]}
                multiline
                key={'scroll-1'}
                placeholder={t('BIO')}
                placeholderTextColor={Colors.lightGray}
                value={bio}
                onChangeText={text => {
                  setTextCount(text?.length);
                  setBio(textCharacterLimit(250, text));
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: Metrix.VerticalSize(5),
              alignItems: 'flex-end',
              marginRight: Metrix.HorizontalSize(6),
            }}>
            <Text allowFontScaling={false} style={gstyles.textLimitStyle}>
              {bio?.length > 250 ? 250 : bio?.length || 0}/250{' '}
              {t('CHARACTERS_LEFT')}
            </Text>
          </View>
        </View>

        <View style={styles.formItemContainer}>
          <Text allowFontScaling={false} style={gstyles.labelStyle}>{t('LOCATION')} </Text>
          <View style={styles.descContianer}>
            <Icons.Entypo
              name={'location'}
              color={Colors.blue}
              size={Metrix.customFontSize(20)}
            />
            <TextInput
              style={[styles.textInput, styles.descInput]}
              multiline
              key={'scroll-1'}
              placeholder={t('LOCATION')}
              placeholderTextColor={Colors.lightGray}
              value={location}
              onChangeText={text => {
                setLocation(textCharacterLimit(250, text));
                setLocationTextCount(text?.length);
              }}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: Metrix.VerticalSize(5),
            alignItems: 'flex-end',
            marginRight: Metrix.HorizontalSize(6),
          }}>
          <Text allowFontScaling={false} style={gstyles.textLimitStyle}>
            {location?.length > 250 ? 250 : location?.length || 0}/250{' '}
            {t('CHARACTERS_LEFT')}
          </Text>
        </View>

        <View
          style={[
            gstyles.marginTop40,
            {marginBottom: Metrix.VerticalSize(120)},
          ]}>
          <Button buttonText={t('UPDATE')} onPress={updateProfile} />
        </View>
      </ScrollView>

      <UploadImageModal
        visible={imageModal}
        onClose={closeImageModal}
        onCamera={onCamera}
        onAlbum={onAlbum}
      />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  imagePickerIcon: {
    marginTop: Metrix.VerticalSize(4),
    marginLeft: Metrix.HorizontalSize(4),
  },
  imagePickerIconContainer: {
    position: 'absolute',
    right: '30%',
    bottom: 8,
    backgroundColor: Colors.blue,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: Metrix.HorizontalSize(162),
    height: Metrix.HorizontalSize(162),
    borderRadius: Metrix.HorizontalSize(100),
    backgroundColor: Colors.blue,
  },
  formItemContainer: {
    gap: 5,
  },
  descInput: {minHeight: 120, textAlignVertical: 'top'},
  descContianer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
  },
  textInput: {
    color: 'white',
    fontSize: Metrix.customFontSize(12),
    minHeight: Metrix.VerticalSize(30),
    paddingHorizontal: 10,
    flex: 1,
  },

  label: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(14),
    color: 'white',
  },
});
