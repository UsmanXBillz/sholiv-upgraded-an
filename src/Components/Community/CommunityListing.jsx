/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
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
import {normalize} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, Images, Metrix} from '../../Config';
import {
  fonts,
  formatRelativeTime,
  getFileTypeFromUrl,
} from '../../Config/Helper';
import {GeneralAction} from '../../Redux/Actions';
import {AuthMiddleware} from '../../Redux/Middlewares';
import VideoContainer from '../VideoContainer';

const CommunityListing = props => {
  const {posts = []} = props;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const navigateToCommunityById = id =>
    navigation.navigate('CommPostById', {id});

  const redirectToArtistProfile = id =>
    navigation.navigate('ArtistProfile', {id});
  const currentUser = useSelector(store => store?.AuthReducer.user);

  const likePostById = id => {
    dispatch(
      AuthMiddleware.LikeCommunityPost({
        body: {id},
        cb: result => {
          dispatch(GeneralAction.RefetchCommPostAction());
        },
      }),
    );
  };

  const renderCommunityItem = ({item}) => {
    return (
      <CommunityItem
        {...item}
        onPress={() => navigateToCommunityById(item?.id)}
        redirectToArtistProfile={redirectToArtistProfile}
        likePost={() => likePostById(item.id)}
        currentUserId={currentUser.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item?.id}
        renderItem={renderCommunityItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 10, paddingVertical: 20, paddingBottom: 230}}
        ListEmptyComponent={() => (
          <View style={styles.noListContainer}>
            <Text allowFontScaling={false} style={styles.notFoundText}>{t('NO_COMMUNITY_POST')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const VideoPlayer = ({url}) => {
  return (
    <View style={[styles.videoContainerStyle]}>
      <VideoContainer
        video={url}
        controls={true}
        liveRec={true}
        initialMuted={false}
        style={{borderWidth: 0}}
      />
    </View>
  );
};

const CommunityItem = props => {
  const {
    id,
    text,
    title,
    url,
    user,
    updatedAt,
    redirectToArtistProfile,
    likePost,
    createdAt,
    bundle_expiry,
    post,
    currentUserId,
    onPress,
  } = props;

  const isBoosted = bundle_expiry ? moment().isBefore(bundle_expiry) : false;
  const isArtistBoosted = moment().isBefore(post?.user?.artist_expiry);
  const {t} = useTranslation();

  const [likeCount, setLikeCount] = useState(post?.length ?? 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const liked = post?.find(p => p?.user_id === currentUserId);
    setIsLiked(!!liked);
  }, []);

  return (
    <View
      style={[styles.communityContainer, isBoosted && styles.boostedContainer]}
      key={id}>
      {isBoosted && (
        <View style={styles.boostedTag}>
          <Text allowFontScaling={false} style={styles.boostedText}>{t('BOOSTED')}</Text>
        </View>
      )}

      <View style={styles.itemImageContainer}>
        {getFileTypeFromUrl(url[0]) === 'video' ? (
          <VideoPlayer url={url[0]} />
        ) : (
          <Image
            source={{uri: url[0]}}
            style={styles.itemImage}
            resizeMode="cover"
          />
        )}
      </View>
      <TouchableOpacity style={styles.itemInfoContainer} onPress={onPress}>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            style={styles.userImageContainer}
            onPress={() => redirectToArtistProfile(user?.id)}>
            <Image
              source={
                user?.profile_pic_URL
                  ? {uri: user?.profile_pic_URL}
                  : Images.zoe
              }
              style={styles.userImage}
            />
          </TouchableOpacity>
          <View style={styles.communityInfoContainer}>
            <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
              <Text allowFontScaling={false}
                style={styles.userNameText}
                onPress={() => redirectToArtistProfile(user?.id)}>
                {user?.name}
              </Text>
              {isArtistBoosted && (
                <View style={styles.floatBoosted}>
                  <Image
                    source={Images.varificationBadge}
                    style={{
                      height: Metrix.VerticalSize(23),
                      width: Metrix.VerticalSize(23),
                      // marginLeft: Metrix.HorizontalSize(10),
                    }}
                  />
                </View>
              )}
            </View>
            <Text allowFontScaling={false} style={styles.communityDescText}>
              {formatRelativeTime(createdAt)}
            </Text>
          </View>
          <View style={styles.likeContainer}>
            <Text allowFontScaling={false} style={{color: 'white', fontSize: Metrix.customFontSize(13)}}>
              {likeCount < 0 ? 0 : likeCount}
            </Text>
            <FontAwesome
              // name="thumbs-o-up"
              name={isLiked ? 'thumbs-up' : 'thumbs-o-up'}
              color={Colors.blue}
              size={30}
              onPress={() => {
                setIsLiked(p => !p);
                setLikeCount(p => (isLiked ? p - 1 : p + 1));
                likePost();
              }}
            />
          </View>
        </View>
        <View style={styles.postTextContainer}>
          {title && <Text allowFontScaling={false} style={styles.postCreatedTitle}>{title}</Text>}
          <Text allowFontScaling={false} style={styles.postCreatedText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityListing;

const styles = StyleSheet.create({
  container: {},
  boostedTag: {
    position: 'absolute',
    width: 75,
    height: 20,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    borderRadius: 12,
    margin: 5,
    // transform: [{rotateX:'60'}],
  },
  boostedText: {
    color: 'white',
    fontSize: normalize(10),
    fontWeight: 'bold',
  },
  boostedContainer: {
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  likeContainer: {
    right: 5,
    top: 10,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  communityContainer: {
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: '#16181B',
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    width: Metrix.HorizontalSize(350),
    elevation: 3,
  },
  notFoundText: {
    color: Colors.white,
    fontFamily: fonts.RobotoMedium,
    fontSize: Metrix.customFontSize(16),
    textAlign: 'center',
  },
  noListContainer: {
    height: Metrix.VerticalSize(200),
    justifyContent: 'center',
  },
  itemImageContainer: {
    height: Metrix.VerticalSize(230),
    width: Metrix.HorizontalSize(350),
    overflow: 'hidden',
  },
  itemImage: {
    height: '100%',
    width: '100%',
  },
  itemInfoContainer: {
    flex: 1,
  },
  userNameText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(18),
    fontWeight: '700',
  },
  postCreatedText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(13),
  },
  postCreatedTitle: {
    color: Colors.white,
    fontFamily: fonts.LatoBold,
    fontSize: Metrix.customFontSize(16),
  },
  communityDescText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.lightGray,
    fontSize: Metrix.customFontSize(11),
  },
  communityFolloweText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.lightGray,
    fontSize: Metrix.customFontSize(13),
  },
  communityInfoContainer: {},
  userInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(10),
  },
  userImageContainer: {
    height: 70,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
    bottom: 20,
  },
  userImage: {
    height: '100%',
    width: '100%',
  },
  postTextContainer: {
    // minHeight: Metrix.VerticalSize(100),
    // backgroundColor: 'red',

    padding: 10,
  },
  videoContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // height: Metrix.VerticalSize(300),
  },
});
