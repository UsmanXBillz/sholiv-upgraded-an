import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Metrix} from '../../Config';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
import ArtistListingCard from '../ArtistListingCard';
import ListEmpty from '../ListEmpty';
import SearchTextField from '../SearchTextField';
const lodash = require('lodash');

const FollowersListing = ({selectedTab, id}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.AuthReducer?.user);

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [nextPage, setNextPage] = useState(0);
  const [searchedData, setSearchedData] = useState([]);

  useEffect(() => {
    getAllFollowers();
  }, []);

  const getAllFollowers = () => {
    const cb = res => {
      setNextPage(nextPage + 1);
      setData([...data, ...res]);
    };

    if (user?.id == id) {
      dispatch(
        ArtistMiddleware.GetAllFollowers({
          offset: nextPage,
          cb,
        }),
      );
    } else {
      dispatch(
        ArtistMiddleware.GetAllFollowers({
          id,
          offset: nextPage,
          cb,
        }),
      );
    }
  };

  const search = text => {
    setSearchText(text);

    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const cb = data => {
          setSearchedData(
            text || !searchedData ? data : [...searchedData, ...data],
          );
        };
        dispatch(
          ArtistMiddleware.GetAllFollowers({
            id: user?.id !== id ? id : '',
            cb,
            name: text.toLowerCase(),
            offset: 0,
          }),
        );
      }, 1000);

      debounce_fun();
    } else {
      getAllFollowers();
    }
  };

  return (
    <View>
      <SearchTextField onChangeText={text => search(text)} value={searchText} />

      <View
        style={[gstyles.marginVertical10, {height: Metrix.VerticalSize(700)}]}>
        <FlatList
          data={searchText ? searchedData : data}
          style={gstyles.marginVertical15}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(200)}}
          onEndReachedThreshold={0.3}
          onEndReached={() => getAllFollowers()}
          ListEmptyComponent={<ListEmpty message={'No Data Found'} />}
          renderItem={({item}) => (
            <ArtistListingCard data={item?.user} selectedTab={selectedTab} />
          )}
        />
      </View>
    </View>
  );
};

export default FollowersListing;

const styles = StyleSheet.create({});
