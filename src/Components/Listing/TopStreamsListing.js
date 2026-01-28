import {useZoom} from '@zoom/react-native-videosdk';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {configuration} from '../../../config';
import generateJwt from '../../../jwt';
import {Colors, Icons, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts, openStripeModal} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import LableWithSeeAll from '../LableWithSeeAll';
import ListEmpty from '../ListEmpty';
import PaymentConfirmModal from '../PaymentConfirmModal';
import {useIAP} from '../Providers/IAP.Provider';

const TopStreamsListing = () => {
  const dispatch = useDispatch();
  const zoom = useZoom();
  const {t} = useTranslation();

  const user = useSelector(state => state?.AuthReducer?.user);
  const [topStreams, setTopTreams] = useState(null);

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);
  const [liveItem, setLiveItem] = useState(null);

  const {
    handlePurchase,
    plans: {liveStream},
  } = useIAP();

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    const data = {live_stream_id: liveItem?.id};
    await handlePurchase(
      liveStream?.id || liveStream?.productId,
      () => joinLive(liveItem),
      data,
    );
    closeModal();
    // openStripeModal(purchaseInfo, user?.id, 'livestreaming', null, () =>
    //   joinLive(liveItem),
    // );
  };

  useEffect(() => {
    getTopStreams();
  }, []);

  const getTopStreams = () => {
    const cb = data => {
      const list = data?.splice(0, 3);
      setTopTreams(list);
    };
    dispatch(ArtistMiddleware.GetTopStreams({cb}));
  };

  const joinLive = async item => {
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
      .then(() => {
        NavigationService.navigate('Call', {isSeesion: true, data: item});
      })
      .catch(e => {
        console.log(e);
      });
  };
  const joinZoomSession = async item => {
    dispatch(
      ArtistMiddleware.JoinStream({
        id: item?.id,
        cb: async res => {
          if (res?.client_secret) {
            setPurchaseInfo(res);
            setLiveItem(item);
            setConfirmPurchase(true);
            // openStripeModal(res, user?.id, 'livestreaming', null, cb);
          } else {
            joinLive(item);
          }
        },
      }),
    );
  };

  const renderItem = ({item}) => {
    return (
      <View key={`${item.key}`}>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={() => joinZoomSession(item)}>
          <Image
            resizeMode="cover"
            style={{
              width: Metrix.VerticalSize(270),
              height: Metrix.VerticalSize(150),
            }}
            source={{uri: item?.url[0]}}
          />
          <View style={styles.titleContainer}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.videoTitle}>
              {capitalize(item?.text)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[gstyles.pauseButton, {top: '40%'}]}
          onPress={() => joinZoomSession(item)}>
          <Icons.Ionicons
            name={'play'}
            size={28}
            color={Colors.liveColorCode}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <LableWithSeeAll
        title={t('TOP_STREAMS')}
        onPress={() => NavigationService.navigate('TopStreams')}
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={topStreams}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        ListEmptyComponent={<ListEmpty message={t('NO_TOP_STREAM_FOUND')} />}
      />
      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </View>
  );
};

export default memo(TopStreamsListing);

const styles = StyleSheet.create({
  videoWrapper: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    width: Metrix.VerticalSize(270),
    marginTop: Metrix.VerticalSize(12),
  },
  videoTitle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    overflow: 'hidden',
    marginLeft: Metrix.HorizontalSize(2),
  },
});
