import React, {memo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {configuration} from '../../config';
import generateJwt from '../../jwt';
import {Colors, Metrix, NavigationService} from '../Config';
import {capitalize, fonts, openStripeModal} from '../Config/Helper';
import gstyles from '../styles';
import ScreenTopImage from './ScreenTopImage';

import {useZoom} from '@zoom/react-native-videosdk';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ArtistMiddleware} from '../Redux/Middlewares';
import PaymentConfirmModal from './PaymentConfirmModal';
import {useIAP} from './Providers/IAP.Provider';

const FollowingProfileCard = ({item, getStreams}) => {
  const zoom = useZoom();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {
    handlePurchase,
    plans: {liveStream},
  } = useIAP();

  const user = useSelector(state => state?.AuthReducer?.user);

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    const data = {live_stream_id: item.id};
    await handlePurchase(liveStream.id, cb, data);
    closeModal();
  };

  const cb = async () => {
    const token = await generateJwt(item?.session_name, configuration.roleType);

    await zoom
      .joinSession({
        sessionName: item?.session_name,
        sessionPassword: item?.session_password,
        userName: user?.username ?? user?.name,
        sessionIdleTimeoutMins: 10,
        token: token,
        audioOptions: {
          connect: true,
          mute: true,
          autoAdjustSpeakerVolume: false,
        },
        videoOptions: {localVideoOn: false},
      })
      .then(res => {
        NavigationService.navigate('Call', {isSeesion: true, data: item});
      })
      .catch(e => {
        console.log(e);
      });
  };

  const joinZoomSession = async () => {
    console.warn('item', item);

    dispatch(
      ArtistMiddleware.JoinStream({
        id: item?.id,
        cb: async res => {
          if (res?.client_secret) {
            setConfirmPurchase(true);
          } else {
            cb();
          }
        },
      }),
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[gstyles.marginRight10, styles.itemContainer]}
        onPress={joinZoomSession}>
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.circle,
              {backgroundColor: item?.isLive ? 'transparent' : Colors.blue},
            ]}></View>
          <ScreenTopImage
            image={item?.user?.profile_pic_URL}
            size={70}
            resizeMode="cover"
            style={{position: 'absolute'}}
          />
        </View>
        <View
          style={[
            styles.liveLabelContainer,
            {marginTop: Metrix.VerticalSize(-20)},
          ]}>
          <Text allowFontScaling={false} style={styles.livetext}>
            {'\u2022'} {t('LIVE')}
          </Text>
        </View>
        <Text allowFontScaling={false}
          style={[styles.itemName, {marginTop: item?.isLive ? 12 : 20}]}
          numberOfLines={2}>
          {capitalize(item?.user?.name ?? item?.user?.username)}
        </Text>
      </TouchableOpacity>
      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </>
  );
};

export default memo(FollowingProfileCard);

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    ...gstyles.justifyAlignCenter,
  },
  liveLabelContainer: {
    backgroundColor: Colors.badgeColor,
    width: Metrix.HorizontalSize(60),
    padding: Metrix.VerticalSize(4),
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  livetext: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(12),
  },
  itemName: {
    color: Colors.white,
    width: 100,
    textAlign: 'center',
  },
  circle: {
    width: Metrix.HorizontalSize(77),
    height: Metrix.HorizontalSize(77),
    borderRadius: Metrix.HorizontalSize(100),
    backgroundColor: Colors.blue,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});
