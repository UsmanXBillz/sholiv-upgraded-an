/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AnimatedHeart,
  Button,
  CompetitionHeader,
  CustomModal,
} from '../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts, ToastSuccess} from '../../Config/Helper';
import {
  EventType,
  VideoAspect,
  ZoomVideoSdkUser,
  ZoomView,
  useZoom,
} from '@zoom/react-native-videosdk';
import {useDispatch, useSelector} from 'react-redux';
import {configuration} from '../../../config';
import generateJwt from '../../../jwt';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import {competitionListener} from '../../libraries/initChat';
import AnimatedFireballArtist from '../../Components/AnimatedFirballArtist';
import {Image} from 'react-native';
import Toast from 'react-native-toast-message';

const JoinCompetitionAsFan = ({route}) => {
  const data = route?.params?.data;
  const user = useSelector(state => state?.AuthReducer?.user);
  const compId = data?.id;

  const creator = data?.creator;
  const competitor = data?.competitor;

  const [isHideBox, setIsHideBox] = useState(false);
  const [heart, setHeart] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHideBox(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const zoom = useZoom();
  const messageList = useRef();
  const offsetRef = useRef(true);
  const listeners = useRef([]);
  const chatHelper = zoom.chatHelper;
  const [messages, setMessages] = useState([
    {content: 'Please Thumbs Up for Vote in their round!'},
  ]);
  const [users, setUsersInSession] = useState([]);
  const [showLiveEnded, setShowLIveEnded] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [mySelf, setMySelf] = useState(null);
  const [vote, setVote] = useState({votes_created: 0, votes_competitor: 0});

  useEffect(() => {
    join();
  }, []);

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
    if (messages?.length && offsetRef.current) {
      setTimeout(() => {
        if (messageList?.current) {
          messageList.current.scrollToOffset({animated: true, offset: 0});
          offsetRef.current = false;
        }
      }, 500);
    }
  }, [messages]);

  const join = async () => {
    const token = await generateJwt(data?.session_name, configuration.roleType);

    const sessionJoin = zoom.addListener(EventType.onSessionJoin, async () => {
      const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
      setMySelf(mySelf);
      const remoteUsers = await zoom.session.getRemoteUsers();

      const usersWithFlags = remoteUsers.map(user => ({
        ...user,
        isJoined: true,
        name: 'fan', // Mark remote users who joined via this method
      }));

      setUsersInSession([mySelf, ...usersWithFlags]);
      const sessionID = await zoom.session.getSessionID();
      setSessionId(sessionID);
    });

    listeners.current.push(sessionJoin);

    const userJoin = zoom.addListener(EventType.onUserJoin, async event => {
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();

      // Mark the newly joined remote users as 'joined'
      const remote = remoteUsers.map(user => ({
        ...user,
        isJoined: true,
        name: 'fan', // Mark as joined
      }));

      setUsersInSession([mySelf, ...remote]);
    });

    listeners.current.push(userJoin);

    const userLeave = zoom.addListener(EventType.onUserLeave, async event => {
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();
      const remote = remoteUsers.map(user => ({
        ...user,
        isJoined: true,
        name: 'fan', // Still flagging these users as joined
      }));
      setUsersInSession([mySelf, ...remote]);
    });
    listeners.current.push(userLeave);

    // Your other listeners...

    await zoom.joinSession({
      sessionName: data?.session_name,
      sessionPassword: data?.session_password,
      token: token,
      userName: capitalize(user?.name ?? user?.username),
      audioOptions: {
        connect: true,
        mute: true,
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

  const onVotePress = () => {
    dispatch(
      ArtistMiddleware.Vote({
        id: data?.id,
        payload: {sessionId},
        t,
      }),
    );
  };

  const onReactionPress = ({type = 1}) => {
    dispatch(
      ArtistMiddleware.CompetitionReaction({
        id: data?.id,
        payload: {type},
        t,
      }),
    );
  };
  // chat receiving chunk
  useEffect(() => {
    const chatNewMessage = zoom.addListener(
      EventType.onChatNewMessageNotify,
      messageItem => {
        const content = messageItem.content;
        const sender = messageItem.senderUser;
        const senderName = sender.userName;
        setMessages(() => [{content, sender: senderName}]);
      },
    );

    return () => chatNewMessage.remove();
  }, [chatHelper, zoom]);

  useEffect(() => {
    const listenerCallBack = payload => {
      console.log(
        '===COMPETITION LISTENER===>',
        JSON.stringify(payload, null, 1),
      );
      if (payload?.react && [payload?.type === 2]) {
        setHeart(p => p + 1);
      } else if (payload?.comp_end || payload?.opponent_ended) {
        setShowLIveEnded(true);
      } else if (
        Object.keys(payload).includes('votes_competitor') ||
        Object.keys(payload).includes('votes_created')
      ) {
        if (payload.votes_competitor) {
          Toast.show(ToastSuccess(`${competitor?.username} got a vote`));
        }
        if (payload.votes_created) {
          Toast.show(ToastSuccess(`${creator?.username} got a vote`));
        }
        setVote(p => ({
          votes_competitor: payload?.votes_competitor + p?.votes_competitor,
          votes_created: payload?.votes_created + p?.votes_created,
        }));
      }
    };

    const listen = () => competitionListener(compId, listenerCallBack);
    listen();

    return () => {
      listen();
    };
  }, []);

  const leaveSession = () => {
    zoom.leaveSession(false);
    listeners.current.forEach(listener => listener.remove());
    listeners.current = [];
    NavigationService.goBack();
  };

  const RenderLiveEnded = () => {
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
    <View style={{flex: 1, backgroundColor: Colors.black}}>
      {users?.length > 0 ? (
        <View style={{flex: 1}}>
          {users
            ?.filter(val => val?.userName != mySelf?.userName)
            ?.map(user => (
              <View style={styles.container} key={user?.userId}>
                <ZoomView
                  style={styles.container}
                  userId={user?.userId}
                  fullScreen
                  videoAspect={VideoAspect.PanAndScan}
                />
                <View style={styles.absDispContainer}>
                  <Text allowFontScaling={false} style={styles.userNameStyle}>{user?.userName}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 3,
                      alignItems: 'center',
                    }}>
                    <Text allowFontScaling={false} style={styles.userNameStyle}>
                      {user?.isHost
                        ? vote?.votes_created
                        : vote?.votes_competitor}
                    </Text>
                    <View style={{height: 30, width: 30}}>
                      <Image
                        source={Images.fireball}
                        resizeMode="contain"
                        style={{height: '100%', width: '100%'}}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          <View style={{position: 'absolute', top: Metrix.VerticalSize(0)}}>
            <CompetitionHeader
              count={`${users?.length - 1}`}
              style={styles.liveStreamHeader}
              leaveSession={leaveSession}
              creatorImage={data?.creator?.profile_pic_URL}
              isCompetition={true}
              creatorName={data?.creator?.username ?? data?.creator?.name}
              competitionTitle={data?.text}
            />
          </View>
          <View style={styles.footer}>
            <View
              style={[
                styles.voteTextContainer,
                isHideBox && {backgroundColor: 'transparent'},
              ]}>
              {!isHideBox && (
                <Text allowFontScaling={false} style={{color: 'white'}}>{messages[0].content}</Text>
              )}
            </View>
            <AnimatedHeart onPress={onVotePress} />
            <AnimatedHeart
              onPress={() => {
                onReactionPress({type: 2});
              }}
              image={Images.heart}
              style={{
                backgroundColor: 'red',
                width: 100,
                height: 100,
                position: 'absolute',
                bottom: 100,
              }}
            />

            <AnimatedFireballArtist trigger={heart} image={Images.heart} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <CustomModal show={showLiveEnded} children={<RenderLiveEnded />} />
    </View>
  );
};

export default JoinCompetitionAsFan;

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
  liveStreamFooter: {
    position: 'absolute',
    bottom: 0,
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
  helloContainer: {
    position: 'absolute',
    bottom: Metrix.VerticalSize(10), // Adjust bottom positioning for spacing
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: Metrix.HorizontalSize(20), // Ensure left-right padding for the entire container
    alignItems: 'center', // Center the content horizontally
  },
  voteTextContainer: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    paddingVertical: Metrix.VerticalSize(5),
    paddingHorizontal: Metrix.HorizontalSize(10),
    width: Metrix.HorizontalSize(330),
    top: Metrix.VerticalSize(5),
  },
  voteContainer: {},
  footer: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
    // height: Metrix.VerticalSize(50),
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
    paddingBottom: 15,
    paddingRight: 12,
    paddingHorizontal: Metrix.HorizontalSize(3),
    // justifyContent: 'space-between',
  },

  messageText: {
    color: Colors.white,
    fontFamily: fonts.LatoRegular,
    fontSize: Metrix.customFontSize(14), // Adjust the font size for better readability
    flex: 1, // Allow text to take available space
    marginRight: Metrix.HorizontalSize(15), // Space between text and the button
  },
  absDispContainer: {
    height: Metrix.VerticalSize(80),
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  userNameStyle: {
    fontSize: Metrix.customFontSize(17),
    fontFamily: fonts.RubikBold,
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(10),
  },
});
