/* eslint-disable no-undef */
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
import {Colors, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import LableWithSeeAll from '../LableWithSeeAll';
import PaymentConfirmModal from '../PaymentConfirmModal';
import {useIAP} from '../Providers/IAP.Provider';

const UpCompetitionsBlock = () => {
  const dispatch = useDispatch();
  const zoom = useZoom();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);
  const [data, setData] = useState([]);

  const {
    handlePurchase,
    plans: {competition},
  } = useIAP();

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);
  const [liveItem, setLiveItem] = useState(null);

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    const payload = {competition_id: item.id};
    await handlePurchase(
      competition.id,
      () => joinEvent(liveItem),
      payload,
    );
  };

  useEffect(() => {
    getCompetitions();
    return () => {
      getCompetitions();
    };
  }, []);

  const getCompetitions = () => {
    dispatch(
      ArtistMiddleware.GetUpcomingCompetitions({
        offset: 0,
        limit: 100,
        cb: res => {
          if (res !== 'error') {
            setData(res); // Append new data
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
      .then(res => {
        NavigationService.navigate('JoinCompetitionAsFan', {
          isSeesion: true,
          data: item,
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const joinZoomSession = async item => {
    dispatch(
      ArtistMiddleware.JoinCompetition({
        id: item?.id,
        payload: {sessionId: item?.sessionId},
        cb: async res => {
          if (res?.client_secret) {
            // openStripeModal(res, user?.id, 'livestreaming', null, cb);
            // setPurchaseInfo(res);
            setLiveItem(item);
            setConfirmPurchase(true);
          } else {
            joinEvent();
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
            <Text allowFontScaling={false} numberOfLines={1} style={styles.videoTitle}>
              {capitalize(item?.creator?.name) +
                ' vs ' +
                capitalize(item?.competitor?.name)}{' '}
              - {capitalize(item?.text)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (data.length === 0) return <></>;

  return (
    <View>
      <LableWithSeeAll
        title={t('UPCOMING_COMPETITIONS')}
        isShowSeeAll={false}
      />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
      />
      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </View>
  );
};

export default memo(UpCompetitionsBlock);

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

  tabLabelStyle: {
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  tabContainer: {
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(10),
    justifyContent: 'flex-start',
  },
  tabStyle: {
    width: '35%',
  },
  container: {
    ...gstyles.marginVertical10,
    height: Metrix.VerticalSize(700),
  },
  imageContainer: {
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 140 : 100),
    height: Metrix.VerticalSize(Platform.OS === 'ios' ? 236 : 200),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  cardContainer: {
    margin: Metrix.VerticalSize(10),
  },
  flatListContentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    marginTop: Metrix.VerticalSize(20),
  },
  modalWrapper: {
    backgroundColor: 'transparent',
  },
  modalMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(30),
  },
  winnerText: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.RobotoLight,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(10),
    marginBottom: Metrix.VerticalSize(20),
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
});
