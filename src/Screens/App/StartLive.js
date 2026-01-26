import {useZoom} from '@zoom/react-native-videosdk';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import {useDispatch} from 'react-redux';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import {
  AttachmentContainer,
  Button,
  CustomModal,
  LiveHeader,
  MultiLineTextField,
} from '../../Components';
import {
  ToastError,
  checkVideoDuration,
  fonts,
  formatZoomPassword,
  handleSelectMedia,
  pickImage,
  textCharacterLimit,
} from '../../Config/Helper';
import {
  AppData,
  Colors,
  Images,
  Metrix,
  NavigationService,
} from '../../Config/index';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';

const {maxSizeMB, maxVideoSizeMB, uploadType, introVideoType, imageVideoType} =
  AppData;

const options = [
  {id: 0, value: 'START_LIVE'},
  {id: 1, value: 'POST_VIDEOS'},
  {id: 3, value: 'TEN_SEC_TRIAL'},
];

const RenderItem = ({item, width}) => {
  if (item?.mime?.startsWith('image/')) {
    return (
      <Image
        source={{uri: item?.path}}
        style={{width, height: 300}}
        resizeMode="contain"
      />
    );
  } else if (item?.mime?.startsWith('video/')) {
    return (
      <Video
        source={{uri: item?.path}}
        style={{width: '100%', height: '100%'}}
        controls={true}
        resizeMode="contain"
      />
    );
  }
  return null;
};

