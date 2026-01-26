/* eslint-disable react/jsx-no-undef */
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  ArtistSocialStats,
  Button,
  Header,
  ScreenTopImage,
  Tabs,
  VideoStreaming,
} from '../../Components';
import PaymentConfirmModal from '../../Components/PaymentConfirmModal';
import {useIAP} from '../../Components/Providers/IAP.Provider';
import {
  AppData,
  Colors,
  Icons,
  Images,
  Metrix,
  NavigationService,
} from '../../Config';
import {capitalize, fonts, openStripeModal} from '../../Config/Helper';
import {ArtistMiddleware, ChatMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';

const {contentTabList} = AppData;

const ArtistProfile = ({route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const user = useSelector(state => state?.AuthReducer?.user);
  const id = route?.params?.id ?? user?.id;

  const refetchListings = useSelector(
    state => state?.GeneralReducer?.refetchListings,
  );

  const isAdmin = user?.email_address === 'admin@showliv.com';

  const [selectedTab, setSelectedTab] = useState(0);
  const [tabName, setTabName] = useState('POSTS');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const [post, setPost] = useState(null);
  const [liveStreams, setliveStreams] = useState(null);
  const [isLoggedUser, setIsLoggedUser] = useState(false);
  const [isPlanFound, setIsPlanFound] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [confirmPurchaseModal, setConfirmPurchase] = useState(false);

  const {
    plans: {artistFollow},
    handlePurchase,
  } = useIAP();

  const closeModal = () => setConfirmPurchase(false);

  const onPurchase = async () => {
    // openStripeModal(paymentInfo?.data, paymentInfo?.id);
    const data = {artist_id: id};
    await handlePurchase(artistFollow.id, null, data);
    closeModal();
  };

  useFocusEffect(
    useCallback(() => {
      getProfileById();
      getActivePlan();
    }, [id]),
  );

  const getActivePlan = () => {
    const cb = arg => {
      if (arg.length) {
        const isGold = arg[0]?.plan_id === 6 ? 'star' : 'crown';
        setIsPlanFound(isGold);
      }
    };
    dispatch(ArtistMiddleware.GetActivePlan({cb, id}));
  };

  const checkFollowing = userid => {
    const cb = res => {
      if (res) {
        setIsFollowed(res);
      }
    };
    dispatch(ArtistMiddleware.CheckFollowing({id: userid, cb}));
  };

  const typeListing = {
    0: post,
    // 1: post,
    1: liveStreams,
  };

  const getProfileById = () => {
    const cb = res => {
      setData(res);
      if (res?.id !== user?.id) {
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
      console.log('===data===>', JSON.stringify(data, null, 1));
      setliveStreams(data);
      setSelectedTab(ind);
    };
    dispatch(ArtistMiddleware.GetMyStream(cb));
  };

  const getArtistStreams = (ind, artistId) => {
    const cb = data => {
      console.log('===data===>', JSON.stringify(data, null, 1));
      setliveStreams(data);
      setSelectedTab(ind);
    };
    dispatch(ArtistMiddleware.GetArtistStream({id: artistId, cb}));
  };

  const handleFilterSelect = (tab, index) => {
    setTabName(tab);
    if (tab === 'POSTS') {
      if (data?.id !== user?.id) {
        setSelectedTab(index);
        return getArtistPosts();
      } else {
        // setIsLoggedUser(true)
        // console.warn('khud ki post ki post');
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

    if (tab === '10_SEC_TRIAL') {
      NavigationService.navigate('FreeTrial', {data, isFollowed});
      setSelectedTab(0);
      return;
    }
  };

  // refetching the streams
  useEffect(() => {
    console.log('REFETCHING LIST', refetchListings);
    handleFilterSelect(tabName, selectedTab);
  }, [refetchListings]);

  const handleFollowToggle = () => {
    const payload = {artist_id: id};

    const cb = data => {
      if (data?.follow) {
        console.warn('here');
        setIsFollowed(data?.success);
        return getProfileById();
      }
      console.log('===FOLLOW DATA===>', JSON.stringify(data, null, 1));
      if (data?.client_secret) {
        setPaymentInfo({data: data, id});
        setConfirmPurchase(true);
        return;
      }
    };

    dispatch(ArtistMiddleware.FollowArtist(payload, cb));
  };

  const handleOptionsToggle = () => {
    setIsVisible(!isVisible);
  };

  const createMessage = () => {
    const payload = {artist_id: id};
    const cb = () => setIsVisible(false);
    dispatch(
      ChatMiddleware.CreateConversation({payload, participantData: data, cb}),
    );
  };
  const goBackFunc = () => {
    setSelectedTab(0);
    NavigationService.goBack();
  };

  const onCompetitionBtnPress = () => {
    NavigationService.navigate('SelectArtistsForCompetition', {data});
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

  const isBoosted = moment().isBefore(data?.artist_expiry);

  const canViewLiveStream = isLoggedUser || isFollowed;

  return (
    <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
      <View style={gstyles.container}>
        <Header
          back={true}
          isIcon={false}
          isProfile={true}
          goBackFunc={goBackFunc}
          handleOptionsToggle={handleOptionsToggle}
          isLoggedUser={isLoggedUser}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {isVisible && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={gstyles.marginVertical15}
                onPress={createMessage}>
                <Text allowFontScaling={false} style={styles.optionsBoxTex}>{t('MESSAGE')}</Text>
              </TouchableOpacity>
              {isAdmin && (
                <TouchableOpacity
                  style={gstyles.marginVertical5}
                  onPress={toggleBlockUser}>
                  <Text allowFontScaling={false} style={styles.optionsBoxTex}>
                    {t(data?.status === 3 ? 'UNBLOCK' : 'BLOCK')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={[gstyles.justifyAlignCenter, gstyles.marginBottom20]}>
              <ScreenTopImage
                image={data?.profile_pic_URL}
                size={100}
                rounded={true}
              />
              {isBoosted && (
                <View style={styles.floatBoosted}>
                  {/* <MaterialIcons name="verified" color={Colors.blue} size={30} /> */}
                  <Image
                    source={Images.varificationBadge}
                    style={gstyles.verificationBadge}
                  />
                </View>
              )}
            </View>
            <View style={gstyles.centeredAlignedRow}>
              <Text allowFontScaling={false} style={gstyles.artistName}>
                {capitalize(data?.name ?? data?.username)}{' '}
              </Text>
              {
                isPlanFound ? (
                  // <Image
                  //   source={Images.varificationBadge}
                  //   style={gstyles.verificationBadge}
                  // />
                  <MaterialCommunityIcons
                    name={isPlanFound}
                    color="yellow"
                    size={27}
                  />
                ) : null
                // <Icons.MaterialIcons name={'verified'} color={Colors.blue} size={Metrix.customFontSize(22)} style={gstyles.marginLeft10} />
              }
              {}
            </View>
            {data?.location && (
              <View style={gstyles.marginVertical15}>
                <Text allowFontScaling={false} style={gstyles.artistDescription}>{data?.location}</Text>
              </View>
            )}
            {data?.bio && (
              <View style={gstyles.artistDescriptionContainer}>
                <Text allowFontScaling={false} style={gstyles.artistDescription}>{data?.bio}</Text>
              </View>
            )}
            <ArtistSocialStats
              post={data?.post_count}
              Follwers={data?.follower}
              Following={data?.followee}
              data={data}
            />
            {isLoggedUser ? (
              <View style={styles.artistBtnContainer}>
                <Button
                  buttonText={t('EDIT_PROFILE')}
                  onPress={() => NavigationService.navigate('EditProfile')}
                  btnStyle={gstyles.editBtnStyle}
                />
                <Button
                  buttonText={t('ADD_POST')}
                  onPress={() =>
                    NavigationService.navigate('StartLive', {
                      type: {id: 1, value: 'Post/ Videos'},
                    })
                  }
                  btnStyle={gstyles.editBtnStyle}
                />
                <Button
                  btnStyle={styles.competitionBtn}
                  preIcon={
                    <Icons.MaterialCommunityIcons
                      name={'gamepad-circle'}
                      color={Colors.white}
                      size={Metrix.customFontSize(22)}
                    />
                  }
                  onPress={onCompetitionBtnPress}
                />
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button
                  buttonText={isFollowed ? 'FOLLOWING' : 'FOLLOW'}
                  onPress={handleFollowToggle}
                  btnStyle={
                    !isFollowed
                      ? gstyles.followBtnStyle
                      : gstyles.followingBtnStyle
                  }
                  disabled={isFollowed}
                />
                {/* <Button
                      disabled={true}
                      // onPress={() => NavigationService.navigate('UnlockAccess')}
                      btnStyle={styles.iconContainer}
                      preIcon={<Icons.EvilIcons name={'lock'} color={Colors.white} size={Metrix.customFontSize(34)} />}
                    /> */}
                <Button
                  onPress={() =>
                    NavigationService.navigate('FreeTrial', {data})
                  }
                  btnStyle={styles.iconContainer}
                  preIcon={
                    <Icons.AntDesign
                      name={'play'}
                      color={Colors.white}
                      size={Metrix.customFontSize(22)}
                    />
                  }
                />
                {user?.user_role == '1' && (
                  <Button
                    onPress={onCompetitionBtnPress}
                    btnStyle={styles.iconContainer}
                    preIcon={
                      <Icons.MaterialCommunityIcons
                        name={'gamepad-circle'}
                        color={Colors.white}
                        size={Metrix.customFontSize(22)}
                      />
                    }
                  />
                )}
              </View>
            )}

            <Tabs
              onPress={(tab, index) => handleFilterSelect(tab, index)}
              tabs={contentTabList}
              style={{width: '100%'}}
              selectedTab={selectedTab}
            />

            {/* need to change the name of this component */}
          </View>
          {/* {isLoggedUser || isFollowed ? ( */}
          <VideoStreaming
            // data={isFollowed || isLoggedUser ? typeListing[selectedTab] : []}
            data={typeListing[selectedTab]}
            isPostsListing={true}
            selectedTab={selectedTab}
            user={data?.name ?? data?.username}
            screen={'artist'}
            canViewLiveStream={canViewLiveStream}
            isFollowed={isFollowed || isLoggedUser}
          />
        </ScrollView>
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
  container: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  iconContainer: {
    backgroundColor: Colors.blue,
    width: '12%',
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(8),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
    marginLeft: Metrix.HorizontalSize(4),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionsBoxTex: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  optionsContainer: {
    backgroundColor: Colors.optionsBox,
    width: Metrix.HorizontalSize(150),
    paddingHorizontal: Metrix.HorizontalSize(10),
    // paddingVertical: Metrix.VerticalSize(6),
    borderRadius: 6,
    position: 'absolute',
    right: 10,
    zIndex: 100,
    top: 4,
  },
  lockedProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrix.VerticalSize(280),
  },
  artistBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  competitionBtn: {
    backgroundColor: Colors.blue,
    width: '12%',
    paddingVertical: Metrix.VerticalSize(6),
    paddingHorizontal: Metrix.HorizontalSize(8),
    borderRadius: 6,
    marginBottom: Metrix.VerticalSize(18),
  },
  floatBoosted: {
    position: 'absolute',
    bottom: 2,
    right: 5,
  },
});
