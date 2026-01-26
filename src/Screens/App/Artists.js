import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ArtistCard, Header, ListEmpty, SearchTextField} from '../../Components';
import {Metrix, NavigationService} from '../../Config';
import {ArtistMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';
const lodash = require('lodash');

const Artists = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedArtists, setSearchedArtists] = useState([]);
  const [nextPage, setNextPage] = useState(0);

  useEffect(() => {
    getAllArtists();
  }, []);

  const getAllArtists = () =>
    dispatch(
      ArtistMiddleware.GetAllArtists({
        offset: nextPage,
        cb: res => {
          if (res !== 'error') {
            setNextPage(nextPage + 1);
            setData([...data, ...res]);
          }
        },
      }),
    );

  const searchArtist = text => {
    setSearchText(text);

    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const cb = data => {
          setSearchedArtists(
            text || !searchedArtists ? data : [...searchedArtists, ...data],
          );
        };
        dispatch(ArtistMiddleware.GetAllArtists({cb, name: text, offset: 0}));
      }, 1000);

      debounce_fun();
    } else {
      getAllArtists();
    }
  };

  const renderArtistCard = ({item}) => (
    <View style={{marginBottom: Metrix.VerticalSize(26)}}>
      <ArtistCard
        item={item}
        width={75}
        height={100}
        onPress={() =>
          NavigationService.navigate('ArtistProfile', {
            isPaid: false,
            id: item?.id,
          })
        }
      />
    </View>
  );

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('ARTISTS')} isIcon={false} />
      <View style={gstyles.marginVertical15}>
        <SearchTextField
          onChangeText={text => searchArtist(text)}
          value={searchText}
        />
      </View>

      <View
        style={[gstyles.marginVertical10, {height: Metrix.VerticalSize(700)}]}>
        <FlatList
          data={searchText ? searchedArtists : data}
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={{
            paddingBottom: Metrix.VerticalSize(200),
            gap: 10,
            columnGap: 10,
          }}
          numColumns={4}
          onEndReachedThreshold={0.3}
          onEndReached={() => getAllArtists()}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{gap: Metrix.HorizontalSize(10)}}
          renderItem={renderArtistCard}
          ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
        />
      </View>
    </View>
  );
};

export default Artists;

const styles = StyleSheet.create({});
