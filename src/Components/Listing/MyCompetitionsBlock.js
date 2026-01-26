/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-undef */
import {useZoom} from '@zoom/react-native-videosdk';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, Metrix, NavigationService} from '../../Config';
import {
  capitalize,
  fonts,
  isCompetitionUpcoming,
  ToastError,
} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import Button from '../Button';
import CustomModal from '../CustomModal';
import LableWithSeeAll from '../LableWithSeeAll';
import ListEmpty from '../ListEmpty';

const MyCompetitionsBlock = () => {
  const dispatch = useDispatch();
  const zoom = useZoom();
  const {t} = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const user = useSelector(state => state?.AuthReducer?.user);

  const [data, setData] = useState([]);

  useEffect(() => {
    getCompetitions();
    return () => {
      getCompetitions();
    };
  }, []);

  const getCompetitions = () => {
    const cb = res => {
      // workaround to show only Accepted Competitions
      const list = res.filter(i => i.status === 2);
      // const list = res;
      setData(list);
    };

    dispatch(
      ArtistMiddleware.GetMyCompetitions({
        offset: 0,
        type: 2,
        limit: 100,
        cb,
      }),
    );
  };

  const joinZoomSession = item => {
    const hasTimeStarted = isCompetitionUpcoming(
      item?.competitionDate,
      item?.competitionTime,
      item?.timezone,
    );
    if (hasTimeStarted) {
      return Toast.show(ToastError(t('TIME_NOT_STARTED')));
    }

    zoom.isInSession().then(res => {
      if (res) {
        zoom.leaveSession(false);
      }
    });

    setModalOpen(true);
    setSelectedItem(item);
  };

  const renderItem = ({item}) => {
    return (
      <View key={`${item.key}`}>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={() => joinZoomSession(item)}>
          <Image
            resizeMode="cover"
            style={{
              width: Metrix.VerticalSize(270),
              height: Metrix.VerticalSize(150),
            }}
            source={{uri: item?.url[0]}}
          />
          <View style={styles.titleContainer}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.videoTitle}>
              {capitalize(item?.creator?.name) +
                ' vs ' +
                capitalize(item?.competitor?.name)}{' '}
              - {capitalize(item?.text)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const goToCompetitionScreen = () => {
    setModalOpen(false);
    //competitior
    if (user?.id == selectedItem?.competitor_id) {
      const cb = data => {
        if (data != 'error') {
          NavigationService.navigate('JoinCompetition', {
            url: selectedItem?.url,
            text: selectedItem?.text,
            item: selectedItem,
            competitor_id: selectedItem.competitor_id,
            creator_id: selectedItem.created_id,
          });
        }
      };
      return dispatch(
        ArtistMiddleware.CompetitorJoin({id: selectedItem?.id, cb}),
      );
    }

    NavigationService.navigate('JoinCompetition', {
      url: selectedItem?.url,
      text: selectedItem?.text,
      item: selectedItem,
      competitor_id: selectedItem.competitor_id,
      creator_id: selectedItem.created_id,
    });
  };

  const RenderModalBody = () => {
    return (
      <View style={styles.modalWrapper}>
        <View style={styles.modalContentContainer}>
          <ScrollView>
            <Text allowFontScaling={false} style={styles.modalMessage}>{t('INSTRUCTIONS')}</Text>
            <Text allowFontScaling={false} style={styles.winnerText}>
              {t('COMPETITION_INSTRUCTIONS')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: Metrix.VerticalSize(20),
                justifyContent: 'space-around',
              }}>
              <View style={{width: '48%'}}>
                <Button
                  buttonText={t('CLOSE')}
                  onPress={() => setModalOpen(false)}
                />
              </View>
              <View style={{width: '48%'}}>
                <Button
                  buttonText={t('JOIN')}
                  onPress={goToCompetitionScreen}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (data.length === 0) return <></>;

  return (
    <View>
      <LableWithSeeAll title={t('COMPETITIONS')} isShowSeeAll={false} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        ListEmptyComponent={<ListEmpty message={t('NO_TOP_STREAM_FOUND')} />}
      />
      <CustomModal show={modalOpen} children={<RenderModalBody />} />
    </View>
  );
};

export default memo(MyCompetitionsBlock);

const styles = StyleSheet.create({
  videoWrapper: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    width: Metrix.VerticalSize(270),
    marginTop: Metrix.VerticalSize(12),
  },
  videoTitle: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    overflow: 'hidden',
    marginLeft: Metrix.HorizontalSize(2),
  },

  tabLabelStyle: {
    paddingHorizontal: Metrix.HorizontalSize(0),
  },
  tabContainer: {
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(10),
    justifyContent: 'flex-start',
  },
  tabStyle: {
    // marginRight: Metrix.HorizontalSize(50),
    // justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    width: '35%',
  },
  container: {
    ...gstyles.marginVertical10,
    height: Metrix.VerticalSize(700),
  },
  imageContainer: {
    width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 140 : 100),
    height: Metrix.VerticalSize(Platform.OS === 'ios' ? 236 : 200),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  cardContainer: {
    margin: Metrix.VerticalSize(10),
  },
  flatListContentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    marginTop: Metrix.VerticalSize(20),
  },
  modalWrapper: {
    backgroundColor: 'transparent',
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
    fontFamily: fonts.RobotoLight,
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
    borderRadius: 40,
  },
});
