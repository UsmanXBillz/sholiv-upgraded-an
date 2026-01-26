import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button, Header, ScreenTopImage, VideoContainer} from '../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts, formattedDate} from '../../Config/Helper';
import gstyles from '../../styles';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const FreeTrial = ({route}) => {
  const {t} = useTranslation();

  const data = route?.params?.data;
  const isFollowed = route?.params?.isFollowed;
  const user = useSelector(state => state?.AuthReducer?.user);

  console.warn('isFollowedisFollowedisFollowed', isFollowed);

  const isArtist = data?.id === user?.id;
  const isIntroAvailable = user?.intro_video ? true : false;
  const videoIntro = isArtist ? user?.intro_video : data?.intro_video;
  const count = isArtist ? user?.intro_view_count : data?.intro_view_count;
  const title = isArtist ? user?.intro_title : data?.intro_title;

  const onPress = () => {
    isArtist
      ? NavigationService.navigate('StartLive', {
          type: {id: 3, value: '10 Sec Trial'},
        })
      : NavigationService.goBack();
  };

  const messageListing = {
    true: t('YOU_HAVE_NOT_UPLOADED_TRIAL_VIDEO'),
    false: t('ARTIST_HAS_NOT_UPLOADED_TRIAL_VIDEO'),
  };

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('FREE_TRIAL')} isIcon={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {videoIntro ? (
          <View style={styles.container}>
            <View>
              <TouchableOpacity
                style={styles.rowContainer}
                onPress={() =>
                  NavigationService.navigate('ArtistProfile', {id: data?.id})
                }>
                <ScreenTopImage image={data?.profile_pic_URL} size={30} />
                <Text allowFontScaling={false} style={styles.artistName}>
                  {capitalize(data?.name ?? data?.username)}
                </Text>
              </TouchableOpacity>
              <View style={styles.videoContainerStyle}>
                <VideoContainer
                  video={videoIntro}
                  item={data}
                  initialMuted={false}
                  autoPlay={true}
                />
              </View>
              <View style={styles.videoDetailContainer}>
                <Text allowFontScaling={false} style={styles.videoTitle}>
                  {capitalize(title) ?? 'N/A'}
                </Text>
                <View style={gstyles.marginVertical5}>
                  <Text allowFontScaling={false} style={styles.videoTitleMessage}>
                    {capitalize(data?.name ?? data?.username)}
                    <Text allowFontScaling={false} style={styles.date}>
                      {' '}
                      {formattedDate(data?.createdAt)}
                    </Text>
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text allowFontScaling={false} style={styles.details}>
                    {count ?? 0} {t('VIEWS')}
                  </Text> */}
                  <Text allowFontScaling={false} style={styles.details}>
                    {moment(user?.createdAt).fromNow()}
                  </Text>
                </View>
              </View>
              <View style={gstyles.marginTop50}></View>
            </View>
            {/* made this button visble to artist onwn free trial, for rest fan ir artist will continue proess of payment voa follow btn  */}
            {isArtist && (
              <Button
                btnStyle={gstyles.marginVertical20}
                buttonText={
                  !isArtist ? t('BUY_SUBSCRIPTION') : t('EDIT_TRIAL_VIDEO')
                }
                postIcon={
                  !isArtist ? (
                    <Image
                      source={Images.diamond}
                      style={gstyles.marginLeft10}
                    />
                  ) : null
                }
                onPress={onPress}
              />
            )}
          </View>
        ) : (
          <View style={styles.errorMessage}>
            <Text allowFontScaling={false} style={styles.artistName}>{messageListing[isArtist]}</Text>
            {isArtist && !isIntroAvailable && (
              <Button
                btnStyle={gstyles.marginTop20}
                buttonText={'Add Trial Video'}
                onPress={onPress}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FreeTrial;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  videoTitleMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.blue,
  },
  videoTitle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  date: {
    fontFamily: fonts.MontserratMedium,
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
  },
  details: {
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
  },
  videoDetailContainer: {
    marginVertical: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(12),
  },
  videoWrapper: {
    marginVertical: Metrix.VerticalSize(8),
    borderRadius: 16,
    overflow: 'hidden',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrix.VerticalSize(20),
  },
  artistName: {
    fontSize: Metrix.customFontSize(17),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(10),
  },
  errorMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrix.VerticalSize(500),
    overflow: 'hidden',
  },
});
