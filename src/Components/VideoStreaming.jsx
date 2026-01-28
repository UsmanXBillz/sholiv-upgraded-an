/* eslint-disable react-native/no-inline-styles */
import {useZoom} from '@zoom/react-native-videosdk';
import React, {useCallback, useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {configuration} from '../../config';
import generateJwt from '../../jwt';
import {Metrix, NavigationService} from '../Config';
import {ArtistMiddleware} from '../Redux/Middlewares';
import ListEmpty from './ListEmpty';
import PaymentConfirmModal from './PaymentConfirmModal';
import PostCard from './PostCard';
import {useIAP} from './Providers/IAP.Provider';
import VideoStreamCard from './VideoStreamCard';

const VideoStreaming = ({
  data,
  selectedTab,
  user,
  screen,
  getArtistAgainstType,
  isFollowed,
  removeHorizontalPadding = false,
}) => {
  const dispatch = useDispatch();
  const zoom = useZoom();
  const {
    handlePurchase,
    plans: {liveStream},
  } = useIAP();

  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);
  const [liveItem, setLiveItem] = useState(null);

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    // openStripeModal(purchaseInfo, user?.id, 'livestreaming', null, () =>
    //   joinStream(liveItem),
    // );
    const dataObject = {live_stream_id: liveItem?.id};
    await handlePurchase(
      liveStream?.id || liveStream?.productId,
      () => joinStream(liveItem),
      dataObject,
    );
    closeModal();
  };

  const joinStream = async item => {
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
        // setIsInSession(true)
        NavigationService.navigate('Call', {
          isSeesion: true,
          data: item,
          comingFrom: 'videostreamingcard',
        });
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
            // openStripeModal(res, user?.id, 'livestreaming', null, cb);
            setLiveItem(item);
            // setPurchaseInfo(res);
            setConfirmPurchase(true);
          } else {
            joinStream(item);
          }
        },
      }),
    );
  };

  const onLiveStreamCardPress = item => {
    if (item?.status === 2) {
      return NavigationService.navigate('RecordedLive', {item});
    }
    joinZoomSession(item);
  };

  const onEndReachedCall = () => {
    if (screen === 'explore') {
      if (data.length > 0) {
        getArtistAgainstType();
      }
      // setTimeout(() => {
      //   //   dataList.current.scrollToIndex({animated: true, index: 0});
      //   offsetRef.current = false;
      // }, 500);
    }
  };

  const renderItem = useCallback(
    ({item}) => {
      if (screen === 'explore') {
        return item?.live_streams?.length > 0 ? (
          <VideoStreamCard
            item={item}
            user={user}
            onPress={() => joinZoomSession(item)}
          />
        ) : (
          <PostCard item={item} user={user} screen={screen} />
        );
      } else {
        return selectedTab === 0 ? (
          <PostCard item={item} user={user} screen={screen} />
        ) : (
          <VideoStreamCard
            item={item}
            user={user}
            onPress={() => onLiveStreamCardPress(item)}
            isFollowed={isFollowed}
          />
        );
      }
    },
    [screen, selectedTab, user, isFollowed],
  );

  return (
    <>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        // ref={ref => (dataList.current = ref)}
        keyExtractor={(item, index) => index?.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        renderItem={renderItem}
        columnWrapperStyle={{gap: 13}}
        contentContainerStyle={{
          paddingBottom: Dimensions.get('screen').height * 0.5,
          gap: 10,
          //   paddingLeft: Metrix.HorizontalSize(10),
          // marginLeft:28
          //   alignItems: data && data?.length > 1 ? 'center' : 'flex-start',
        }}
        onEndReached={onEndReachedCall}
        ListEmptyComponent={
          <ListEmpty
            message={'No Data Found'}
            style={{textAlign: 'center', width: '100%'}}
          />
        }
      />
      <PaymentConfirmModal
        isVisible={confirmPurchaseModal}
        onCancel={closeModal}
        onPurchase={onPurchase}
      />
    </>
  );
};

// export default memo(VideoStreaming);
export default VideoStreaming;
