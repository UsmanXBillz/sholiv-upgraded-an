/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  CustomModal,
  Header,
  ListEmpty,
  NotificationCard,
  Tabs,
} from '../../Components';
import {Colors, Metrix, NavigationService} from '../../Config';
import {ToastError, fonts, isCompetitionUpcoming} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';
import {useZoom} from '@zoom/react-native-videosdk';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';

const MyCompetetions = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);
  const zoom = useZoom();

  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [permissionAllowed, setPermissionAllowed] = useState(true);

  const checkPermissions = async () => {
    const permissions =
      Platform.OS === 'android'
        ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]
        : [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    try {
      const permissionStatus = await checkMultiple(permissions);
      const isRequest = Object.values(permissionStatus).includes('denied');
      if (isRequest) {
        setPermissionAllowed(false);
        const permission = await requestMultiple(permissions);
        const isPermissionAllowed =
          Object.values(permission).filter(i => i === 'granted').length ===
          permissions.length;
        if (isPermissionAllowed) {
          setPermissionAllowed(true);
        }
      }
    } catch (error) {
      console.log('ERROR CHECKING PERMISSIONS===', error);
    }
  };

  useEffect(() => {
    checkPermissions();
    getCompetitions();
    return () => {
      getCompetitions();
      checkPermissions();
    };
  }, []);

  const getCompetitions = (fresh, index) => {
    if (fresh) {
      setData([]);
      setNextPage(0);
    }

    const cb = res => {
      // workaround to show only Accepted Competitions
      const list = index === 1 ? res.filter(i => i.status === 2) : res;
      if (fresh) {
        setData(list);
        setNextPage(1);
      } else {
        setData(prevData => [...prevData, ...list]);
        setNextPage(prevPage => prevPage + 1);
      }
    };

    dispatch(
      ArtistMiddleware.GetMyCompetitions({
        offset: fresh ? 0 : nextPage,
        type: index === 0 || index == undefined ? 1 : index === 1 ? 2 : 3,
        cb,
      }),
    );
  };

  const onTabPress = (tab, index) => {
    setSelectedTab(index);
    getCompetitions(true, index);
  };

  const onEndReached = () => {
    if (nextPage > 0) {
      getCompetitions(false, selectedTab);
    }
  };

  const joinZoomSession = item => {
    if (!permissionAllowed) {
      Alert.alert(
        'Allow Permissions',
        'Live feature requires Camera & Microphone Acccess, Please enable them to continue.',
        [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Settings', onPress: () => Linking.openSettings()},
        ],
      );
      return;
    }
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

  // Accept request function
  const handleRequest = (id, status) => {
    setData([]);
    const payload = {status};
    dispatch(
      AuthMiddleware.AcceptRejectRequest({
        id,
        payload,
        cb: res => {
          getCompetitions(true, 0);
        },
      }),
    );
  };

  const renderItem = ({item}) => (
    <NotificationCard
      item={item}
      selectedTab={selectedTab}
      isUpcomingComp={true}
      acceptRequest={() => handleRequest(item?.id, 2)}
      deletRequest={() => handleRequest(item?.id, 3)}
      startLive={() => joinZoomSession(item)}
    />
  );

  return (
    <View style={gstyles.container}>
      <Header back={true} isIcon={false} title={t('COMPETITIONS')} />
      <View style={gstyles.marginTop30}>
        <Tabs
          onPress={(tab, index) => onTabPress(tab, index)}
          tabs={['PENDING', 'ACCEPTED', 'REJECTED']}
          profile={false}
          selectedTab={selectedTab}
          tabLabelStyle={styles.tabLabelStyle}
          style={styles.tabContainer}
          tabStyle={styles.tabStyle}
        />

        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.flatListContentContainer}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?.id?.toString()}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
            ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
          />
          <View></View>
        </View>
      </View>
      <CustomModal show={modalOpen} children={<RenderModalBody />} />
    </View>
  );
};

export default MyCompetetions;

const styles = StyleSheet.create({
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
