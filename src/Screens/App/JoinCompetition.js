/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
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
  AppState,
  BackHandler,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {configuration} from '../../../config';
import generateJwt from '../../../jwt';
import {
  Button,
  CompetitionHeader,
  CustomModal,
  ScreenTopImage,
} from '../../Components';
import AnimatedFireballArtist from '../../Components/AnimatedFirballArtist';
import {Colors, Icons, Images, Metrix, NavigationService} from '../../Config';
import {
  ToastError,
  ToastSuccess,
  fonts,
  formatZoomPassword,
} from '../../Config/Helper';
import {alertListener} from '../../libraries/initChat';
import {ArtistMiddleware} from '../../Redux/Middlewares';

const START_ROUND_TIME = 2 * 60 * 1000;

const JoinCompetition = ({route}) => {
  const data = route?.params?.item;
  const user = useSelector(state => state?.AuthReducer?.user);

  const creatorUser = data.creator;
  const competitiorUser = data.competitor;

  const areYouCreator = creatorUser?.id == user.id;
  const areYouCompetitor = competitiorUser?.id == user.id;

  const zoom = useZoom();
  const {t} = useTranslation();
  const chatHelper = zoom.chatHelper;

  const timerRound = useRef(null);
  const timeoutRef = useRef(null);
  const timeoutRef2 = useRef(null);
  const timeoutRef3 = useRef(null);

  const dispatch = useDispatch();
  const listeners = useRef([]);
  const [users, setUsersInSession] = useState([]);
  const [compitionParticipants, setCompitionParticipants] = useState([]);
  const [isInSession, setIsInSession] = useState(false);
  const [isStartingCompetion, setStartingCompetition] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [showLiveEnded, setShowLIveEnded] = useState(false);
  const [sessionId, setSessionId] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [winner, setIsWinner] = useState('');
  const [voteCount, setVoteCount] = useState('');
  const [vote, setVote] = useState({votes_created: 0, votes_competitor: 0});
  const [react2, setReact2] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [modalType, setModalType] = useState('');
  const [timer, setTimer] = useState(0); // Timer in seconds

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      } else if (nextAppState === 'background') {
        console.log('App is going to the background!');
        handleAppBackground();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        modalOpen('OpponentLeft');
        return true;
      },
    );

    return () => backHandler?.remove();
  });

  useEffect(() => {
    join();
  }, []);

  useEffect(() => {
    const listenerCallBack = async response => {
      if (response && response.react && response.type === 2) {
        setReact2(p => p + 1);
      }

      if (response && (response?.votes_created || response?.votes_competitor)) {
        if (response.votes_created) {
          if (areYouCreator) {
            Toast.show(ToastSuccess('You got a vote'));
          } else {
            Toast.show(ToastSuccess(`${competitiorUser.username} got a vote`));
          }
        }
        if (response.votes_competitor) {
          if (areYouCompetitor) {
            Toast.show(ToastSuccess('You got a vote'));
          } else {
            Toast.show(ToastSuccess(`${creatorUser.username} got a vote`));
          }
        }
        setVote(p => ({
          votes_competitor: response?.votes_competitor + p?.votes_competitor,
          votes_created: response?.votes_created + p?.votes_created,
        }));
      }

      const mySelf = await zoom.session.getMySelf();
      if (response?.comp_join && mySelf.isHost) {
        Toast.show(
          ToastSuccess(response?.competition + "Let's start in 20 Seconds"),
        );
        setStartingCompetition(true);
        timeoutRef.current = setTimeout(() => {
          startRound();
        }, 20 * 1000);
        return;
      }

      if (response?.comp_end && response?.competitionData) {
        onComplteCompetition(response?.competitionData);
      }

      if (response?.round_created) {
        setStartingCompetition(false);
        Toast.show(ToastSuccess('Turn of Host'));
        setTimer(START_ROUND_TIME / 1000);
        timerRound.current = 1;
        await muteUnmute();
        if (mySelf?.isHost) {
          timeoutRef2.current = setTimeout(() => {
            completeUser1API();
          }, START_ROUND_TIME);
        }
        return;
      }
      if (response?.user1_complete) {
        Toast.show(ToastSuccess('Turn of Competitor'));
        setTimer(START_ROUND_TIME / 1000);
        timerRound.current = 2;
        await muteUnmute();
        if (!mySelf?.isHost) {
          timeoutRef3.current = setTimeout(() => {
            completeUser2API();
          }, START_ROUND_TIME);
        }
        return;
      }
      if (response?.user2_complete) {
        Toast.show(ToastSuccess('Round Completed'));
        timerRound.current = 1;
        await muteUnmute();
        if (mySelf?.isHost) {
          if (response?.round == 3) {
            Toast.show(ToastSuccess('Competition End'));
            completeCompitition();
          } else {
            startRound();
          }
        }
        setCurrentRound(round => round + 1);

        return;
      }

      if (response?.opponent_ended) {
        console.log('===LEAVE OPPONENT===>', JSON.stringify(response, null, 1));
        Toast.show(ToastError(t('OPPONENT_LEFT')));
        handleLeaveSession();
      }
    };

    const listen = () => alertListener(listenerCallBack);
    listen();

    return () => {
      if (timeoutRef.current) {
        console.log('CLEARING FIRST TIMER', timeoutRef?.current);
        clearTimeout(timeoutRef?.current);
        console.log('FIRST TIMER', timeoutRef?.current);
      }
      if (timeoutRef2.current) {
        console.log('CLEARING SECOND TIMER', timeoutRef2?.current);
        clearTimeout(timeoutRef2?.current);
        console.log('SECOND TIMER', timeoutRef2?.current);
      }
      if (timeoutRef3.current) {
        console.log('CLEARING THIRD TIMER', timeoutRef3?.current);
        clearTimeout(timeoutRef3?.current);
        console.log('THIRD TIMER', timeoutRef3?.current);
      }
      // alertListener(listenerCallBack);
      listen();
    };
  }, []);

  useEffect(() => {
    const userJoin = zoom.addListener(EventType.onUserJoin, async event => {
      const {remoteUsers} = event;
      const mySelf = await zoom.session.getMySelf();
      const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
      setUsersInSession([mySelf, ...remote]);
      setCompitionParticipants([mySelf, ...remote]);
    });

    return userJoin.remove;
  }, []);

  // Zoom Error Listener
  useEffect(() => {
    const zoomeError = zoom.addListener(EventType.onError, error => {
      console.log('===ZOOM ERROR error===>', JSON.stringify(error, null, 1));
    });
    return () => zoomeError.remove();
  }, []);

  useEffect(() => {
    const chatNewMessage = zoom.addListener(
      EventType.onChatNewMessageNotify,
      messageItem => {
        const content = messageItem.content;
        const sender = messageItem.senderUser;
        const senderName = sender.userName;

        if (content === 'The live session has ended.') {
          setShowLIveEnded(true);
        }
      },
    );
    return () => {
      chatNewMessage.remove();
    };
  }, [chatHelper, zoom]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const join = async () => {
    // const session_name = data?.session_name || `competition-${user?.id}`;
    const session_name = data?.text.replace(' ', '');
    const session_password = formatZoomPassword(data?.text);
    const display_name = user?.username;

    const token = await generateJwt(session_name, configuration.roleType);

    const sessionJoin = zoom.addListener(EventType.onSessionJoin, async () => {
      const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
      const remoteUsers = await zoom.session.getRemoteUsers();
      setUsersInSession([mySelf, ...remoteUsers]);
      setIsInSession(true);

      const sessionID = await zoom.session.getSessionID();
      setSessionId(sessionID);
      const postData = {sessionId: sessionID};
      if (user?.id == data?.created_id) {
        console.warn('Joined as First Artist  == Api call start competition');

        dispatch(
          ArtistMiddleware.StartCompetition({
            id: data?.id,
            payload: {
              ...postData,
              session_name,
              session_password,
              display_name,
            },
            cb: () => {
              console.warn('line : 261 joined compition as artist');
            },
          }),
        );
      } else if (user?.id == data?.competitor_id) {
        console.log('Joined as Second Artist  == Api call JoinCompetition');
        setStartingCompetition(true);
        dispatch(
          ArtistMiddleware.JoinCompetition({
            id: data?.id,
            payload: postData,
            cb: () => {
              console.warn(
                'line : 269 joined compition as  competitior artist',
              );
            },
          }),
        );
      }
    });

    listeners.current.push(sessionJoin);

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
        const user = changedUsers.find(user => user.userId === mySelf.userId);
        if (user) {
          mySelf.audioStatus.isMuted().then(muted => setIsAudioMuted(muted));
        }
      },
    );
    listeners.current.push(userAudio);

    const sessionLeave = zoom.addListener(EventType.onSessionLeave, event => {
      setIsInSession(false);
      listeners.current.forEach(listener => listener.remove());
      listeners.current = [];
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
      }
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
      setUsersInSession([]);
      sessionLeave.remove();
      NavigationService.goBack();
    });

    const joinPayload = {
      sessionName: session_name,
      sessionPassword: session_password,
      token: token,
      userName: display_name,
      audioOptions: {
        connect: true,
        mute: true,
        autoAdjustSpeakerVolume: false,
      },
      videoOptions: {localVideoOn: true},
      sessionIdleTimeoutMins: configuration.sessionIdleTimeoutMins,
      isCompetition: true,
    };

    await zoom.joinSession(joinPayload);

    return () => {
      listeners.current.forEach(listener => listener.remove());
      listeners.current = [];
    };
  };

  const createRound = () => {
    const cb = async () => {
      console.log('first rount first user api create round');
      console.log(`==>> Round ${currentRound} Started`, 'User 1, creates API!');
    };
    dispatch(
      ArtistMiddleware.CreateRound({id: data?.id, payload: {sessionId}, cb}),
    );
  };

  const startRound = () => {
    createRound();
    setStartingCompetition(false); // Reset timer to 2 minutes
  };

  const muteUnmute = async () => {
    const mySelf = await zoom.session.getMySelf();
    if (mySelf.isHost && timerRound.current == 1) {
      await zoom.audioHelper.unmuteAudio(mySelf.userId);
    }
    if (mySelf.isHost && timerRound.current == 2) {
      await zoom.audioHelper.muteAudio(mySelf.userId);
    }
    if (!mySelf.isHost && timerRound.current == 2) {
      await zoom.audioHelper.unmuteAudio(mySelf.userId);
    }
    if (!mySelf.isHost && timerRound.current == 1) {
      await zoom.audioHelper.muteAudio(mySelf.userId);
    }
    // setMySelf(mySelf);
  };

  const completeUser1API = () => {
    const cb = async () => {
      console.log(
        `==>> Round ${currentRound} Started`,
        'User 1 please completes  API.',
      );
    };
    dispatch(
      ArtistMiddleware.CompleteRound({id: data?.id, payload: {sessionId}, cb}),
    );
  };

  const completeUser2API = () => {
    const cb = () => {
      console.warn('User 2 Completed', `Round ${currentRound} Completed!`);
    };
    dispatch(
      ArtistMiddleware.CompleteRound({id: data?.id, payload: {sessionId}, cb}),
    );
  };

  const onComplteCompetition = res => {
    if (res?.creator_win > res?.competitor_win) {
      const name = data?.creator?.username ?? data?.creator?.name;
      setIsWinner(`${name} wins with ${res?.creator_win} votes `);
      setVoteCount(res?.creator_win);
    }
    if (res?.competitor_win > res?.creator_win) {
      const name = data?.competitor?.username ?? data?.competitor?.name;
      setIsWinner(`${name} wins with ${res?.competitor_win} votes `);
      setVoteCount(res?.competitor_win);
    }
    if (res?.competitor_win == res?.creator_win) {
      setIsWinner(
        `${data?.creator?.username ?? data?.creator?.name} and ${
          data?.competitor?.username ?? data?.competitor?.name
        } share an equal number of votes with ${res?.creator_win} votes each.`,
      );
    }
    modalOpen('End');
  };

  const completeCompitition = () => {
    const cb = res => {
      console.log('line 223', res);
    };
    dispatch(
      ArtistMiddleware.CompleteCompetition({
        id: data?.id,
        payload: {sessionId},
        cb,
      }),
    );
  };

  const handleLeaveSession = () => {
    if (data?.created_id === user?.id) {
      const message = 'The live session has ended.';
      chatHelper.sendChatToAll(message);
    }
    zoom.leaveSession(false);
    return;
  };

  const modalOpen = type => {
    setOpenModal(true);
    setModalType(type);
  };

  const modalClose = () => {
    setOpenModal(false);
    setModalType('');
  };

  const handleAppBackground = () => {
    console.log('Handle app background logic here');
    forceGoBack();
    NavigationService.resetStack('UserStack');
  };

  const forceGoBack = () => {
    const cb = () => {
      modalClose();
      NavigationService.resetStack('UserStack');
    };
    dispatch(ArtistMiddleware.EndCompetition({id: data?.id, cb}));
  };

  const RenerModalBody = () => {
    return (
      <View style={styles.modalWrapper}>
        {modalType == 'End' ? (
          <View>
            <View style={styles.modalContentContainer}>
              <Text allowFontScaling={false} style={styles.modalMessage}>{t('COMPETITION_END')}</Text>
              <Text allowFontScaling={false} style={styles.winnerText}>{winner}</Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View>
                  <Button
                    buttonText={t('CLOSE')}
                    onPress={() => {
                      handleLeaveSession();
                      setTimeout(() => {
                        setOpenModal(false);
                      }, 500);
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.giftImageCotainer}>
              <ScreenTopImage image={Images.gift} size={72} rounded={false} />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.modalContentContainer}>
              <Text allowFontScaling={false} style={styles.modalMessage}>{t('WARNING')}</Text>
              <Text allowFontScaling={false} style={styles.winnerText}>{t('COMPETITION_WARNING')}</Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View style={{width: '48%'}}>
                  <Button buttonText={t('CLOSE')} onPress={modalClose} />
                </View>
                <View style={{width: '48%'}}>
                  <Button buttonText={t('LEAVE')} onPress={forceGoBack} />
                </View>
              </View>
            </View>
          </View>
        )}
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
                handleLeaveSession();
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

  const RenerStartingCompetition = () => {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false}
            style={[
              styles.modalMessage,
              {fontSize: Metrix.customFontSize(18)},
            ]}>
            {t('LIVE_COMPETITION_STARTING_SOON')}
          </Text>
        </View>
        <View style={styles.giftImageCotainer} />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.primary}}>
      {users?.length > 0 ? (
        <View style={{flex: 1}}>
          {users?.slice(0, 2)?.map(user => {
            return (
              <View style={styles.container} key={user?.userId}>
                <ZoomView
                  style={styles.container}
                  userId={user?.userId}
                  fullScreen
                  videoAspect={VideoAspect.PanAndScan}
                />
                {renderRound({
                  user,
                  timerRound,
                  currentRound,
                  timer,
                  vote: vote,
                })}
              </View>
            );
          })}
          <View style={{position: 'absolute', top: Metrix.VerticalSize(0)}}>
            <CompetitionHeader
              count={`${users?.length - 1}`}
              style={styles.liveStreamHeader}
              leaveSession={() => modalOpen('OpponentLeft')}
              creatorImage={data?.creator?.profile_pic_URL}
              isCompetition={true}
              creatorName={data?.creator?.username ?? data?.creator?.name}
              competitionTitle={data?.text}
            />
          </View>
          <AnimatedFireballArtist trigger={react2} image={Images.heart} />
          <CustomModal show={openModal} children={<RenerModalBody />} />
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <CustomModal show={showLiveEnded} children={<RenerLiveEnded />} />
      <CustomModal
        show={isStartingCompetion}
        children={<RenerStartingCompetition />}
      />
    </View>
  );
};
export default JoinCompetition;

