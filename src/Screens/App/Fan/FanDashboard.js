import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import gstyles from '../../../styles';
import {Colors, Metrix, NavigationService} from '../../../Config';
import {
  ArtistCard,
  LableWithSeeAll,
  RecommendedArtistCard,
  FollowingProfileCard,
  CustomModal,
  MultiChoiceDropdown,
  ModalCard,
  ListEmpty,
} from '../../../Components';
import {useDispatch} from 'react-redux';
import {ArtistMiddleware, AuthMiddleware} from '../../../Redux/Middlewares';
import {ToastError, filterRecentSessions, fonts} from '../../../Config/Helper';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {fanStreamListingListner} from '../../../libraries/initChat';
import UpCompetitionsBlock from '../../../Components/Listing/UpCompetitionsBlock';
const FanDashboard = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [artistList, setArtsistsList] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [liveStreams, setliveStreams] = useState([]);
  const [artistType, setArtistType] = useState([]);
  const [recommendArtist, setRecommendedArtist] = useState(null);
  const [selected, setSelected] = useState([]);
  const [nextPage, setNextPage] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getAllArtists();
      getStreams();
      getArtistType();
      fanStreamListingListner(data => data?.stream_update && getStreams());
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getRecommendidArtist();
      getAddedCategory();
    }, []),
  );

  const getAddedCategory = () => {
    const cb = data => {
      if (data?.length == 0) {
        setShowCategoryDropdown(true);
      }
    };
    dispatch(AuthMiddleware.GetAddedCategory({cb}));
  };

  const getRecommendidArtist = () => {
    dispatch(
      ArtistMiddleware.GetRecommendedArtists({
        offset: 0,
        cb: res => {
          if (res !== 'error') {
            const list = res?.splice(0, 1);
            setRecommendedArtist(list);
          }
        },
      }),
    );
  };

  const getArtistType = () => {
    const cb = data => {
      const transformedObject = data?.map(item => ({
        id: item?.id,
        label: item?.name,
        value: item?.id,
      }));
      setArtistType(transformedObject);
    };

    dispatch(ArtistMiddleware.GetArtistType(cb));
  };

  const getStreams = ind => {
    const cb = data => {
      const filtered = filterRecentSessions(data);
      setliveStreams(filtered);
    };
    dispatch(ArtistMiddleware.GetLiveStreams({cb}));
  };

  const cb = res => setArtsistsList(res?.splice(0, 8));

  const getAllArtists = () =>
    dispatch(
      ArtistMiddleware.GetAllArtists({
        offset: nextPage,
        cb: res => {
          if (res !== 'error') {
            setArtsistsList(res?.splice(0, 8));
          }
        },
      }),
    );

  const renderArtists = ({item}) => (
    <ArtistCard
      item={item}
      width={65}
      height={90}
      onPress={() =>
        NavigationService.navigate('ArtistProfile', {
          isPaid: false,
          id: item?.id,
        })
      }
    />
  );

  const renderFollowingProfiles = ({item}) => (
    <FollowingProfileCard getStreams={getStreams} item={item} />
  );

  const Continue = () => {
    if (!selected?.length) {
      return Toast.show(ToastError(t('SELECT_ARTIST_CATEGORY')));
    }
    if (selected?.length) {
      const payload = {artist_id: selected};

      const cb = () => {
        setTimeout(() => {
          setSelected([]);
          getRecommendidArtist();
          setShowCategoryDropdown(false);
        }, 500);
      };
      dispatch(ArtistMiddleware.PostRecommendationCategory({payload, cb, t}));
    }
  };

  const onClose = () => setShowCategoryDropdown(false);

  return (
    <View>
      <View style={gstyles.marginVertical10}>
        {/* <SearchTextField onChangeText={(text) => console.log(text)} isIcon={false} /> */}
      </View>

      <FlatList
        horizontal
        style={[gstyles.marginTop20, gstyles.marginBottom10]}
        data={liveStreams}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(0)}}
        onEndReachedThreshold={0.3}
        showsHorizontalScrollIndicator={false}
        renderItem={renderFollowingProfiles}
      />

      <UpCompetitionsBlock />

      <View style={gstyles.marginVertical10}>
        <LableWithSeeAll
          title={'RECOMMENDED'}
          onPress={() => NavigationService.navigate('Recommendation')}
        />
        <View style={gstyles.marginTop10}>
          {!recommendArtist?.length ? (
            <View style={styles.emptyListContainer}>
              <ListEmpty message={t('EMPTY_LISTING')} />
            </View>
          ) : (
            <RecommendedArtistCard item={recommendArtist[0]} />
          )}
        </View>
      </View>

      <LableWithSeeAll
        title={t('ARTIST')}
        onPress={() => NavigationService.navigate('Artists')}
      />

      <FlatList
        style={gstyles.marginVertical10}
        data={artistList}
        keyExtractor={item => item?.id?.toString()}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(60)}}
        numColumns={4}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{flex: 1}}
        renderItem={renderArtists}
      />
      {showCategoryDropdown && (
        <CustomModal
          show={showCategoryDropdown}
          children={
            <ModalCard
              title={t('SELECT_CATEGORY')}
              bgColor={Colors.black}
              onPress={Continue}
              onClose={onClose}
              children={
                <MultiChoiceDropdown
                  selected={selected}
                  artistType={artistType}
                  setSelected={setSelected}
                />
              }
            />
          }
        />
      )}
    </View>
  );
};

export default FanDashboard;

const styles = StyleSheet.create({
  modalWrapper: {
    ...gstyles.customModalWrapper,
    backgroundColor: Colors.black,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    marginTop: Metrix.VerticalSize(10),
    width: '100%',
    paddingRight: Metrix.VerticalSize(5),
    paddingLeft: Metrix.VerticalSize(15),
    height: Metrix.VerticalSize(50),
    backgroundColor: Colors.carbonBlack,
    borderRadius: 15,
  },
  placeholder: {
    color: Colors.dropdownPlaceholder,
    fontFamily: fonts.RubikRegular,
  },
  selectedTextStyle: {
    color: Colors.placeholder,
    fontSize: Metrix.customFontSize(14),
    backgroundColor: Colors.red,
  },
  inputSearchStyle: {
    height: Metrix.VerticalSize(40),
    borderRadius: 5,
    backgroundColor: Colors.carbonBlack,
    color: Colors.white,
  },
  iconStyle: {
    marginRight: Metrix.HorizontalSize(12),
  },
  selectedStyle: {
    backgroundColor: Colors.blue,
  },
  emptyListContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: Metrix.HorizontalSize(6),
  },
});
