import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useDispatch, useSelector} from 'react-redux';
import {Header, WebViewComponent} from '../../Components';
import {Colors, Icons, Metrix} from '../../Config';
import {capitalize, fonts, formattedDate} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import DeleteModal from '../../Components/DeleteModal';

const {width} = Dimensions.get('window');

const RenderItem = ({item}) => {
  const isVideo = item.includes('.mp4');

  return (
    <View style={{marginTop: 40}}>
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
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [pause, setPause] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useTranslation();

  const imageWidth = width * 0.9;
  const imageHeight = Metrix.VerticalSize(0);

  const deletePost = () => {
    dispatch(ArtistMiddleware.DeletePost({id: item?.id}));
    setDeleteModal(false);
  };

  useEffect(() => {
    if (isFocused) {
      setPause(false);
    }
  }, [isFocused]);

  const handleDeletePost = () => {
    // Alert.alert(
    //   'Delete Recording',
    //   'Are you sure you want to delete this recording?',
    //   [
    //     {text: 'Cancel', onPress: () => {}},
    //     {text: 'OK', onPress: deleteStream},
    //   ],
    // );
    setDeleteModal(true);
  };
  const closeModal = () => {
    setDeleteModal(false);
  };

  return (
    <View style={gstyles.container}>
      <Header back={true} isIcon={false} title={t('POSTS')} />
      {screen === 'explore' ? (
        <View>
          <RenderItem
            item={item?.intro_video ? item?.intro_video : item?.profile_pic_URL}
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
        <Text allowFontScaling={false} style={styles.postTitle}>{capitalize(item?.text?.trim())}</Text>
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
      <DeleteModal
        isVisible={deleteModal}
        closeModal={closeModal}
        onDelete={deletePost}
        heading="Delete Post"
        detail="Are you sure you want to delete this post?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
});

export default memo(PostsListing);