const renderRound = ({user, timerRound, currentRound, timer, vote}) => {
  const {votes_competitor, votes_created} = vote;

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const showTimer =
    user.isHost && timerRound.current == 1
      ? true
      : user.isHost && timerRound.current == 2
      ? false
      : !user.isHost && timerRound.current == 2
      ? true
      : false;

  return (
    <View style={styles.roundContainer}>
      <View style={styles.subRoundContainer}>
        <View
          style={{
            ...styles.muteContainer,
            backgroundColor:
              user.isHost && timerRound.current == 1
                ? 'green'
                : user.isHost && timerRound.current == 2
                ? 'red'
                : !user.isHost && timerRound.current == 2
                ? 'green'
                : 'red',
          }}>
          <Icons.Feather
            name={
              user.isHost && timerRound.current == 1
                ? 'mic'
                : user.isHost && timerRound.current == 2
                ? 'mic-off'
                : !user.isHost && timerRound.current == 2
                ? 'mic'
                : 'mic-off'
            }
            size={Metrix.customFontSize(22)}
            color={Colors.white}
            size={20}
          />
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <Text allowFontScaling={false} style={styles.liveCountText}>Round {currentRound}</Text>
          </View>
          <Text allowFontScaling={false} style={styles.roundStatusText}>in progress</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 3,
          alignItems: 'center',
          right: 10,
        }}>
        <Text allowFontScaling={false} style={styles.liveCountText}>
          {user?.isHost ? vote?.votes_created : vote?.votes_competitor}
        </Text>
        <View style={{height: 27, width: 30}}>
          <Image
            source={Images.fireball}
            resizeMode="contain"
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </View>
      {showTimer && (
        <View>
          <Text allowFontScaling={false} style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subRoundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roundContainer: {
    position: 'absolute',
    height: 70,
    width: '100%',
    flex: 1,
    bottom: 0,
    paddingHorizontal: Metrix.HorizontalSize(10),
    left: '2.3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  muteContainer: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrix.VerticalSize(40),
    aspectRatio: 1,
  },
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
  },
  winnerText: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
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
    height: Metrix.VerticalSize(230),
    borderRadius: 40,
  },
  giftImageCotainer: {
    alignItems: 'center',
    position: 'absolute',
    top: -50,
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
  liveCountText: {
    fontSize: Metrix.customFontSize(17),
    fontFamily: fonts.RubikBold,
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(10),
  },
  roundStatusText: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.RubikRegular,
    color: Colors.pearlGrey,
    marginLeft: Metrix.HorizontalSize(10),
  },
  timerText: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.RubikBold,
    color: Colors.white,
    // fontWeight: 'bold',
  },
});
