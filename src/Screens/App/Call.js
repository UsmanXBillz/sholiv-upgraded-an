/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  EventType,
  VideoAspect,
  ZoomVideoSdkUser,
  ZoomView,
  useZoom,
} from '@zoom/react-native-videosdk';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {configuration} from '../../../config';
import generateJwt from '../../../jwt';
import {
  Button,
  ChatMessagesComponent,
  CustomModal,
  LiveStreamFooter,
  LiveStreamHeader,
  ModalCard,
  ScreenTopImage,
} from '../../Components';
import AnimatedFireballArtist from '../../Components/AnimatedFirballArtist';
import {AppData, Colors, Images, Metrix, NavigationService} from '../../Config';
import {ToastError, fonts, openStripeModal} from '../../Config/Helper';
import {fansLiveListener} from '../../libraries/initChat';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {useIAP} from '../../Components/Providers/IAP.Provider';

const {priceList} = AppData;

const RenderGiftAmountModal = ({amount, setAmount}) => {
  const {
    plans: {liveGift},
  } = useIAP();
  return (
    <View style={styles.container}>
      {/* You can add a TextField or other input here if needed */}

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer} // This will align items horizontally
      >
        {liveGift?.map((val, index) => {
          return (
            <TouchableOpacity
              onPress={() => setAmount(val.id)}
              key={index}
              style={[
                styles.amountItem,
                {
                  borderWidth: amount == val.id ? 1 : 0,
                  borderColor:
                    amount == val.id ? Colors.placeholder : null,
                  borderRadius: 10,
                },
              ]}>
              <Text allowFontScaling={false} style={styles.amountIcon}>
                {priceList[val.id]?.icon}
              </Text>
              <Text allowFontScaling={false} style={styles.amountText}>{val.displayPrice}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const Call = ({route}) => {
  const isSesh = route?.params?.isSeesion;
  const data = route?.params?.data;
  const screen = route?.params?.comingFrom;
  const liveId = data?.id;

  const zoom = useZoom();
  const {t} = useTranslation();
  const chatHelper = zoom.chatHelper;

  const messageList = useRef();
  const offsetRef = useRef(true);

  const dispatch = useDispatch();
  const listeners = useRef([]);
  const [users, setUsersInSession] = useState([]);
  const [isInSession, setIsInSession] = useState(isSesh ?? false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [messages, setMessages] = useState([]);
  const [showLiveEnded, setShowLIveEnded] = useState(false);
  const [giftModal, setGiftModal] = useState(false);

  const [like, setLike] = useState(0);
  const [heart, setHeart] = useState(false);
  const [wow, setWow] = useState(false);

  const {handlePurchase} = useIAP();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        leaveSession();
        return true;
      },
    );

    return () => backHandler?.remove();
  });

  useEffect(() => {
    join();
  }, []);

  useEffect(() => {
    if (messages?.length && offsetRef.current) {
      setTimeout(() => {
        if (messageList?.current) {
          messageList.current.scrollToOffset({animated: true, offset: 0});
          offsetRef.current = false;
        }
      }, 500);
    }
  }, [messages]);

  useEffect(() => {
    const preventAudioConnect = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async event => {
        const mySelf = await zoom.session.getMySelf();
        const isMuted = await mySelf.audioStatus.isMuted();
        if (!isMuted) {
          // Immediately mute if SDK tries to auto-connect
          await zoom.audioHelper.muteAudio();
        }
      },
    );

    return () => preventAudioConnect.remove();
  }, []);

  const join = async () => {
    const token = await generateJwt(data?.session_name, configuration.roleType);

    const sessionJoin = zoom.addListener(EventType.onSessionJoin, async () => {
      const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());

      const remoteUsers = await zoom.session.getRemoteUsers();
      setUsersInSession([mySelf, ...remoteUsers]);
      setIsInSession(true);

      const sessionID = await zoom.session.getSessionID();
    });

    listeners.current.push(sessionJoin);

    const userJoin = zoom.addListener(EventType.onUserJoin, async event => {
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();
      const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
      setUsersInSession([mySelf, ...remote]);
    });
    listeners.current.push(userJoin);

    const userVideo = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async event => {
        const {changedUsers} = event;
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        const user = changedUsers.find(user => user.userId === mySelf.userId);
        if (user) {
          mySelf.videoStatus.isOn().then(on => setIsVideoMuted(!on));
        }
      },
    );
    listeners.current.push(userVideo);

    const userAudio = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async event => {
        const {changedUsers} = event;
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        console.log('===mySelf===>', JSON.stringify(mySelf, null, 1));
        const user = changedUsers.find(user => user.userId === mySelf.userId);
        if (user) {
          mySelf.audioStatus.isMuted().then(muted => setIsAudioMuted(muted));
        }
      },
    );
    listeners.current.push(userAudio);

    const sessionLeave = zoom.addListener(EventType.onSessionLeave, event => {
      setIsInSession(false);
      setUsersInSession([]);
      sessionLeave.remove();
    });

    await zoom.joinSession({
      sessionName: data?.session_name,
      sessionPassword: data?.session_password,
      token: token,
      userName: data?.user?.name ?? data?.user?.username,
      audioOptions: {
        connect: false,
        mute: true,
        autoAdjustSpeakerVolume: false,
      },
      videoOptions: {localVideoOn: false},
      sessionIdleTimeoutMins: configuration.sessionIdleTimeoutMins,
    });

    // Cleanup function to remove listeners
    return () => {
      listeners.current.forEach(listener => listener.remove());
      listeners.current = []; // Clear the listeners array
    };
  };

  // chat
  useEffect(() => {
    const chatNewMessage = zoom.addListener(
      EventType.onChatNewMessageNotify,
      messageItem => {
        const content = messageItem.content;
        const sender = messageItem.senderUser;
        const senderName = sender.userName;
        // Add the new message to the state
        setMessages(prevMessages => [
          {content, sender: senderName},
          ...prevMessages,
        ]);
      },
    );
    // Cleanup function to remove the listener
    return () => {
      chatNewMessage.remove();
    };
  }, [chatHelper, zoom]);

  useEffect(() => {
    const liveStreamListener = () =>
      fansLiveListener(liveId, payload => {
        if (payload?.stream_end) {
          setShowLIveEnded(true);
        } else if (payload?.like && payload.type === 1) {
          setLike(p => p + 1);
        } else if (payload?.like && payload.type === 2) {
          setHeart(p => p + 1);
        } else if (payload?.like && payload.type === 3) {
          setWow(p => p + 1);
        }
      });

    liveStreamListener();
    return () => {
      liveStreamListener();
    };
  }, []);

  const leaveSession = () => {
    zoom.leaveSession(false);
    setIsInSession(false);
    listeners.current.forEach(listener => listener.remove());
    listeners.current = [];
    if (screen == 'videostreamingcard') {
      NavigationService.goBack();
    } else {
      NavigationService.resetStack('UserStack');
    }
  };

  const sendMessage = () => {
    if (text.trim() !== '') {
      chatHelper.sendChatToAll(text);
      setTimeout(() => {
        setText('');
      }, 100);
      Keyboard.dismiss();
    }
  };

  const cb = res => {
    if (res?.client_secret) {
      openStripeModal(res, null, 'gift', null, cb);
    }
  };

  const sendGift = async () => {
    console.log('first');
    // dispatch(
    //   AuthMiddleware.sendGiftRequest({
    //     id: data?.id,
    //     amount: parseInt(amount),
    //     cb,
    //   }),
    // );
    const cb = () => {
      setIsAgreed(!isAgreed);
      setGiftModal(false);
      setAmount('');
      setText('');
      Keyboard.dismiss();
    };
    await handlePurchase(amount, cb, {live_stream_id: liveId});
  };

  const onGiftModalClose = () => {
    setGiftModal(false);
    setAmount('');
  };
  console.log(amount);
  const onGiftPress = () => {
    // if (!amount) {
    //   return Toast.show(ToastError(t('PLEASE_ENTER_AMOUNT')));
    // }
    // if (isNaN(amount) || Number(amount) <= 0) {
    //   return Toast.show(ToastError(t('PLEASE_ENTER_VALID_AMOUNT')));
    // }
    // const giftAmount = Number(text);
    // setAmount(giftAmount);
    // console.log({giftAmount});
    setGiftModal(false);
    setTimeout(() => {
      setOpenModal(true);
    }, 500);
  };

  const onReactionPress = ({type = 1}) => {
    console.log('POSTING LIKE', type);
    console.log('===data?.id===>', JSON.stringify(data?.id, null, 1));
    dispatch(AuthMiddleware.PostLike({id: data?.id, type}));
  };

  const modalMessage = {
    [true]: t('SUCCESSFUL_GIFT_SENT'),
    [false]: t('GIFT_AGREE_PROMPT'),
  };
  const modalImage = {
    [true]: Images.fireball,
    [false]: Images.fireball,
  };

  const RenerModalBody = () => {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false} style={styles.modalMessage}>{modalMessage[isAgreed]}</Text>
          {isAgreed ? (
            <View style={styles.continueBtn}>
              <Button
                buttonText={t('CONTINUE')}
                onPress={() => {
                  setOpenModal(!openModal);
                  setIsAgreed(!isAgreed);
                }}
              />
            </View>
          ) : (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{width: '44%'}}>
                <Button buttonText={t('AGREE')} onPress={sendGift} />
              </View>
              <View style={{width: '44%'}}>
                <Button
                  buttonText={t('CANCEL')}
                  onPress={() => setOpenModal(!openModal)}
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.giftImageCotainer}>
          <ScreenTopImage
            image={modalImage[isAgreed]}
            size={90}
            rounded={false}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  const RenerLiveEnded = () => {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false}
            style={[
              styles.modalMessage,
              {fontSize: Metrix.customFontSize(18)},
            ]}>
            {t('LIVE_SESSION_ENDED')}
          </Text>

          <View style={styles.continueBtn}>
            <Button
              buttonText={t('BACK')}
              onPress={() => {
                leaveSession();
                setTimeout(() => {
                  setShowLIveEnded(false);
                }, 500);
              }}
            />
          </View>
        </View>
        <View style={styles.giftImageCotainer}></View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.primary}}>
      {users?.length > 0 ? (
        <View style={{flex: 1}}>
          {users
            ?.filter(user => user?.isHost)
            ?.map(user => (
              <View style={styles.container} key={user?.userId}>
                <ZoomView
                  style={styles.container}
                  userId={user?.userId}
                  fullScreen
                  videoAspect={VideoAspect.PanAndScan}
                />
              </View>
            ))}
          <View style={{position: 'absolute', top: Metrix.VerticalSize(0)}}>
            <LiveStreamHeader
              name={data?.user?.name ?? data?.user?.username}
              status={t('FOLLOWING')}
              hostImage={data?.user?.profile_pic_URL}
              count={`${users?.length - 1}`}
              style={styles.liveStreamHeader}
              leaveSession={leaveSession}
              liveStatus={data?.status}
            />
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: Metrix.HorizontalSize(20), }}>
                    </View> */}

          <View style={{position: 'absolute', bottom: Metrix.VerticalSize(8)}}>
            <ChatMessagesComponent
              messages={messages}
              messageList={messageList}
              offsetRef={offsetRef}
            />
          </View>
          <AnimatedFireballArtist
            trigger={like}
            style={{right: Metrix.HorizontalSize(70)}}
          />
          <AnimatedFireballArtist
            trigger={heart}
            image={Images.heart}
            style={{right: Metrix.HorizontalSize(50)}}
          />
          <AnimatedFireballArtist
            trigger={wow}
            image={Images.wow}
            style={{right: Metrix.HorizontalSize(60)}}
          />
          <LiveStreamFooter
            text={text}
            setText={setText}
            onSend={sendMessage}
            onGiftPress={() => setGiftModal(true)}
            onReactionPress={onReactionPress}
            style={styles.liveStreamFooter}
            onChangeText={text => setText(text)}
          />
          <CustomModal show={openModal} children={<RenerModalBody />} />
          {/* <MuteButtons isAudioMuted={isAudioMuted} isVideoMuted={isVideoMuted} /> */}
          {/* <Button title="Leave Session" color={"#f01040"} onPress={leaveSession} /> */}
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <CustomModal show={showLiveEnded} children={<RenerLiveEnded />} />
      <CustomModal
        show={giftModal}
        children={
          <ModalCard
            title={t('SELECT_AMOUNT')}
            bgColor={Colors.black}
            onPress={onGiftPress}
            onClose={onGiftModalClose}
            children={
              <RenderGiftAmountModal amount={amount} setAmount={setAmount} />
            }
          />
        }
      />
    </View>
  );
};
export default Call;

