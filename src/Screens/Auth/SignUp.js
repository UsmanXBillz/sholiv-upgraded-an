import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import gstyles from '../../styles';
import {Button, TextField, AuthHeader, ScreenTopImage} from '../../Components';
import {Icons, Metrix, NavigationService, Colors, AppData} from '../../Config';
import {
  ToastError,
  emailValidityCheck,
  fonts,
  passwordValidityCheck,
  pickImage,
} from '../../Config/Helper';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {AuthAction} from '../../Redux/Actions';
import {useTranslation} from 'react-i18next';
import UploadImageModal from '../../Components/UploadProfileModal';

const toastConfig = {
  tomatoToast: ({props}) => (
    <View style={styles.customPasswordToast}>
      <Text allowFontScaling={false} style={[styles.toastText, {fontWeight: 'bold'}]}>
        {props.text1}
      </Text>
      <Text allowFontScaling={false} style={styles.toastText}>{props.text2}</Text>
    </View>
  ),
};

const {maxSizeMB, profilePicType, uploadType} = AppData;

const SignUp = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('username');
  const [selectedFilter, setSelectedFilter] = useState('Artist');

  const [imageModal, setImageModal] = useState(false);
  const closeImageModal = () => setImageModal(false);

  const onAlbum = async () => {
    pickImage('gallery', setImage, maxSizeMB, false, closeImageModal);
  };
  const onCamera = async () => {
    pickImage('camera', setImage, maxSizeMB, false, closeImageModal);
  };

  const handleFilterSelect = filter => setSelectedFilter(filter);

  const next = () => {
    if (!email || !password || !confirmPassword || !username || !image) {
      return Toast.show(ToastError(t('ALL_FIELDS_REQUIRED')));
    }
    if (!emailValidityCheck(email)) {
      return Toast.show(ToastError(t('PLEASE_ENTER_CORRECT_EMAIL')));
    }
    if (!passwordValidityCheck(password)) {
      return Toast.show({
        type: 'tomatoToast',
        props: {
          text1: 'Error',
          text2: t('PASSWORD_REQUIREMENTS'),
        },
      });
    }
    if (password !== confirmPassword) {
      return Toast.show(ToastError(t('PASSWORDS_MUST_BE_SAME')));
    }
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
      const data = {
        email_address: email,
        password: password,
        name: username,
        username: username,
        user_role: selectedFilter === 'Fan' ? 2 : 1,
        profile_pic_URL: image,
      };

      if (selectedFilter === 'Fan') {
        dispatch(AuthMiddleware.Signup(data, t));
      } else {
        delete data?.artist_id;
        delete data?.band_id;
        dispatch(AuthAction.UpdateTempUser({artist: data}));
        NavigationService.navigate('SelectCategoryFan');
      }
    };

    dispatch(
      AuthMiddleware.UploadImageSignUp({
        payload: formData,
        type: profilePicType,
        uploadType,
        cb: onImageUploadSuccess,
      }),
    );
  };

  const handleFocus = field => {
    setFocusedField(field);
  };

  return (
    <View style={gstyles.container}>
      <View style={{zIndex: 10000}}>
        {!passwordValidityCheck(password) && <Toast config={toastConfig} />}
      </View>
      <AuthHeader
        onPress={() => NavigationService.goBack()}
        greeting={t('CREATE_ACCOUNT')}
        title={t('UNLOCK_ENDLESS_ENTERTAINMENT')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={gstyles.marginVertical50}>
          <View style={gstyles.centeredAlignedRow}>
            <View style={styles.filterContainer}>
              {[t('ARTIST'), t('FAN')].map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.selectedFilter,
                  ]}
                  onPress={() => handleFilterSelect(filter)}>
                  <Text allowFontScaling={false}
                    style={[
                      styles.filterLabel,
                      selectedFilter === filter && styles.selectedFilterText,
                    ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={gstyles.marginTop50}>
            <View style={[gstyles.justifyAlignCenter, styles.imageContainer]}>
              <View style={styles.circle}></View>
              <ScreenTopImage
                image={image ? image?.path : null}
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

          <View style={gstyles.marginVertical15}>
            <TextField
              value={username}
              focused={focusedField === 'username'}
              onFocus={() => handleFocus('username')}
              placeholder="Chaz MD"
              label={t('USER_NAME')}
              onChangeText={text => setUserName(text)}
              icon={
                <Icons.MaterialCommunityIcons
                  name={'account-outline'}
                  color={Colors.blue}
                  size={Metrix.customFontSize(25)}
                />
              }
            />
          </View>
          <View style={gstyles.marginVertical15}>
            <TextField
              value={email}
              focused={focusedField === 'email'}
              onFocus={() => handleFocus('email')}
              placeholder="Info@mail.com"
              label={t('EMAIL_ADDRESS')}
              onChangeText={text => setEmail(text)}
              icon={
                <Icons.EvilIcons
                  name={'envelope'}
                  color={Colors.blue}
                  size={Metrix.customFontSize(25)}
                />
              }
            />
          </View>
          <View style={gstyles.marginVertical15}>
            <TextField
              value={password}
              focused={focusedField === 'password'}
              onFocus={() => handleFocus('password')}
              placeholder="**************"
              label={t('PASSWORD')}
              secureTextEntry={!seePassword}
              onChangeText={text => setPassword(text)}
              icon={
                <Icons.EvilIcons
                  name={'lock'}
                  color={Colors.blue}
                  size={Metrix.customFontSize(25)}
                />
              }
              postIcon={
                <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
                  <Icons.Feather
                    name={seePassword ? 'eye' : 'eye-off'}
                    color={Colors.blue}
                    size={Metrix.customFontSize(20)}
                  />
                </TouchableOpacity>
              }
            />
          </View>
          <View style={gstyles.marginVertical15}>
            <TextField
              value={confirmPassword}
              focused={focusedField === 'confirmPassword'}
              onFocus={() => handleFocus('confirmPassword')}
              placeholder="**************"
              label={t('CONFIRM_PASSWORD')}
              secureTextEntry={!seeConfirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              icon={
                <Icons.EvilIcons
                  name={'lock'}
                  color={Colors.blue}
                  size={Metrix.customFontSize(25)}
                />
              }
              postIcon={
                <TouchableOpacity
                  onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}>
                  <Icons.Feather
                    name={seeConfirmPassword ? 'eye' : 'eye-off'}
                    color={Colors.blue}
                    size={Metrix.customFontSize(20)}
                  />
                </TouchableOpacity>
              }
            />
          </View>
          <View style={[gstyles.marginTop40, gstyles.marginBottom50]}>
            <Button buttonText={t('NEXT')} onPress={next} />
            <View
              style={[gstyles.centeredAlignedRow, gstyles.marginVertical20]}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>
                {t('DONT_HAVE_AN_ACCOUNT')}
                <TouchableOpacity
                  onPress={() => NavigationService.navigate('Login')}>
                  <Text allowFontScaling={false} style={styles.forgotPassword}>{t('SIGN_IN')}</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
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

export default SignUp;

const styles = StyleSheet.create({
  customPasswordToast: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: Metrix.HorizontalSize(20),
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    borderColor: '#FE6301',
    borderLeftWidth: 5,
    zIndex: 500000,
  },
  toastText: {
    fontSize: 12,
    // fontWeight: "bold",
    marginBottom: 2,
    color: Colors.placeholder,
  },
  forgotPassword: {
    color: Colors.blue,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(15),
    marginLeft: Metrix.VerticalSize(10),
    textDecorationLine: 'underline',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    width: '58%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Metrix.VerticalSize(6),
    borderRadius: 30,
  },
  filterButton: {
    paddingVertical: Metrix.VerticalSize(6),
    paddingHorizontal: Metrix.HorizontalSize(30),
    borderRadius: 20,
  },
  filterLabel: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(14),
  },
  selectedFilter: {
    backgroundColor: Colors.white,
  },
  selectedFilterText: {
    color: Colors.black,
  },
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
});
