import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {Header, WebViewComponent} from '../../Components';
import {Colors, Icons, Images, Metrix} from '../../Config';
import {capitalize, fonts, formattedDate} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import DeleteModal from '../../Components/DeleteModal';
import PostComments from '../../Components/Community/PostComments';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height: screenHeight} = Dimensions.get('window');

const RenderItem = ({item, imageWidth, imageHeight}) => {
  const isVideo = item.includes('.mp4');

  return (
    <View style={styles.renderItemContainer}>
      <View style={[styles.imageContainer]}>
        {isVideo ? (
          <WebViewComponent url={item} />
        ) : (
          <ImageZoom
            uri={item}
            isDoubleTapEnabled
            style={[styles.image]}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const PostsListing = ({route}) => {
  const {item} = route.params || {};
  const {user} = route.params || {};
  const screen = route?.params?.screen || {};
  const userId = useSelector(state => state?.AuthReducer?.user?.id);
  const currentUser = useSelector(state => state?.AuthReducer?.user);
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();
  const isFocused = useIsFocused();

  const [deleteModal, setDeleteModal] = useState(false);
  const [pause, setPause] = useState(false);
  const [likeCount, setLikeCount] = useState(
    item?.post?.length ?? item?.likes?.length ?? 0,
  );
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(
    item?.comunity_comments || item?.comments || [],
  );
  const [text, setText] = useState('');
  const [postData, setPostData] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const imageWidth = width * 0.9;
  const imageHeight = screenHeight * 0.5;

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 300);
  };

  const getPostById = () => {
    if (!item?.id) return;
    dispatch(
      AuthMiddleware.GetArtistPostById({
        id: item.id,
        cb: result => {
          if (result) {
            console.log('===result===>', JSON.stringify(result, null, 1));
            setPostData(result);
            setLikeCount(result?.comunity_likes?.length ?? 0);
            setComments(result?.comunity_comments || result?.comments || []);
          }
        },
      }),
    );
  };

  useEffect(() => {
    getPostById();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setPause(false);
      getPostById();
    }
  }, [isFocused]);

  useEffect(() => {
    if (postData) {
      const liked = postData?.comunity_likes?.find(
        p => p?.user_id === currentUser?.id,
      );
      setIsLiked(!!liked);
    }
  }, [postData, currentUser?.id]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
      scrollToBottom();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const deletePost = () => {
    dispatch(ArtistMiddleware.DeletePost({id: item?.id}));
    setDeleteModal(false);
  };

  const handleDeletePost = () => {
    setDeleteModal(true);
  };

  const closeModal = () => {
    setDeleteModal(false);
  };

  const likePost = () => {
    if (!item?.id) return;
    // console.log('===LIKE POST API CALL===>', JSON.stringify(item, null, 1));
    if (isLiked) {
      dispatch(
        AuthMiddleware.UnLikeArtistPost({
          body: {id: item.id},
          cb: result => {
            setIsLiked(p => !p);
            setLikeCount(p => p - 1);
            getPostById();
          },
        }),
      );
    } else {
      dispatch(
        AuthMiddleware.LikeArtistPost({
          body: {id: item.id},
          cb: result => {
            setIsLiked(p => !p);
            setLikeCount(p => p + 1);
            getPostById();
          },
        }),
      );
    }
  };

  const commentPost = () => {
    if (!item?.id || !text.trim()) return;
    dispatch(
      AuthMiddleware.CommentArtistPost({
        body: {id: item.id, text: text.trim()},
        cb: result => {
          getPostById();
          setText('');
          Keyboard.dismiss();
        },
      }),
    );
  };

  const editComment = comment => {
    dispatch(
      AuthMiddleware.EditCommentArtistPost({
        body: {text: comment.text, commentId: comment.commentId || comment.id},
        cb: result => {
          getPostById();
          Keyboard.dismiss();
        },
      }),
    );
  };

  const deleteComment = comment => {
    dispatch(
      AuthMiddleware.DeleteCommentCommunityPost({
        body: {commentId: comment.commentId || comment.id},
        cb: result => {
          getPostById();
          Keyboard.dismiss();
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

  return (
    <KeyboardAvoidingView
      style={[gstyles.container, styles.container, {paddingTop: top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <Header back={true} isIcon={false} title={t('POSTS')} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {paddingBottom: keyboardHeight + Metrix.VerticalSize(40)},
        ]}
        keyboardShouldPersistTaps="handled">
        {screen === 'explore' ? (
          <View>
            <RenderItem
              item={
                item?.intro_video ? item?.intro_video : item?.profile_pic_URL
              }
              imageWidth={imageWidth}
              // imageHeight={imageHeight}
            />
          </View>
        ) : item?.url?.length === 1 ? (
          <RenderItem
            item={item?.url[0]}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        ) : (
          <View style={styles.cardContainer}>
            <Carousel
              width={width}
              height={400}
              data={item?.url}
              renderItem={({item}) => (
                <RenderItem
                  item={item}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                />
              )}
              scrollAnimationDuration={1000}
            />
          </View>
        )}

        <View style={styles.postDetailContainer}>
          {/* Like Button */}
          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={likePost} style={styles.likeButton}>
              <Image
                source={isLiked ? Images.liked : Images.like}
                style={styles.likeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.likeCount}>
              {likeCount < 0 ? 0 : likeCount}
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.postTitle}>
            {capitalize(item?.text?.trim())}
          </Text>
          <View style={styles.postTitleContainer}>
            <View>
              <Text allowFontScaling={false} style={styles.postTitleMessage}>
                {capitalize(user ? user : item?.name ?? item?.username)}
                <Text allowFontScaling={false} style={styles.date}>
                  {' '}
                  {formattedDate(item?.createdAt)}
                </Text>
              </Text>
            </View>
            <View>
              {item?.user_id === userId && (
                <TouchableOpacity onPress={handleDeletePost}>
                  <Icons.AntDesign
                    name={'delete'}
                    size={Metrix.customFontSize(28)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <PostComments
          comments={comments}
          onSendComment={commentPost}
          text={text}
          setText={setText}
          deleteComment={deleteComment}
          editComment={editComment}
          replyComment={replyComment}
          onReplyPress={scrollToBottom}
        />
      </ScrollView>
      <DeleteModal
        isVisible={deleteModal}
        closeModal={closeModal}
        onDelete={deletePost}
        heading="Delete Post"
        detail="Are you sure you want to delete this post?"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {},
  renderItemContainer: {
    marginTop: 40,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(40),
    flexDirection: 'row',
  },
  imageContainer: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  postDetailContainer: {
    marginVertical: Metrix.VerticalSize(18),
    paddingHorizontal: Metrix.HorizontalSize(6),
  },
  postTitle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  postTitleContainer: {
    marginVertical: Metrix.VerticalSize(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitleMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.blue,
  },
  date: {
    fontFamily: fonts.MontserratMedium,
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(6),
  },
  likeButton: {
    padding: Metrix.HorizontalSize(5),
  },
  likeIcon: {
    width: 50,
    height: 50,
  },
  likeCount: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
    fontWeight: 'bold',
  },
});

export default memo(PostsListing);