const styles = StyleSheet.create({
  safe: {
    width: '90%',
    alignSelf: 'center',
    margin: 16,
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  spacer: {
    height: 16,
    width: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  buttonHolder: {
    // flexDirection: "row",
    justifyContent: 'center',
    margin: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  liveStreamHeader: {
    width: '100%',
    zIndex: 1,
  },
  liveStreamFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  modalWrapper: {
    backgroundColor: 'transparent',
    height: Metrix.VerticalSize(500),
    justifyContent: 'center',
  },
  modalMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(30),
    marginBottom: Metrix.VerticalSize(26),
  },

  modalContentContainer: {
    backgroundColor: Colors.black,
    borderWidth: 0.6,
    borderColor: Colors.backgroundGrayDark,
    opacity: 0.8,
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(20),
    height: Metrix.VerticalSize(230),
    borderRadius: 40,
  },
  giftImageCotainer: {
    marginVertical: Metrix.VerticalSize(20),
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  continueBtn: {
    paddingHorizontal: Metrix.HorizontalSize(40),
  },
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: Metrix.VerticalSize(10),
  },
  amountItem: {
    marginRight: Metrix.HorizontalSize(10),
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(16),
  },
  amountIcon: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(26),
    marginBottom: Metrix.VerticalSize(6),
  },
});
