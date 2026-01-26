/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';
import gstyles from '../../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header, VideoContainer} from '../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {
  fonts,
  formatRelativeTime,
  getFileTypeFromUrl,
} from '../../Config/Helper';
import {Image} from 'react-native';
import PostComments from '../../Components/Community/PostComments';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {GeneralAction} from '../../Redux/Actions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const VideoPlayer = ({url}) => {
  return (
    <View style={[styles.videoContainerStyle]}>
      <VideoContainer
        video={
          url ??
          'https://ssrweb.zoom.us/replay03/2025/02/19/07775281-69F7-4AB3-88C0-AA287329FD52/GMT20250219-082455_Recording_1280x720.mp4?response-content-disposition=attachment&response-content-type=application%2Foctet-stream&response-cache-control=max-age%3D0%2Cs-maxage%3D86400&fid=eHsQXulBNq-bJt4FfPB-AZsB9YHU65XIFfJgcyGxBCBcnYW7KvJJdXxeH6UHWGpSoOVwU6u_bJ_IFYwd.tGj1J0sir5iwTZYe&tid=v=2.0;clid=us06;rid=WEB_34177e9b2b6cb8eca6fbb025f829ff7a&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vc3Nyd2ViLnpvb20udXMvcmVwbGF5MDMvMjAyNS8wMi8xOS8wNzc3NTI4MS02OUY3LTRBQjMtODhDMC1BQTI4NzMyOUZENTIvR01UMjAyNTAyMTktMDgyNDU1X1JlY29yZGluZ18xMjgweDcyMC5tcDQ~cmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1hdHRhY2htZW50JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1hcHBsaWNhdGlvbiUyRm9jdGV0LXN0cmVhbSZyZXNwb25zZS1jYWNoZS1jb250cm9sPW1heC1hZ2UlM0QwJTJDcy1tYXhhZ2UlM0Q4NjQwMCZmaWQ9ZUhzUVh1bEJOcS1iSnQ0RmZQQi1BWnNCOVlIVTY1WElGZkpnY3lHeEJDQmNuWVc3S3ZKSmRYeGVINlVIV0dwU29PVndVNnVfYkpfSUZZd2QudEdqMUowc2lyNWl3VFpZZSZ0aWQ9dj0yLjA7Y2xpZD11czA2O3JpZD1XRUJfMzQxNzdlOWIyYjZjYjhlY2E2ZmJiMDI1ZjgyOWZmN2EiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3NDAwNzMxMzB9fX1dfQ__&Signature=Q97wtJEo~my4BLx1tz6vFJNRl6Jmvuk0SsBDjkMZw8cQtRNG9ptyhGHvbduWgOPA1JM2Lj-VKRO~He6AcaPVWcDdBA8v9h-J-LEcZnBf5IpfX0SBNoCxcINAtQ2fSufjcUIyPO-C6XuRcnANLbUl~N5ChQ~nAb0SIcqcj9liTHG3Txz~m5haoyfeslB87JI-GTKjM2UsJhqcxIH~Fp6rI3ne2qaTIa1lLNExC-rCTqp6X6fXu1zsE5ijhSQghncnvz~JjdFgsAhAD94XkW1axF1yIyRLJETDLrJOI~21-UXLb7CRe3NqqM9X2fjLlyoZ~1xemRpZUN3~X~82e4X5Bw__&Key-Pair-Id=APKAJFHNSLHYCGFYQGIA'
        }
        controls={true}
        liveRec={true}
        initialMuted={false}
      />
    </View>
  );
};

