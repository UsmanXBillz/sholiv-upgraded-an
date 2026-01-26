import {useZoom} from '@zoom/react-native-videosdk';
import React, {useEffect, useState} from 'react';
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
import {Header, ListEmpty, SearchTextField} from '../../Components';
import {Colors, Icons, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts, openStripeModal} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import PaymentConfirmModal from '../../Components/PaymentConfirmModal';
import {useIAP} from '../../Components/Providers/IAP.Provider';
const lodash = require('lodash');

const TopStreams = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);

  const zoom = useZoom();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedStreams, setSearchedStreams] = useState([]);
  const [nextPage, setNextPage] = useState(0);

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);
  const [liveItem, setLiveItem] = useState(null);
  const {
    handlePurchase,
    plans: {liveStream},
  } = useIAP();

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    // openStripeModal(purchaseInfo, user?.id, 'livestreaming', null, () =>
    //   joinEvent(liveItem),
    // );
    const extraData = {live_stream_id: liveItem.id};
    await handlePurchase(
      liveStream.id,
      () => joinEvent(liveItem),
      extraData,
    );
    closeModal();
  };

  useEffect(() => {
    getTopStreams();
  }, []);

  const getTopStreams = () => {
    dispatch(
      ArtistMiddleware.GetTopStreams({
        offset: nextPage,
        cb: res => {
          if (res !== 'error') {
            setNextPage(nextPage + 1);
            setData([...data, ...res]);
          }
        },
      }),
    );
  };

  const joinEvent = async item => {
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
      });
  };
  const joinZoomSession = async item => {
    dispatch(
      ArtistMiddleware.JoinStream({
        id: item?.id,
        cb: async res => {
          if (res?.client_secret) {
            // openStripeModal(res, user?.id, 'livestreaming', null, cb);
            setLiveItem(item);
            setPurchaseInfo(res);
            setConfirmPurchase(true);
          } else {
            joinEvent(item);
          }
        },
      }),
    );
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={() => joinZoomSession(item)}>
          <Image
            resizeMode="cover"
            style={{width: '100%', height: Metrix.VerticalSize(200)}}
            source={{uri: item?.url[0]}}
          />
          <View style={styles.titleContainer}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.videoTitle}>
              {capitalize(item?.text)}
            </Text>
            <Text allowFontScaling={false} style={styles.postTitleMessage}>
              {capitalize(item?.user?.name ?? item?.user?.username)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={gstyles.pauseButton}
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

  const searchStream = text => {
    setSearchText(text);

    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const cb = data => {
          setSearchedStreams(
            text || !searchedStreams ? data : [...searchedStreams, ...data],
          );
        };
        dispatch(
          ArtistMiddleware.GetTopStreams({
            cb,
            name: text.toLowerCase(),
            offset: 0,
          }),
        );
      }, 1000);

      debounce_fun();
    } else {
      getTopStreams();
    }
  };

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('TOP_STREAMS')} isIcon={false} />
      <View style={gstyles.marginVertical15}>
        <SearchTextField
          onChangeText={text => searchStream(text)}
          value={searchText}
        />
      </View>
      <View
        style={[gstyles.marginVertical10, {height: Metrix.VerticalSize(700)}]}>
        <FlatList
          data={searchText ? searchedStreams : data}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(200)}}
          onEndReachedThreshold={0.3}
          onEndReached={() => getTopStreams()}
          renderItem={renderItem}
          ListEmptyComponent={
            <ListEmpty
              message={t('NO_TOP_STREAM_FOUND')}
              style={{textAlign: 'center'}}
            />
          }
        />
      </View>

      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </View>
  );
};

export default TopStreams;

const styles = StyleSheet.create({
  videoWrapper: {
    marginVertical: Metrix.VerticalSize(12),
    borderRadius: 16,
    overflow: 'hidden',
  },
  titleContainer: {
    width: '100%',
    marginTop: Metrix.VerticalSize(12),
  },
  videoTitle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    overflow: 'hidden',
    marginHorizontal: Metrix.HorizontalSize(4),
  },
  postTitleMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.blue,
  },
});
