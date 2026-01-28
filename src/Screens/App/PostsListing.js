import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {Header, WebViewComponent} from '../../Components';
import {Colors, Icons, Metrix} from '../../Config';
import {capitalize, fonts, formattedDate} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import DeleteModal from '../../Components/DeleteModal';
import PostComments from '../../Components/Community/PostComments';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const RenderItem = ({item}) => {
  const isVideo = item.includes('.mp4');

  return (
    <View style={styles.renderItemContainer}>
      <View style={styles.imageContainer}>
        {/* <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="contain"
          /> */}

        {/* <WebViewComponent url={"https://video-stream-23.s3.us-east-2.amazonaws.com/user/28/artist_post/09-12-2024_17.781618118286133_03-12-2024_17.781618118286133_video.mp4"} /> */}

        {isVideo ? (
          <WebViewComponent url={item} />
        ) : (
          <ImageZoom
            uri={item}
            isDoubleTapEnabled
            style={styles.image}
            resizeMode="stretch"
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

  const imageWidth = width * 0.9;
  const imageHeight = Metrix.VerticalSize(0);

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
    dispatch(
      AuthMiddleware.LikeArtistPost({
        body: {id: item.id},
        cb: result => {
          setIsLiked(p => !p);
          getPostById();
        },
      }),
    );
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
      style={[gstyles.container, {paddingTop: top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}> */}
      {/* <View style={{flex: 1}}> */}
      <Header back={true} isIcon={false} title={t('POSTS')} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {screen === 'explore' ? (
          <View>
            <RenderItem
              item={
                item?.intro_video ? item?.intro_video : item?.profile_pic_URL
              }
              imageWidth={imageWidth}
            />
          </View>
        ) : item?.url?.length === 1 ? (
          <RenderItem item={item?.url[0]} imageWidth={imageWidth} />
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
              <FontAwesome
                name={isLiked ? 'thumbs-up' : 'thumbs-o-up'}
                color={Colors.blue}
                size={30}
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
                  {formattedDate(item?.createdDate)}
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
      {/* </View> */}
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
    // <View>
    //   <Header back={true} isIcon={false} title={t('POSTS')} />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    paddingBottom: Metrix.VerticalSize(500),
  },
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
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrix.VerticalSize(550),
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
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
  likeCount: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
    fontWeight: 'bold',
  },
});

export default memo(PostsListing);
