import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Header, Loader, ModalCard} from '../../Components';
import ImageUpload from '../../Components/ImageUpload';
import {AppData, Colors, Metrix} from '../../Config';
import {createImageFormData, fonts, openStripeModal} from '../../Config/Helper';
import {Store} from '../../Redux';
import {AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {GeneralAction} from '../../Redux/Actions';
import {useTranslation} from 'react-i18next';
import {useIAP} from '../../Components/Providers/IAP.Provider';

const {imageVideoType, uploadType} = AppData;

const CreateCommPost = () => {
  const {username} = Store?.getState()?.AuthReducer?.user;
  const {top} = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [text, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [postId, setPostId] = useState('');
  const [fieldError, setError] = useState({title: '', text: ''});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const iapLoader = useSelector(store => store.LoaderReducer.iapLoader);

  const {
    handlePurchase,
    plans: {boostPost},
  } = useIAP();
  const checkErrors = () => {
    let isClean = true;
    setError({title: '', text: ''});
    if (!title) {
      setError(p => ({...p, title: t('TEXT_IS_REQUIRED')}));
      isClean = false;
    }
    if (!text) {
      setError(p => ({...p, text: t('TEXT_IS_REQUIRED')}));
      isClean = false;
    }
    return isClean;
  };

  const createPost = ({body, url}) => {
    console.log('CREATING POST NOW');
    dispatch(
      AuthMiddleware.CreateCommunityPost({
        body: {...body, url},
        cb: result => {
          console.log(
            '===CREATE POST RESPONSE===>',
            JSON.stringify(result, null, 1),
          );
          setPostId(result?.communityPost?.id);
          setDescription('');
          setTitle('');
          setFile('');
          dispatch({type: 'REFETCH_COMM_POST', payload: null});
          setShowBuyModal(true);
          // navigation.goBack();
        },
      }),
    );
  };

  const closeModal = () => {
    setShowBuyModal(false);
    navigation.goBack();
  };

  const purchaseBoostPost = () => {
    dispatch(
      AuthMiddleware.PurchaseComPostBoost({
        id: postId,
        cb: result => {
          // handleStripePurchase(result);
        },
      }),
    );
  };

  const handleBoostPurchase = async data => {
    try {
      const cb = () => {
        Toast.show({
          type: 'success',
          text1: 'Payment Success',
          text2: 'Transaction is successfull',
        });
        dispatch(GeneralAction.RefetchCommPostAction());

        closeModal();
      };
      console.log({postId});
      const extraData = {post_id: postId};
      await handlePurchase(boostPost.id, cb, extraData);
    } catch (error) {}
  };

  const onSubmit = async () => {
    try {
      let body = {text, title};
      const isErrorFree = checkErrors();
      if (!isErrorFree) {
        return null;
      }
      if (file) {
        const formData = new FormData();
        const imageFormData = await createImageFormData(file, formData);
        dispatch(
          AuthMiddleware.UploadImage({
            type: imageVideoType,
            uploadType: uploadType,
            payload: imageFormData,
            cb: result => {
              const url = result.map(i => i.Location);
              createPost({body, url});
            },
          }),
        );
      } else {
        createPost({body, url: ['']});
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const scrollViewRef = useRef(null);

  const scrollToInput = reactNode => {
    scrollViewRef.current?.scrollTo({
      y: reactNode,
      animated: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[gstyles.container, styles.container, {paddingTop: top}]}>
      <Header back={true} title={t('CREATE_POST')} icon={false} />
      <Loader />
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formItemContainer}>
          <Text allowFontScaling={false} style={styles.label}>{t('UPLOAD_PHOTO_VIDEO')}</Text>
          <ImageUpload
            type={imageVideoType}
            uploadType={uploadType}
            file={file}
            setFile={setFile}
          />
          <Text allowFontScaling={false} style={styles.label}>{t('TITLE')} *</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('ENTER_TITLE')}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.lightGray}
          />
          <Text allowFontScaling={false} style={styles.errorText}>
            {fieldError?.title && `* ${fieldError.title}`}
          </Text>
        </View>
        <View style={styles.formItemContainer}>
          <Text allowFontScaling={false} style={styles.label}>{t('DESCRIPTION')} *</Text>
          <TextInput
            style={[styles.textInput, styles.descInput]}
            multiline
            key={'scroll-1'}
            placeholder={t('ENTER_POST_TEXT')}
            placeholderTextColor={Colors.lightGray}
            value={text}
            onChangeText={setDescription}
            onFocus={event => {
              scrollToInput(event.nativeEvent.target);
            }}
          />
          <View key={'scroll'} />
          <Text allowFontScaling={false} style={styles.errorText}>
            {fieldError?.text && `* ${fieldError?.text}`}
          </Text>
        </View>
        <Button buttonText={t('CREATE')} onPress={onSubmit} />
      </ScrollView>
      <Modal visible={showBuyModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.subContainer}>
            <Text allowFontScaling={false} style={styles.modalHeader}>{t('BOOST_POST')}.</Text>
            <Text allowFontScaling={false} style={styles.modalDescription}>
              {t('BOOST_YOUR_POST_COMMUNITY')}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                buttonText={t('CANCEL')}
                btnStyle={{
                  width: '45%',
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: 'white',
                }}
                onPress={closeModal}
              />
              <Button
                buttonText={t('BOOST')}
                btnStyle={{width: '45%'}}
                loading={iapLoader}
                onPress={handleBoostPurchase}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default CreateCommPost;

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    fontFamily: fonts.LatoBold,
    fontSize: Metrix.FontLarge,
    color: Colors.white,
  },
  modalDescription: {
    fontFamily: fonts.LatoRegular,
    fontSize: Metrix.FontSmall,
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  subContainer: {
    height: Metrix.VerticalSize(200),
    backgroundColor: Colors.carbonBlack,
    width: '85%',
    borderRadius: 12,
    padding: 15,
    gap: 15,
  },
  container: {
    gap: 10,
  },
  scrollContainer: {gap: 10},
  label: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(14),
    color: 'white',
  },
  descInput: {minHeight: 120, textAlignVertical: 'top'},
  textInput: {
    color: 'white',
    fontSize: Metrix.customFontSize(12),
    minHeight: Metrix.VerticalSize(40),
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.white,
    paddingHorizontal: 10,
  },
  formItemContainer: {
    gap: 5,
  },
  errorText: {
    color: 'red',
    fontSize: Metrix.customFontSize(9),
  },
});
