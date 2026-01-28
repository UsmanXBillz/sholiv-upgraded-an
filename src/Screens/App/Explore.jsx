/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Header, SearchTextField, VideoStreaming} from '../../Components';
import {Colors, Metrix} from '../../Config';
import {fonts} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';

const lodash = require('lodash');

const Explore = () => {
  const dispatch = useDispatch();
  const searchNextPage = useRef(0);
  const {t} = useTranslation();

  const [artistTypes, setArtistTypes] = useState([{id: 'all', name: 'All'}]);
  const [exploredata, setExploreData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedStreams, setSearchedStreams] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState({
    id: 'all',
    name: 'All',
  });

  const getTypes = async () => {
    const handleTypes = data => {
      if (Array.isArray(data) && data.length > 0) {
        setArtistTypes([{id: 'all', name: 'All'}, ...data]);
      }
    };
    dispatch(ArtistMiddleware.GetArtistType(handleTypes));
  };

  const handleFilterSelect = filter => {
    setExploreData([]);
    setSearchText('');
    setSearchedStreams([]);
    setSelectedFilter(filter);
  };

  const getArtistAgainstType = fresh => {
    const handleArtisits = data => {
      console.log('FRESH', fresh);
      if (Array.isArray(data) && data.length > 0) {
        setExploreData(fresh ? data : [...exploredata, ...data]);
        setNextPage(fresh ? 1 : nextPage + 1);
      }
    };
    const args = {
      artist_id: selectedFilter.id == 'all' ? null : selectedFilter.id,
      offset: fresh ? 0 : nextPage,
      name: searchText,
      cb: handleArtisits,
    };
    dispatch(ArtistMiddleware.GetArtistsByType(args));
  };

  const searchStream = text => {
    setSearchText(text);
    searchNextPage.current = 0;

    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const handleSearchResults = data => {
          setSearchedStreams(
            text || !searchedStreams ? data : [...searchedStreams, ...data],
          );
          Keyboard.dismiss();
        };
        const artistId = selectedFilter?.id !== 'all' ? selectedFilter?.id : '';
        dispatch(
          ArtistMiddleware.GetArtistsByType({
            cb: handleSearchResults,
            artist_id: artistId,
            name: text,
            offset: 0,
          }),
        );
      }, 1000);

      debounce_fun();
    } else {
      searchNextPage.current = 0;
      setSearchedStreams([]);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);

  useEffect(() => {
    console.log('-----------Getting artists in Effect---------');

    setTimeout(() => {
      getArtistAgainstType(true);
    }, 500);
  }, [selectedFilter]);

  const renderItem = ({item}) => {
    const isSelected = selectedFilter.id === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.filterButton, isSelected && styles.selectedFilter]}
        onPress={() => handleFilterSelect(item)}>
        <Text allowFontScaling={false}
          style={[styles.filterLabel, isSelected && styles.selectedFilterText]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('EXPLORE')} isIcon={false} />
      <View style={gstyles.marginVertical15}>
        <SearchTextField
          onChangeText={text => searchStream(text)}
          value={searchText}
        />
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={artistTypes}
            renderItem={renderItem}
          />
        </View>
        <View style={{marginBottom: Metrix.VerticalSize(100)}}>
          <VideoStreaming
            data={searchText ? searchedStreams : exploredata}
            isPostsListing={true}
            selectedTab={0}
            screen={'explore'}
            getArtistAgainstType={() => getArtistAgainstType(false)}
          />
        </View>
      </View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  paymentCardContainer: {
    marginLeft: Metrix.HorizontalSize(10),
    marginVertical: Metrix.VerticalSize(40),
  },
  paymentCardItem: {
    marginLeft: Metrix.HorizontalSize(20),
  },
  filterContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginVertical: Metrix.VerticalSize(25),
    // height: Metrix.VerticalSize(700)
  },
  filterButton: {
    paddingHorizontal: Metrix.HorizontalSize(20),
    borderRadius: 30,
    backgroundColor: Colors.carbonBlack,
    marginHorizontal: Metrix.HorizontalSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrix.VerticalSize(45),
  },
  filterLabel: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(14),
    paddingHorizontal: Metrix.HorizontalSize(4),
    paddingVertical: Metrix.VerticalSize(8),
    textAlign: 'center',
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
  selectedFilterText: {
    color: Colors.white,
  },
  liveStatsContainer: {
    backgroundColor: Colors.lightGray,
    width: Metrix.HorizontalSize(70),
    padding: Metrix.VerticalSize(8),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 22,
  },
  liveStatstext: {
    color: Colors.white,
    fontFamily: fonts.RubikRegular,
    marginLeft: Metrix.HorizontalSize(10),
  },
  lockIconContainer: {
    backgroundColor: 'rgba(245, 245, 245, 0.28)',
    width: Metrix.HorizontalSize(172),
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 8,
    height: Metrix.VerticalSize(260),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