const CommPostById = props => {
  const {route} = props;
  const name = route.params?.name || 'Post';
  const postId = route.params?.id;
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  let likes = 0;

  const [likeCount, setLikeCount] = useState(likes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [post, setPost] = useState(null);
  const [boostedUserProfile, setBoostedProfile] = useState(false);
  const [errorPost, setErrorPost] = useState(null);
  const [comments, setComments] = useState([]);

  const currentUser = useSelector(store => store?.AuthReducer.user);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 300);
  };

  useEffect(() => {
    const liked = post?.post.find(p => p?.user_id === currentUser.id);
    setIsLiked(!!liked);
  }, [likeCount]);

  const [text, setText] = useState('');

  const getPostById = () => {
    dispatch(
      AuthMiddleware.GetCommunityPostById({
        id: postId,
        cb: result => {
          if (Array.isArray(result.post.rows) && result.post.rows.length > 0) {
            const postData = result.post.rows[0];
            if (postData) {
              console.log("===postData?.comunity_comments===>", JSON.stringify(postData?.comunity_comments, null, 1));
              setPost(postData);
              setLikeCount(postData?.post?.length ?? 0);
              setComments(postData?.comunity_comments);
            } else {
              setErrorPost(t('EMPTY_LISTING'));
            }
          } else {
            setErrorPost(t('WRONG_WITH_SERVER'));
          }
        },
      }),
    );
  };

  const likePostById = () => {
    dispatch(
      AuthMiddleware.LikeCommunityPost({
        body: {id: postId},
        cb: result => {
          setIsLiked(p => !p);
          // setLikeCount(p => (isLiked ? p - 1 : p + 1));
          dispatch(GeneralAction.RefetchCommPostAction());
        },
      }),
    );
  };

  const commentPostById = () => {
    dispatch(
      AuthMiddleware.CommentCommunityPost({
        body: {id: postId, text},
        cb: result => {
          // setComments(p => [result?.comunity_comment, ...p]);
          getPostById();
          setText('');
          Keyboard.dismiss();
          // dispatch(GeneralAction.RefetchCommPostAction());
        },
      }),
    );
  };

  const editComment = comment => {
    dispatch(
      AuthMiddleware.EditCommentCommunityPost({
        body: {text: comment.text, commentId: comment.commentId},
        cb: result => {
          // setComments(p => [result?.comunity_comment, ...p]);
          getPostById();
          Keyboard.dismiss();
          // dispatch(GeneralAction.RefetchCommPostAction());
        },
      }),
    );
  };

  const deleteComment = comment => {
    dispatch(
      AuthMiddleware.DeleteCommentCommunityPost({
        body: {commentId: comment.commentId},
        cb: result => {
          // setComments(p => [result?.comunity_comment, ...p]);
          getPostById();
          Keyboard.dismiss();
          // dispatch(GeneralAction.RefetchCommPostAction());
        },
      }),
    );
  };

  const replyComment = reply => {
    dispatch(
      AuthMiddleware.CommunityCommentReply({
        body: {commentId: reply.commentId, text: reply.text},
        cb: result => {
          getPostById();
          Keyboard.dismiss();
        },
      }),
    );
  };

  useEffect(() => {
    getPostById();
  }, []);

  const redirectToProfile = id => {
    NavigationService.navigate('ArtistProfile', {id});
    // console.log('===id===>', JSON.stringify(id, null, 1));
  };

  useEffect(() => {
    const isBoosted = moment().isBefore(post?.user?.artist_expiry);
    setBoostedProfile(isBoosted);
  }, [post]);

  return (
    <KeyboardAvoidingView
      style={[gstyles.container, styles.container, {paddingTop: top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <Header back={true} title={name} icon={false} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.subContainer}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
          <>
            <View style={styles.userInfoContainer}>
              <TouchableOpacity
                onPress={() => redirectToProfile(post.user.id)}
                style={styles.userImageContainer}>
                <Image
                  source={{uri: post?.user?.profile_pic_URL}}
                  style={styles.userImage}
                />
              </TouchableOpacity>
              <View style={styles.communityInfoContainer}>
                <View
                  style={{flexDirection: 'row', gap: 2, alignItems: 'center'}}>
                  <Text allowFontScaling={false}
                    style={styles.userNameText}
                    onPress={() => redirectToProfile(post.user.id)}>
                    {post?.user?.name}
                  </Text>
                  {boostedUserProfile && (
                    <View style={styles.floatBoosted}>
                      <Image
                        source={Images.varificationBadge}
                        style={gstyles.verificationBadge}
                      />
                    </View>
                  )}
                </View>
                <Text allowFontScaling={false} style={styles.communityDescText}>
                  {formatRelativeTime(post?.createdAt)}
                </Text>
              </View>
            </View>
            <FlatList
              data={post?.url}
              keyExtractor={i => i}
              renderItem={({item}) => {
                const fileType = getFileTypeFromUrl(item);
                const isVideo = fileType === 'video';

                return (
                  <View style={styles.itemImageContainer}>
                    {isVideo ? (
                      <VideoPlayer url={item} />
                    ) : (
                      <Image
                        source={{uri: item}}
                        style={styles.itemImage}
                        // resizeMode="stretch"
                      />
                    )}
                  </View>
                );
              }}
              horizontal
              style={styles.itemImageContainer}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            />
            <View style={styles.postDescContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 5,
                }}>
                <FontAwesome
                  // name="thumbs-o-up"
                  name={isLiked ? 'thumbs-up' : 'thumbs-o-up'}
                  color={Colors.blue}
                  size={30}
                  onPress={likePostById}
                />
                <Text allowFontScaling={false} style={styles.likeCount}>
                  {likeCount < 0 ? 0 : likeCount}
                </Text>
              </View>
              <Text allowFontScaling={false} style={styles.titleStyle} numberOfLines={2}>
                {post?.title ?? ''}
              </Text>
              <Text allowFontScaling={false} style={styles.descStyle}>{post?.text}</Text>
            </View>
            <PostComments
              comments={comments}
              onSendComment={commentPostById}
              text={text}
              setText={setText}
              deleteComment={deleteComment}
              editComment={editComment}
              replyComment={replyComment}
              onReplyPress={scrollToBottom}
            />
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommPostById;

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    gap: 15,
    paddingBottom: 500,
  },
  postDescContainer: {gap: 5},
  titleStyle: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(17),
    fontWeight: 'bold',
  },
  likeCount: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
    fontWeight: 'bold',
  },
  descStyle: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(13),
  },
  errorMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
  },
  itemImageContainer: {
    height: Metrix.VerticalSize(200),
    width: Metrix.HorizontalSize(350),
    overflow: 'hidden',
    borderRadius: 12,
  },
  itemImage: {
    height: '100%',
    width: '100%',
  },
  videoContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrix.VerticalSize(300),
  },
  userImageContainer: {
    height: 70,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  userImage: {
    height: '100%',
    width: '100%',
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(10),
  },
  communityDescText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.lightGray,
    fontSize: Metrix.customFontSize(11),
  },
  floatBoosted: {
    // position: 'absolute',
    // bottom: 2,
    // right: 5,
  },
});
