import {useZoom} from '@zoom/react-native-videosdk';
import moment from 'moment';
import React, {memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {configuration} from '../../config';
import generateJwt from '../../jwt';
import {Colors, Images, Metrix, NavigationService} from '../Config';
import {
  ToastError,
  capitalize,
  convertToTimezone,
  fonts,
} from '../Config/Helper';
import {ArtistMiddleware} from '../Redux/Middlewares';
import PaymentConfirmModal from './PaymentConfirmModal';
import {useIAP} from './Providers/IAP.Provider';

const NotificationCard = ({
  item,
  acceptRequest,
  deletRequest,
  isUpcomingComp = false,
  selectedTab,
  startLive,
  isFan = false,
}) => {
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);
  const dispatch = useDispatch();
  const zoom = useZoom();
  const [isLoading, setIsLoading] = useState(true);
  const {
    handlePurchase,
    plans: {liveStream},
  } = useIAP();

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    const data = {live_stream_id: item.id};
    await handlePurchase(liveStream.id, createAndJoinSession, data);
    closeModal();
  };

  const handleImageLoadStart = () => {
    setIsLoading(true); // Start the loader when the image begins loading
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false); // Stop the loader once the image has loaded
  };

  const createAndJoinSession = async () => {
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

  const joinZoomSession = async () => {
    dispatch(
      ArtistMiddleware.JoinCompetition({
        id: item?.id,
        payload: {sessionId: item?.sessionId},
        cb: async res => {
          if (res?.client_secret) {
            // setPurchaseInfo(res);
            setConfirmPurchase(true);
          } else {
            createAndJoinSession();
          }
        },
      }),
    );
  };

  const onNotificationPress = itemId => {
    if (isFan) {
      if (item?.status !== 4) {
        return Toast.show(
          ToastError(` Host has not joined it yet. Please wait!!`),
        );
      }
      joinZoomSession();
    }

    if (selectedTab == 1) {
      return startLive();
    }
    if (itemId == '11') {
      return NavigationService.navigate('MyCompetetions');
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onNotificationPress(item?.type)}
      style={[
        styles.notificationContainer,
        {alignItems: isUpcomingComp ? 'flex-start' : 'center'},
      ]}>
      <View>
        {/* Show the loader if the image is loading */}
        {isLoading && (
          <ActivityIndicator
            size="small" // You can change this to "large" or a specific size
            color="#0000ff" // Customize the loader color
            style={styles.loader}
          />
        )}

        <Image
          resizeMode={'stretch'}
          source={
            isUpcomingComp
              ? {uri: item?.url[0]}
              : item?.profile_pic_URL
              ? {uri: item?.profile_pic_URL}
              : Images.userPlaceholder
          }
          style={styles.notificationImageStyle}
          onLoadStart={handleImageLoadStart} // Trigger when image starts loading
          onLoadEnd={handleImageLoadEnd} // Trigger when image finishes loading
        />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text allowFontScaling={false} numberOfLines={2} style={styles.notificationTitleText}>
          {capitalize(item?.text)}{' '}
        </Text>
        <View style={styles.notificationTimeContainer}>
          {isUpcomingComp ? (
            <View>
              <Text allowFontScaling={false} style={styles.notificationTimeIndicatorText}>
                {item?.created_id == user?.id ? 'Competitor' : 'Creator'}:{' '}
                {item?.created_id == user?.id
                  ? item?.competitor?.name ?? item?.competitor?.username
                  : item?.creator?.name ?? item?.creator?.username}
              </Text>
              <Text allowFontScaling={false} style={styles.notificationTimeIndicatorText}>
                Scheduled for:{' '}
                {convertToTimezone(
                  item?.competitionDate,
                  item?.competitionTime,
                  item?.timezone,
                )}
              </Text>
            </View>
          ) : (
            <Text allowFontScaling={false} style={styles.notificationTimeIndicatorText}>
              {moment(item?.createdAt).fromNow()}
            </Text>
          )}
          <Text allowFontScaling={false} style={styles.notificationTimestampText}>
            {item?.timestamp}
          </Text>
        </View>
        {isUpcomingComp &&
          selectedTab == 0 &&
          user?.id == item?.competitor_id && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: Metrix.VerticalSize(15),
              }}>
              <TouchableOpacity
                hitSlop={{bottom: 10, left: 6, right: 4, top: 10}}
                onPress={() => acceptRequest(item?.id)}>
                <Text allowFontScaling={false} style={styles.pressableEditText}>{t('ACCEPT')}</Text>
              </TouchableOpacity>
              <Text allowFontScaling={false} style={{color: Colors.white}}> | </Text>
              <TouchableOpacity
                hitSlop={{bottom: 10, left: 4, right: 14, top: 10}}
                onPress={() => deletRequest(item?.id)}>
                <Text allowFontScaling={false} style={styles.pressableDeleteText}>{t('REJECT')}</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>

      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </TouchableOpacity>
  );
};

export default memo(NotificationCard);

const styles = StyleSheet.create({
  sectionTitleText: {
    color: Colors.white,
    fontFamily: fonts.Medium,
    fontSize: Metrix.customFontSize(20),
    marginVertical: Metrix.VerticalSize(40),
  },
  notificationContainer: {
    flexDirection: 'row',
    marginVertical: Metrix.VerticalSize(20),
  },
  notificationImageStyle: {
    width: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    borderRadius: 100,
    marginRight: Metrix.HorizontalSize(15),
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTypeText: {
    color: Colors.white,
  },
  notificationTitleText: {
    color: Colors.white,
    marginBottom: Metrix.VerticalSize(6),
    width: '95%',
    textAlign: 'left',
  },
  notificationTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTimeIndicatorText: {
    color: Colors.blue,
    fontSize: Metrix.customFontSize(16),
    marginRight: Metrix.HorizontalSize(15),
  },
  comepetitionDetails: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(16),
    marginRight: Metrix.HorizontalSize(15),
  },
  notificationTimestampText: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
  },
  flatListContentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    marginTop: Metrix.VerticalSize(20),
  },
  pressableEditText: {
    paddingRight: Metrix.HorizontalSize(20),
    fontFamily: fonts.Regular,
    color: Colors.GRAY_SEMIBOLD,
    color: Colors.white,
  },
  pressableDeleteText: {
    paddingLeft: Metrix.HorizontalSize(15),
    fontFamily: fonts.Regular,
    color: Colors.GRAY_SEMIBOLD,
    color: Colors.white,
  },
  loader: {
    position: 'absolute',
    top: '50%', // Center the loader vertically
    left: '50%', // Center the loader horizontally
    marginLeft: -12, // Offset the loader to center it (half the size of the loader)
    marginTop: -12, // Offset the loader to center it (half the size of the loader)
  },
});
