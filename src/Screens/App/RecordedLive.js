import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Header, VideoContainer} from '../../Components';
import {Colors, Icons, Metrix, NavigationService} from '../../Config';
import {capitalize, fonts, formattedDate} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import DeleteModal from '../../Components/DeleteModal';

const RecordedLive = ({route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const data = route?.params?.item;
  const [url, setUrl] = useState(null);
  const [token, setToken] = useState(null);
  const [zoomresponse, setZoomResponse] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [downloadableLink, setDownloadableLink] = useState('');
  const userId = useSelector(state => state?.AuthReducer?.user?.id);

  useEffect(() => {
    fetchEndedLive();
  }, []);

  const fetchEndedLive = () => {
    const cb = res => {
      if (res === 'error') {
        return setError(t('RECORDING_NOT_AVAILABLE_AT_MOMENT'));
      }
      console.warn('ress==========>>', res);
      setToken(res?.download_access_token);
      const downloadableLink = `${res?.recording_files[0]?.download_url}`;
      setDownloadableLink(downloadableLink);
      setZoomResponse(res);
    };
    dispatch(ArtistMiddleware.GetRecordedLive({id: data?.id, cb}));
  };

  useEffect(() => {
    if (downloadableLink) {
      // fetchZoomRecording();
      const cb = res => setUrl(res);
      dispatch(ArtistMiddleware.GetZoomUrl({url: downloadableLink, token, cb}));
    }
  }, [downloadableLink]);

  const handleDeleteStream = () => {
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

  const deleteStream = () => {
    const cb = () => {
      dispatch({type: 'REFETCH_LISTINGS', payload: null});
    };
    dispatch(ArtistMiddleware.DeleteLiveStream({id: data?.id, cb}));
  };
  console.log(url);
  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('RECORDED_LIVE')} isIcon={false} />
      {!error ? (
        <View style={[gstyles.marginVertical30, styles.videoContainerStyle]}>
          {
            <VideoContainer
              video={url}
              item={data}
              controls={true}
              liveRec={true}
              initialMuted={false}
            />
          }
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Metrix.VerticalSize(400),
          }}>
          <Text allowFontScaling={false} style={styles.details}>{error}</Text>
        </View>
      )}
      <View style={styles.videoDetailContainer}>
        <Text allowFontScaling={false} style={styles.videoTitle}>{capitalize(data?.text) ?? 'N/A'}</Text>
        <View style={gstyles.marginVertical5}>
          <Text allowFontScaling={false} style={styles.videoTitleMessage}>
            {capitalize(data?.user?.name ?? data?.user?.username)}
            <Text allowFontScaling={false} style={styles.date}>
              {' '}
              {formattedDate(zoomresponse?.start_time)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            {!error && (
              <Text allowFontScaling={false} style={styles.details}>
                {zoomresponse?.recording_count - 1 ?? 0} {t('VIEWS')}
              </Text>
            )}
            <Text allowFontScaling={false} style={styles.details}>
              {' '}
              {moment(zoomresponse?.start_time).fromNow()}
            </Text>
          </View>
          {userId == data?.user_id && !error && (
            <TouchableOpacity onPress={handleDeleteStream}>
              <Icons.AntDesign
                name={'delete'}
                size={Metrix.customFontSize(28)}
                color={Colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <DeleteModal
        isVisible={deleteModal}
        closeModal={closeModal}
        onDelete={deleteStream}
        heading="Delete Recording"
        detail="Are you sure you want to delete this recording?"
      />
    </View>
  );
};

export default RecordedLive;

const styles = StyleSheet.create({
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
  },
});
