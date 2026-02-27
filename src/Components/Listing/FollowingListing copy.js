import {View, FlatList, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ArtistListingCard from '../ArtistListingCard';
import {Metrix, NavigationService} from '../../Config';
import gstyles from '../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import ListEmpty from '../ListEmpty';
import SearchTextField from '../SearchTextField';
import {fonts} from '../../Config/Helper';
import {Colors} from '../../Config';
const lodash = require('lodash');

const FollowingListing = ({selectedTab, id, type = 2}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.AuthReducer?.user);

  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedData, setSearchedData] = useState([]);

  const getFollowing = useCallback(() => {
    const payload = {id: id || user?.id, type: type ?? 2};
    const cb = (rows, totalCount) => {
      const list = Array.isArray(rows) ? rows : [];
      setData(list);
      setCount(typeof totalCount === 'number' ? totalCount : list.length);
    };
    dispatch(ArtistMiddleware.GetArtistFollowings({payload, cb}));
  }, [dispatch, id, user?.id, type]);

  useEffect(() => {
    if (id != null || user?.id) {
      getFollowing();
    }
  }, [id, user?.id, getFollowing]);

  const search = text => {
    setSearchText(text);
    if (text && text[0] !== ' ') {
      const debounce_fun = lodash.debounce(function () {
        const payload = {id: id || user?.id, name: text.toLowerCase(), type: type ?? 2};
        const cb = rows => {
          const list = Array.isArray(rows) ? rows : [];
          setSearchedData(list);
        };
        dispatch(ArtistMiddleware.GetArtistFollowings({payload, cb}));
      }, 1000);
      debounce_fun();
    } else {
      setSearchedData([]);
    }
  };

  const list = searchText ? searchedData : data;
  const displayCount = searchText ? list.length : count;

  return (
    <View style={gstyles.marginVertical15}>
      <SearchTextField onChangeText={search} value={searchText} />
      {displayCount > 0 && (
        <Text style={styles.countText}>
          {displayCount} {displayCount === 1 ? 'person' : 'people'}
        </Text>
      )}
      <View
        style={[gstyles.marginVertical10, {height: Metrix.VerticalSize(700)}]}>
        <FlatList
          data={list}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(200)}}
          ListEmptyComponent={<ListEmpty message={'No Data Found'} />}
          renderItem={({item}) => (
            <ArtistListingCard
              data={item?.user ?? item?.artist ?? item}
              selectedTab={selectedTab}
              onPress={() =>
                NavigationService.navigate('ArtistProfile', {
                  id: item?.user?.id ?? item?.artist?.id ?? item?.id,
                })
              }
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countText: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    color: Colors.placeholder,
    marginBottom: Metrix.VerticalSize(8),
  },
});

export default FollowingListing;