const StartLive = ({route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const selectedType = route?.params?.type ?? options[0];
  const width = Dimensions.get('window').width;

  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');
  const [textCount, setTextCount] = useState(0);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(selectedType);
  const [multipleImages, setMultipleImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionAllowed, setPermissionAllowed] = useState(true);

  const checkPermissions = async () => {
    const permissions =
      Platform.OS === 'android'
        ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]
        : [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    try {
      const permissionStatus = await checkMultiple(permissions);
      const isRequest = Object.values(permissionStatus).includes('denied');
      if (isRequest) {
        setPermissionAllowed(false);
        const permission = await requestMultiple(permissions);
        const isPermissionAllowed =
          Object.values(permission).filter(i => i === 'granted').length ===
          permissions.length;
        if (isPermissionAllowed) {
          setPermissionAllowed(true);
        }
      }
    } catch (error) {
      console.log('ERROR CHECKING PERMISSIONS===', error);
    }
  };

  useEffect(() => {
    checkPermissions();
    return checkPermissions;
  }, []);

  //zoom
  const zoom = useZoom();

  useEffect(() => {
    setType(selectedType);
  }, [selectedType]);

  const handleOptionsToggle = () => setIsVisible(!isVisible);

  const selectPostType = item => {
    handleOptionsToggle();
    setType(item);
  };

  const handleImageSelection = res => {
    if (res) {
      setVideo(null);
      setImage(null);
      setMultipleImages(res);
    }
  };

  const selectImages = async () => {
    if (type?.id === 0) {
      // handleSelectMedia('gallery', handleImageSelection, multipleImages);
      handleSelectMedia(
        'gallery',
        handleImageSelection,
        multipleImages,
        'photo',
        true,
      );
    }
    if (type?.id === 1) {
      handleSelectMedia('gallery', handleImageSelection, multipleImages);
      return;
    }
    if (type?.id === 3) {
      const handleVideoSelection = res => {
        if (res) {
          setVideo(res);
          setImage(null);
          setMultipleImages([]);
        }
      };
      pickImage('video', handleVideoSelection, maxVideoSizeMB);
      return;
    }
  };
  const openVideoCam = async () => {
    const handleSetVideo = res => {
      if (res) {
        setVideo(res);
        setImage(null);
        setMultipleImages([]);
      }
    };
    pickImage('videocam', handleSetVideo, maxVideoSizeMB);
  };

  const openCamera = async () => {
    if (type?.id === 1 || type?.id === 0) {
      const setCamImage = res => {
        if (res) {
          setMultipleImages([res]);
          setVideo(null);
        }
      };
      pickImage('camera', setCamImage, maxSizeMB, false);
    } else if (type?.id === 2 || type?.id === 3) {
      const handleSetVideo = res => {
        if (res) {
          setVideo(res);
          setImage(null);
          setMultipleImages([]);
        }
      };
      pickImage('video', handleSetVideo, maxVideoSizeMB);
    }
  };

  const dispatchCall = formData => {
    const onImageUploadSuccess = response => {
      let imagesArray = response?.map(i => i?.Location);
      const data = {title: text, text, url: imagesArray};
      dispatch(ArtistMiddleware.UploadPostArtist({payload: data, t}));
    };

    const onIntroUploadSuccess = response => {
      const data = {intro_video: response[0]?.Location, intro_title: text};
      dispatch(ArtistMiddleware.UpdateIntroVideo({payload: data, t}));
    };

    dispatch(
      AuthMiddleware.UploadImage({
        payload: formData,
        type: type?.id === 1 ? imageVideoType : introVideoType,
        uploadType,
        cb: type?.id === 1 ? onImageUploadSuccess : onIntroUploadSuccess,
      }),
    );
  };

  const uploadTrial = () => {
    if (!video) {
      return Toast.show(ToastError(t('VIDEO_IS_REQUIRED')));
    }
    if (video && !checkVideoDuration(video.duration, 'trial')) {
      return Toast.show(ToastError(t('VIDEO_DURATION_MUST_BE_10_SEC')));
    }
    if (!text) {
      return Toast.show(ToastError(t('TEXT_IS_REQUIRED')));
    }
    dismissKeyBoard();
    const formData = new FormData();
    let formattedVideo = {
      name: 'video.mp4',
      uri:
        Platform.OS === 'ios' ? video?.sourceURL ?? video?.path : video?.path,
      type: 'video/mp4',
    };
    formData.append('images', formattedVideo);
    dispatchCall(formData);
  };

  const dismissKeyBoard = () => {
    Keyboard.dismiss();
  };

  const startLive = () => {
    if (!permissionAllowed) {
      Alert.alert(
        'Allow Permissions',
        'Live feature requires Camera & Microphone Acccess, Please enable them to continue.',
        [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Settings', onPress: () => Linking.openSettings()},
        ],
      );
      return;
    }
    const formData = new FormData();
    multipleImages?.forEach(item => {
      let formattedItem;
      if (item?.mime.startsWith('image/')) {
        formattedItem = {
          name: 'image.jpg',
          uri:
            Platform.OS === 'ios' ? item.sourceURL ?? item?.path : item?.path,
          type: item?.mime,
        };
      }
      if (formattedItem) {
        formData.append('images', formattedItem);
      }
    });

    dispatch(
      AuthMiddleware.UploadImage({
        payload: formData,
        type: imageVideoType,
        uploadType,
        cb: async response => {
          setModalOpen(false);
          let imageArray = response?.map(i => i?.Location);
          const isPrevSession = await zoom.isInSession();
          if (isPrevSession) {
            zoom.leaveSession();
          }
          const liveData = {
            url: imageArray,
            text: text.trim(),
            password: formatZoomPassword(text),
          };
          console.log('===liveData===>', JSON.stringify(liveData, null, 1));
          NavigationService.navigate('Live', liveData);
        },
      }),
    );
  };

  const uploadPostVideo = () => {
    if (multipleImages?.length === 0 && !image && !video) {
      return Toast.show(ToastError(t('PLEASE_SELECT_ATTACHMENT')));
    }
    if (!text) {
      return Toast.show(ToastError(t('TEXT_IS_REQUIRED')));
    }
    dismissKeyBoard();
    const formData = new FormData();
    if (video) {
      formattedItem = {
        name: 'video.mp4',
        uri:
          Platform.OS === 'ios' ? video?.sourceURL ?? video?.path : video?.path,
        type: video?.mime,
      };
      formData.append('images', formattedItem);
      return dispatchCall(formData);
    }
    multipleImages.forEach(item => {
      let formattedItem;
      if (item.mime.startsWith('video/')) {
        formattedItem = {
          name: 'video.mp4',
          uri:
            Platform.OS === 'ios' ? item?.sourceURL ?? item?.path : item?.path,
          type: item?.mime,
        };
      } else if (item?.mime.startsWith('image/')) {
        formattedItem = {
          name: 'image.jpg',
          uri:
            Platform.OS === 'ios' ? item?.sourceURL ?? item?.path : item?.path,
          type: item?.mime,
        };
      }
      if (formattedItem) {
        formData.append('images', formattedItem);
      }
    });
    dispatchCall(formData);
  };

  const disclaimer = () => {
    dismissKeyBoard();
    if (multipleImages?.length === 0 && !image) {
      return Toast.show(ToastError('Image is required'));
    }
    if (!text) {
      return Toast.show(ToastError('Text is required'));
    }
    setModalOpen(true);
  };

  const onPressListing = {
    0: disclaimer,
    1: uploadPostVideo,
    3: uploadTrial,
  };

  const RenderDisclaimerBody = () => {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false} style={styles.modalMessage}>{t('INSTRUCTIONS')}</Text>
          <Text allowFontScaling={false} style={styles.winnerText}>{t('LIVE_INSTRUCTIONS')}</Text>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: Metrix.VerticalSize(20),
              justifyContent: 'space-around',
            }}>
            <View style={{width: '48%'}}>
              <Button
                buttonText={t('CLOSE')}
                onPress={() => {
                  setModalOpen(false);
                }}
              />
            </View>
            <View style={{width: '48%'}}>
              <Button buttonText={t('JOIN')} onPress={startLive} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const scrollViewRef = useRef(null);

  const scrollToInput = reactNode => {
    scrollViewRef.current?.scrollTo({
      y: reactNode,
      animated: true,
    });
  };

  return (
    // isInSession ? (
    //     <View style={styles.zoomContainer}>
    //         {users?.map((user) => (
    //             <View style={styles.zoomContainer} key={user.userId}>
    //                 <ZoomView
    //                     style={styles.zoomContainer}
    //                     userId={user.userId}
    //                     fullScreen
    //                     videoAspect={VideoAspect.PanAndScan}
    //                 />
    //             </View>
    //         ))}
    //         <MuteButtons isAudioMuted={isAudioMuted} isVideoMuted={isVideoMuted} />
    //         <Button title={t('LEAVE_SESSION')} color={"#f01040"} onPress={leaveSession} />
    //     </View>
    // ) : (

    <View style={gstyles.container}>
      <LiveHeader
        back={true}
        title={type?.value}
        handleOptionsToggle={handleOptionsToggle}
        isVisible={isVisible}
        uploadPost={onPressListing[type?.id]}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        {!image && multipleImages?.length === 0 && !video && (
          <View style={styles.imageContainer}>
            <Image
              source={Images.liveimage}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        {multipleImages?.length > 1 && (
          <View style={gstyles.marginVertical15}>
            <Carousel
              width={width}
              height={300}
              data={multipleImages}
              scrollAnimationDuration={1000}
              renderItem={({item}) => <RenderItem item={item} width={width} />}
            />
          </View>
        )}
        {multipleImages?.length === 1 && (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: multipleImages[0]?.path}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: image?.path}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        {video && (
          <View style={styles.videoWrapper}>
            <Video
              source={{uri: video?.path}}
              style={{width: '100%', height: 300}}
              controls={true}
              resizeMode="contain"
            />
          </View>
        )}
        <View style={gstyles.marginVertical10}>
          <Text allowFontScaling={false} style={[styles.captionText, {color: Colors.blue}]}>
            {' '}
            Caption
          </Text>
        </View>
        <View>
          <MultiLineTextField
            text={text}
            setText={setText}
            style={{height: Metrix.VerticalSize(148)}}
            placeholder={t('WRITE_ANYTHING')}
            placeholderColor={Colors.placeholderLight}
            onChangeText={text => {
              setTextCount(text?.length > 50 ? 50 : text?.length);
              setText(textCharacterLimit(50, text));
            }}
            onFocus={event => {
              scrollToInput(event.nativeEvent.target);
            }}
          />
          <View style={styles.textCountContainer}>
            <Text allowFontScaling={false} style={styles.textCount}>{textCount}/50</Text>
          </View>
        </View>
        <AttachmentContainer
          selectImages={selectImages}
          openCamera={openCamera}
          openVideoCam={openVideoCam}
          type={type?.id}
        />
        <CustomModal show={modalOpen} children={<RenderDisclaimerBody />} />
      </ScrollView>
      {isVisible && (
        <View style={styles.optionsContainer}>
          {options
            ?.filter(item => item.id !== type.id)
            ?.map(item => (
              <TouchableOpacity
                key={item.id}
                style={gstyles.marginVertical5}
                onPress={() => selectPostType(item)}>
                <Text allowFontScaling={false} style={styles.optionsBoxText}>{t(item?.value)}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
  // );
};

export default StartLive;

const styles = StyleSheet.create({
  optionsBoxText: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    marginLeft: 10,
  },
  optionsContainer: {
    marginTop: Metrix.VerticalSize(10),
    backgroundColor: Colors.optionsBox,
    borderColor: Colors.optionsBox,
    borderWidth: 1,
    paddingVertical: Metrix.VerticalSize(8),
    paddingHorizontal: Metrix.HorizontalSize(14),
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 186 : 156),
    position: 'absolute',
    left: Platform.OS === 'ios' ? 60 : 58,
    top: Platform.OS === 'ios' ? 60 : 50,
    zIndex: 1000,
  },
  imageContainer: {
    marginVertical: Metrix.VerticalSize(20),
  },
  image: {
    height: 300,
    width: '100%',
    borderRadius: 6,
  },
  captionText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(20),
    marginBottom: Metrix.VerticalSize(10),
  },
  selectText: {
    fontFamily: fonts.MontserratMedium,
    fontSize: Metrix.customFontSize(16),
    color: Colors.black,
  },
  selectTextContainer: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    paddingHorizontal: Metrix.HorizontalSize(12),
    paddingVertical: Metrix.VerticalSize(4),
    marginRight: Metrix.HorizontalSize(10),
  },
  cameraIconContainer: {
    backgroundColor: Colors.blue,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIconContainer: {
    backgroundColor: Colors.blue,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Metrix.HorizontalSize(10),
  },
  textCount: {
    textAlign: 'right',
    color: Colors.placeholder,
  },
  textCountContainer: {
    marginTop: Metrix.VerticalSize(5),
    marginRight: Metrix.HorizontalSize(5),
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  videoWrapper: {
    width: '100%',
    height: 300,
  },
  zoomContainer: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
  },
  attachmentContainer: {
    ...gstyles.marginVertical30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attachmentOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalWrapper: {
    backgroundColor: 'transparent',
  },
  modalContentContainer: {
    backgroundColor: Colors.black,
    borderWidth: 0.6,
    borderColor: Colors.backgroundGrayDark,
    opacity: 0.8,
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(20),
    borderRadius: 40,
  },
  winnerText: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.RobotoLight,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(10),
    marginBottom: Metrix.VerticalSize(20),
  },
});
