import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  Header,
  ListEmpty,
  NotificationCard,
  SearchTextField,
} from '../../Components';
import {Metrix} from '../../Config';
import {ArtistMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';
const lodash = require('lodash');

const UpcomingCompetitions = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  // State variables
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedCompetitions, setSearchedCompetitions] = useState([]);
  const [nextPage, setNextPage] = useState(0);

  // Fetch upcoming events when component mounts
  useEffect(() => {
    getUpcomingEvents();
  }, []);

  // Fetches upcoming competitions and appends to data
  const getUpcomingEvents = () => {
    dispatch(
      ArtistMiddleware.GetUpcomingCompetitions({
        offset: nextPage,
        cb: res => {
          if (res !== 'error') {
            setNextPage(nextPage + 1); // Increment page for next fetch
            setData(prevData => [...prevData, ...res]); // Append new data
          }
        },
      }),
    );
  };

  // Handles the search functionality with debounce
  const searchArtist = text => {
    setSearchText(text);

    if (text.trim() && text[0] !== ' ') {
      const debounce_fun = lodash.debounce(() => {
        dispatch(
          ArtistMiddleware.GetAllArtists({
            cb: data => {
              setSearchedCompetitions(prev =>
                text ? data : [...prev, ...data],
              );
            },
            name: text,
            offset: 0,
          }),
        );
      }, 1000);

      debounce_fun();
    } else {
      getUpcomingEvents();
    }
  };

  // Render function for each notification card
  const renderItem = ({item}) => <NotificationCard item={item} isFan={true} />;

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('UPCOMINGCOMPETITIONS')} isIcon={false} />

      {/* Search Bar */}
      <View style={gstyles.marginVertical15}>
        <SearchTextField onChangeText={searchArtist} value={searchText} />
      </View>

      {/* Upcoming Competitions List */}
      <View style={styles.container}>
        <FlatList
          data={searchText ? searchedCompetitions : data}
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(80)}}
          onEndReachedThreshold={0.3}
          onEndReached={getUpcomingEvents}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
        />
      </View>
    </View>
  );
};

export default UpcomingCompetitions;

const styles = StyleSheet.create({
  container: {
    ...gstyles.marginVertical10,
    height: Metrix.VerticalSize(700),
    flex: 1,
  },
});
