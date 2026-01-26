import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import gstyles from '../../styles';
import {
  AppData,
  Colors,
  Icons,
  Images,
  Metrix,
  NavigationService,
} from '../../Config';
import {capitalize, fonts} from '../../Config/Helper';
import {ArtistMiddleware, ChatMiddleware} from '../../Redux/Middlewares';
import {
  ScreenTopImage,
  Button,
  Tabs,
  VideoStreaming,
} from '../../Components';
import PaymentConfirmModal from '../../Components/PaymentConfirmModal';
import {useIAP} from '../../Components/Providers/IAP.Provider';
import {GeneralAction} from '../../Redux/Actions';

const {contentTabList} = AppData;

const ArtistProfile = ({route}) => {
  const {top} = useSafeAreaInsets();
  const greyHeight = Metrix.VerticalSize(120);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);
  const id = route?.params?.id ?? user?.id;
  const isAdmin = user?.email_address === 'admin@showliv.com';
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const [post, setPost] = useState(null);
  const [liveStreams, setliveStreams] = useState(null);
  const [isLoggedUser, setIsLoggedUser] = useState(false);
  const [isPlanFound, setIsPlanFound] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabName, setTabName] = useState('POSTS');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);

  const refetchListings = useSelector(
    state => state?.GeneralReducer?.refetchListings,
  );

  const {
    plans: {artistFollow},
    handlePurchase,
  } = useIAP();

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    const data = {artist_id: id};
    await handlePurchase(artistFollow.id, null, data);
    closeModal();
  };

  const checkFollowing = userid => {
    const cb = res => {
      if (res) {
        setIsFollowed(res);
      }
    };
    dispatch(ArtistMiddleware.CheckFollowing({id: userid, cb}));
  };

  const getProfileById = () => {
    const cb = res => {
      console.log("===artist===>", JSON.stringify(res, null, 1));
      setData(res);
      if (res?.id !== user?.id) {
        setIsLoggedUser(false);
        checkFollowing(res?.id);
        getArtistPosts();
      } else {
        setIsLoggedUser(true);
        getPosts();
      }
    };
    dispatch(ArtistMiddleware.GetArtistProfileById({id, cb}));
  };

  const getPosts = () => {
    const cb = res => {
      setPost(res);
    };
    const payload = {artist_id: id};
    dispatch(ArtistMiddleware.GetPosts({payload, cb}));
  };

  const getArtistPosts = () => {
    const cb = res => {
      setPost(res);
    };
    dispatch(ArtistMiddleware.GetArtistPosts({cb, id}));
  };

  const getMyStreams = ind => {
    const cb = data => {
      setliveStreams(data);
      setSelectedTab(ind);
    };
    dispatch(ArtistMiddleware.GetMyStream(cb));
  };

  const getArtistStreams = (ind, artistId) => {
    const cb = data => {
      setliveStreams(data);
      setSelectedTab(ind);
    };
    dispatch(ArtistMiddleware.GetArtistStream({id: artistId, cb}));
  };

  const typeListing = {
    0: post,
    1: liveStreams,
  };

  const handleFilterSelect = (tab, index) => {
    setTabName(tab);
    if (tab === 'POSTS') {
      if (data?.id !== user?.id) {
        setSelectedTab(index);
        return getArtistPosts();
      } else {
        setSelectedTab(index);
        getPosts();
        return;
      }
    }

    if (tab === 'VIDEO_STREAMING') {
      if (data?.id !== user?.id) {
        return getArtistStreams(index, data?.id);
      }
      return getMyStreams(index);
    }

    if (tab === 'FREE_TRIAL' || tab === '10_SEC_TRIAL') {
      NavigationService.navigate('FreeTrial', {data, isFollowed});
      setSelectedTab(0);
      return;
    }
  };

  useEffect(() => {
    if (refetchListings) {
      handleFilterSelect(tabName, selectedTab);
    }
  }, [refetchListings]);

  const getActivePlan = () => {
    const cb = arg => {
      if (arg.length) {
        const isGold = arg[0]?.plan_id === 6 ? 'star' : 'crown';
        setIsPlanFound(isGold);
      }
    };
    dispatch(ArtistMiddleware.GetActivePlan({cb, id}));
  };

  useFocusEffect(
    useCallback(() => {
      getProfileById();
      getActivePlan();
    }, [id]),
  );

  const isBoosted = moment().isBefore(data?.artist_expiry);

  const handleOptionsToggle = () => {
    setIsVisible(!isVisible);
  };

  const goBackFunc = () => {
    setSelectedTab(0);
    NavigationService.goBack();
  };

  const handleFollowToggle = () => {
    const payload = {artist_id: id};

    const cb = data => {
      if (data?.follow) {
        setIsFollowed(data?.success);
        return getProfileById();
      }
      if (data?.client_secret) {
        setPaymentInfo({data: data, id});
        setConfirmPurchase(true);
        return;
      }
    };

    dispatch(ArtistMiddleware.FollowArtist(payload, cb));
  };

  const handleFreeFollowToggle = () => {
    const payload = {artist_id: id};

    const cb = data => {
      if (data) {
        setIsFollowed(true);
        return getProfileById();
      }
    };

    dispatch(ArtistMiddleware.FreeFollowArtist({payload, cb}));
  };

  const onCompetitionBtnPress = () => {
    NavigationService.navigate('SelectArtistsForCompetition', {data});
  };

  const canViewLiveStream = isLoggedUser || isFollowed;

  const createMessage = () => {
    const payload = {artist_id: id};
    const cb = () => setIsVisible(false);
    dispatch(
      ChatMiddleware.CreateConversation({payload, participantData: data, cb}),
    );
  };

  const toggleBlockUser = () => {
    const payload = {id};
    const cb = response => {
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: data?.status === 3 ? 'User unblocked' : 'User Blocked',
          visibilityTime: 2000,
        });
      }
      setIsVisible(false);
      return getProfileById();
    };
    data?.status === 3
      ? dispatch(ArtistMiddleware.UnblockUser(payload, cb))
      : dispatch(ArtistMiddleware.BlockUser(payload, cb));
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
      <View style={[styles.mainContainer, {paddingTop: top}]}>
        {/* Grey Background Section */}
        <View style={styles.greyBackground}>
          {/* Custom Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={goBackFunc}
              activeOpacity={0.7}>
              <Icons.AntDesign
                name={'arrowleft'}
                color={Colors.white}
                size={Metrix.customFontSize(20)}
              />
            </TouchableOpacity>

            {!isLoggedUser && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleOptionsToggle}
                activeOpacity={0.7}>
                <Icons.Feather
                  name={'more-vertical'}
                  color={Colors.white}
                  size={Metrix.customFontSize(20)}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Menu Options */}
          {isVisible && !isLoggedUser && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={gstyles.marginVertical15}
                onPress={createMessage}>
                <Text allowFontScaling={false} style={styles.optionsBoxText}>
                  {t('MESSAGE')}
                </Text>
              </TouchableOpacity>
              {isAdmin && (
                <TouchableOpacity
                  style={gstyles.marginVertical5}
                  onPress={toggleBlockUser}>
                  <Text allowFontScaling={false} style={styles.optionsBoxText}>
                    {t(data?.status === 3 ? 'UNBLOCK' : 'BLOCK')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Floating Profile Image - Absolutely positioned between containers */}
        <View
          style={[
            styles.profileImageContainer,
            {top: top + greyHeight - Metrix.VerticalSize(70)},
          ]}>
          <View style={styles.profileImageWrapper}>
            <ScreenTopImage
              image={data?.profile_pic_URL}
              size={100}
              rounded={true}
            />
            <View style={styles.blueBorder} />
            {isBoosted && (
              <View style={styles.verificationBadge}>
                <Image
                  source={Images.varificationBadge}
                  style={gstyles.verificationBadge}
                />
              </View>
            )}
          </View>
        </View>

        {/* Black Container */}
        <View style={styles.blackContainer}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {/* Stats around image - Posts and Following */}
            <View style={styles.statsContainer}>
              {/* Left - Posts */}
              <View
                style={[
                  styles.leftStat,
                  {paddingRight: Metrix.HorizontalSize(60)},
                ]}>
                <Text allowFontScaling={false} style={styles.statNumber}>
                  {data?.post_count ?? '0'}
                </Text>
                <Text allowFontScaling={false} style={styles.statLabel}>
                  {t('POSTS')}
                </Text>
              </View>

              {/* Right - Following */}
              <View
                style={[
                  styles.rightStat,
                  {paddingLeft: Metrix.HorizontalSize(60)},
                ]}>
                <Text allowFontScaling={false} style={styles.statNumber}>
                  {data?.followee ?? '0'}
                </Text>
                <Text allowFontScaling={false} style={styles.statLabel}>
                  {t('FOLLOWING')}
                </Text>
              </View>
            </View>

            {/* Followers Stats Below Image */}
            <View style={styles.followersRow}>
              <View style={styles.leftStat}>
                <Text allowFontScaling={false} style={styles.statNumber}>
                  {data?.xclusive_followers ?? data?.follower ?? '0'}{' '}
                </Text>
                <Text allowFontScaling={false} style={styles.followerText}>
                  {t('XCLUSIVE_FOLLOWERS') || 'Xclusive Followers'}
                </Text>
              </View>
              <View style={styles.rightStat}>
                <Text allowFontScaling={false} style={styles.statNumber}>
                  {data?.free_follower ?? '0'}{' '}
                </Text>
                <Text allowFontScaling={false} style={styles.followerText}>
                  {t('FREE_FOLLOWERS') || 'Free Followers'}
                </Text>
              </View>
            </View>

            {/* Name */}
            <View style={styles.nameContainer}>
              <Text allowFontScaling={false} style={styles.artistName}>
                {capitalize(data?.name ?? data?.username)}
              </Text>
              {isPlanFound && (
                <MaterialCommunityIcons
                  name={isPlanFound}
                  color="yellow"
                  size={27}
                />
              )}
            </View>

            {/* Location */}
            {data?.location && (
              <View style={styles.locationContainer}>
                <Text allowFontScaling={false} style={styles.locationText} numberOfLines={1} >
                  {data?.location}
                </Text>
              </View>
            )}

            {/* Bio */}
            {data?.bio && (
              <View style={styles.bioContainer}>
                <Text allowFontScaling={false} style={styles.bioText}>
                  {data?.bio}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            {isLoggedUser ? (
              <View style={styles.artistBtnContainer}>
                <Button
                  buttonText={t('EDIT_PROFILE')}
                  onPress={() => NavigationService.navigate('EditProfile')}
                  btnStyle={styles.editProfileBtn}
                  textStyle={styles.buttonTextStyle}
                />
                <Button
                  buttonText={t('ADD_POST')}
                  onPress={() =>
                    NavigationService.navigate('StartLive', {
                      type: {id: 1, value: 'Post/ Videos'},
                    })
                  }
                  btnStyle={styles.addPostBtn}
                  textStyle={styles.buttonTextStyle}
                />
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => NavigationService.navigate('EditProfile')}>
                  <Icons.MaterialCommunityIcons
                    name={'square-edit-outline'}
                    color={Colors.white}
                    size={Metrix.customFontSize(22)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={onCompetitionBtnPress}>
                  <Icons.MaterialCommunityIcons
                    name={'view-grid'}
                    color={Colors.white}
                    size={Metrix.customFontSize(22)}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button
                  buttonText={t('FREE_FOLLOWER') || 'Free Follower'}
                  onPress={handleFreeFollowToggle}
                  btnStyle={styles.freeFollowerBtn}
                  textStyle={styles.buttonTextStyle}
                />
                <Button
                  buttonText={t('XCLUSIVE_FOLLOW') || 'Xclusive Follow'}
                  onPress={handleFollowToggle}
                  btnStyle={styles.xclusiveFollowBtn}
                  textStyle={styles.buttonTextStyle}
                />
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    NavigationService.navigate('FreeTrial', {data})
                  }>
                  <Icons.AntDesign
                    name={'play'}
                    color={Colors.white}
                    size={Metrix.customFontSize(22)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={onCompetitionBtnPress}>
                  <Icons.MaterialCommunityIcons
                    name={'view-grid'}
                    color={Colors.white}
                    size={Metrix.customFontSize(22)}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Tabs */}
            <Tabs
              onPress={(tab, index) => handleFilterSelect(tab, index)}
              tabs={isLoggedUser ? contentTabList : ['POSTS', 'VIDEO_STREAMING']}
              style={{width: '100%'}}
              selectedTab={selectedTab}
            />

            {/* Video Streaming / Posts */}
            <View style={styles.videoStreamingWrapper}>
              <VideoStreaming
                data={typeListing[selectedTab]}
                isPostsListing={true}
                selectedTab={selectedTab}
                user={data?.name ?? data?.username}
                screen={'artist'}
                canViewLiveStream={canViewLiveStream}
                isFollowed={isFollowed || isLoggedUser}
                removeHorizontalPadding={true}
              />
            </View>
          </ScrollView>
        </View>
        <PaymentConfirmModal
          isVisible={confirmPurchaseModal}
          onCancel={closeModal}
          onPurchase={onPurchase}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ArtistProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  greyBackground: {
    backgroundColor: Colors.backgroundGrayDark || '#676567',
    height: Metrix.VerticalSize(120),
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingTop: Metrix.VerticalSize(10),
    paddingBottom: Metrix.VerticalSize(10),
  },
  iconButton: {
    width: Metrix.HorizontalSize(40),
    height: Metrix.HorizontalSize(40),
    borderRadius: Metrix.HorizontalSize(20),
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: Colors.optionsBox,
    width: Metrix.HorizontalSize(150),
    paddingHorizontal: Metrix.HorizontalSize(10),
    borderRadius: 6,
    position: 'absolute',
    right: 10,
    zIndex: 100,
    top: Metrix.VerticalSize(60),
  },
  optionsBoxText: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  profileImageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  profileImageWrapper: {
    position: 'relative',
    width: Metrix.HorizontalSize(100),
    // backgroundColor:'red',
    height: Metrix.HorizontalSize(100),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(10),
    marginTop: Metrix.VerticalSize(-5),
    marginBottom: Metrix.VerticalSize(10),
    // backgroundColor:'pink'
  },
  blueBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: Metrix.HorizontalSize(53),
    borderWidth: 3,
    borderColor: Colors.blue,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 2,
    right: 5,
  },
  leftStat: {
    flex: 0.4,
    alignItems: 'center',
  },
  rightStat: {
    flex: 0.4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Metrix.customFontSize(20),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  statLabel: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    marginTop: Metrix.VerticalSize(5),
  },
  blackContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Metrix.HorizontalSize(30),
    borderTopRightRadius: Metrix.HorizontalSize(30),
    marginTop: -Metrix.VerticalSize(30),
    paddingTop: Metrix.VerticalSize(25),
    paddingHorizontal: Metrix.HorizontalSize(10),
  },
  followersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(5),
    marginBottom: Metrix.VerticalSize(15),
  },
  followerText: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrix.VerticalSize(10),
  },
  artistName: {
    fontSize: Metrix.customFontSize(24),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: Metrix.HorizontalSize(8),
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(10),
  },
  locationText: {
    textAlign: 'center',
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
  },
  bioContainer: {
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(20),
  },
  bioText: {
    fontSize: Metrix.customFontSize(13),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    textAlign: 'center',
  },
  artistBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Metrix.VerticalSize(18),
    gap: Metrix.HorizontalSize(8),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Metrix.VerticalSize(18),
    gap: Metrix.HorizontalSize(8),
  },
  editProfileBtn: {
    backgroundColor: Colors.blue,
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(4),
    borderRadius: 8,
    flex: 1,
    minHeight: Metrix.VerticalSize(50),
    maxHeight: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
  },
  addPostBtn: {
    backgroundColor: Colors.red,
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(4),
    borderRadius: 8,
    flex: 1,
    minHeight: Metrix.VerticalSize(50),
    maxHeight: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
  },
  freeFollowerBtn: {
    backgroundColor: Colors.blue,
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(4),
    borderRadius: 8,
    flex: 1,
    minHeight: Metrix.VerticalSize(50),
    maxHeight: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
  },
  xclusiveFollowBtn: {
    backgroundColor: Colors.red,
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(4),
    borderRadius: 8,
    flex: 1,
    minHeight: Metrix.VerticalSize(50),
    maxHeight: Metrix.VerticalSize(50),
    height: Metrix.VerticalSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
  },
  iconBtn: {
    backgroundColor: Colors.blue,
    width: Metrix.HorizontalSize(50),
    height: Metrix.VerticalSize(50),
    minWidth: Metrix.HorizontalSize(50),
    maxWidth: Metrix.HorizontalSize(50),
    minHeight: Metrix.VerticalSize(50),
    maxHeight: Metrix.VerticalSize(50),
    borderRadius: Metrix.HorizontalSize(25),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  videoStreamingWrapper: {
    marginHorizontal: -Metrix.HorizontalSize(20),
  },
  buttonTextStyle: {
    fontSize: Metrix.customFontSize(11),
    textAlign: 'center',
    flexShrink: 1,
  },
});
