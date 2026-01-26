import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  ChatMessagesComponent,
  LiveStreamFooter,
  LiveStreamHeader,
} from '../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {ToastError, ToastSuccess, capitalize, fonts} from '../../Config/Helper';

import {
  EventType,
  VideoAspect,
  ZoomVideoSdkUser,
  ZoomView,
  useZoom,
} from '@zoom/react-native-videosdk';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {configuration} from '../../../config';
import generateJwt from '../../../jwt';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import {artistLiveListener, fansLiveListener} from '../../libraries/initChat';
import AnimatedFireballArtist from '../../Components/AnimatedFirballArtist';

const Live = ({route, navigation}) => {
  const url = route?.params?.url;
  const liveTitle = route?.params?.text;
  const livePassword = route?.params?.password;
  const user = useSelector(state => state?.AuthReducer?.user);

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const zoom = useZoom();
  const messageList = useRef();
  const offsetRef = useRef(true);
  const listeners = useRef([]);
  const chatHelper = zoom.chatHelper;

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsersInSession] = useState([]);
  const [liveId, setLiveId] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const liveIdRef = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [fireballTrigger, setTriggerCount] = useState(0);
  const [heartTrigger, setHeartTriggerCount] = useState(0);
  const [wowTrigger, setWowTriggerCount] = useState(0);

  useEffect(() => {
    join();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleLeaveSession();
        return true;
      },
    );

    return () => backHandler?.remove();
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
    if (liveId) {
      if (user?.user_role == 1) {
        artistLiveListener(liveId?.user_id, data => {
          if (data?.live_stream) {
            Toast.show(ToastSuccess(data?.live_stream));
          }
          if (data?.like) {
            setLikesCount(data?.like);
            if (data.type == 1) {
              setTriggerCount(prev => prev + 1);
            } else if (data?.type == 2) {
              setHeartTriggerCount(p => p + 1);
            } else if (data?.type == 3) {
              setWowTriggerCount(p => p + 1);
            }
          }
        });
      } else {
        fansLiveListener(liveId?.id, data => {
          if (data?.stream_end) {
            Toast.show(ToastError('Host Ended The Stream'));
            zoom.leaveSession();
          }
        });
      }
    }
  }, [liveId, user?.user_role, zoom]);

  const join = async () => {
    setIsStartingSession(true);
    console.log('==================JOINING THE SESSIONS==================');
    const session_name = `live-stream-${user?.id}`;
    const session_password = livePassword;
    console.log(
      '===session_password===>',
      JSON.stringify(session_password, null, 1),
    );
    const display_name = liveTitle;

    const token = await generateJwt(session_name, configuration.roleType);
    console.log('==================TOKEN==================', token);

    // Cleanup previous listeners
    listeners.current.forEach(listener => listener.remove());
    listeners.current = [];

    const sessionJoin = zoom.addListener(EventType.onSessionJoin, async () => {
      console.log('Session joined');

      setIsStartingSession(false);

      const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
      const remoteUsers = await zoom.session.getRemoteUsers();
      setUsersInSession([mySelf, ...remoteUsers]);
      const sessionID = await zoom.session.getSessionID();

      const postData = {
        text: liveTitle,
        sessionId: sessionID,
        session_name,
        session_password,
        display_name,
        url,
      };

      dispatch(
        ArtistMiddleware.CreateLive({
          payload: postData,
          cb: res => {
            setLiveId(res);
            liveIdRef.current = res;
          },
        }),
      );
    });

    listeners.current.push(sessionJoin);

    const userJoin = zoom.addListener(EventType.onUserJoin, async event => {
      console.log('User joined');
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();
      const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
      setUsersInSession([mySelf, ...remote]);
    });
    listeners.current.push(userJoin);

    const userLeave = zoom.addListener(EventType.onUserLeave, async event => {
      console.log('User left');
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();
      const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
      setUsersInSession([mySelf, ...remote]);
    });
    listeners.current.push(userLeave);

    const userVideo = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async event => {
        console.log('User video status changed');
        const {changedUsers} = event;
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        const user = changedUsers.find(user => user.userId === mySelf.userId);
        if (user) {
          // mySelf.videoStatus.isOn().then(on => setIsVideoMuted(!on));
        }
      },
    );
    listeners.current.push(userVideo);

    const userAudio = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async event => {
        console.log('User audio status changed');
        const {changedUsers} = event;
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        const user = changedUsers.find(user => user.userId === mySelf.userId);
        if (user) {
          // mySelf.audioStatus.isMuted().then(muted => setIsAudioMuted(muted));
        }
      },
    );
    listeners.current.push(userAudio);

    const sessionLeave = zoom.addListener(
      EventType.onSessionLeave,
      async () => {
        console.log('Session left');
        setUsersInSession([]);
        listeners.current.forEach(listener => listener.remove());
        listeners.current = [];
        sessionLeave.remove();
        setTimeout(() => {
          NavigationService.resetStack('UserStack');
        }, 1200);
      },
    );

    await zoom.joinSession({
      sessionName: session_name,
      sessionPassword: session_password,
      token: token,
      userName: capitalize(user?.name ?? user?.username),
      audioOptions: {
        connect: true,
        mute: false,
        autoAdjustSpeakerVolume: false,
      },
      videoOptions: {localVideoOn: true},
      sessionIdleTimeoutMins: configuration.sessionIdleTimeoutMins,
    });

    // Cleanup function to remove listeners
    return () => {
      listeners.current.forEach(listener => listener.remove());
      listeners.current = []; // Clear the listeners array
    };
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

  // chat chunk
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
    return () => chatNewMessage.remove();
  }, [chatHelper, zoom]);

  useEffect(() => {
    const errorListener = zoom.addListener(EventType.onError, error => {
      console.log('=======> Zoom error:', error);
      Toast.show({
        text1: 'Error in zoom',
        text2: error.errorType,
        type: 'error',
      });
      setIsStartingSession(false);
    });

    return () => errorListener.remove();
  }, [zoom]);

  const handleLeaveSession = () => {
    const message = 'The live session has ended.';
    // Send a chat message to all participants
    chatHelper.sendChatToAll(message);
    dispatch(
      ArtistMiddleware.SessionComplete({
        id: liveIdRef?.current?.id,
        cb: () => {
          zoom.leaveSession(false);
        },
      }),
    );
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground!');
      } else if (nextAppState === 'background') {
        // App is going to the background
        console.log('App is going to the background!');
        handleAppBackground();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, isStartingSession]);

  const handleAppBackground = () => {
    if (!isStartingSession) {
      console.log('Handle app background logic here');
      forceGoBack();
      handleLeaveSession();
    }
  };
  const forceGoBack = () => {
    handleLeaveSession();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1, backgroundColor: Colors.black}}>
        {users?.length > 0 ? (
          <View style={{flex: 1}}>
            {users
              ?.filter(user => user.isHost)
              ?.map(user => (
                <View style={styles.container} key={user?.userId}>
                  <View>
                    <Text allowFontScaling={false}>Hello</Text>
                  </View>
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
                likesCount={likesCount}
                count={`${users?.length - 1}`}
                style={styles.liveStreamHeader}
                leaveSession={() => handleLeaveSession()}
              />
            </View>
            <View style={styles.footer}>
              <ChatMessagesComponent
                messages={messages}
                messageList={messageList}
                offsetRef={offsetRef}
                isHost={true}
              />
              <AnimatedFireballArtist trigger={fireballTrigger} />
              <AnimatedFireballArtist
                trigger={heartTrigger}
                image={Images.heart}
              />
              <AnimatedFireballArtist trigger={wowTrigger} image={Images.wow} />
              <LiveStreamFooter
                isHost={true}
                text={text}
                setText={setText}
                onSend={sendMessage}
                onChangeText={text => setText(text)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Live;

const styles = StyleSheet.create({
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  zoomView: {
    flex: 1,
    // position:'relative'
  },
  liveStreamHeader: {
    width: '100%',
    zIndex: 1,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
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
    top: 43,
    left: 0,
    right: 0,
  },
  continueBtn: {
    paddingHorizontal: Metrix.HorizontalSize(40),
  },
  footer: {
    position: 'absolute',
    bottom: Metrix.VerticalSize(0),
    backgroundColor: 'transparent',
    width: '100%',
    // height: Metrix.VerticalSize(100),
  },
});
