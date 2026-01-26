import { View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState, } from 'react';
import gstyles from '../../../styles'
import { Header, ListEmpty, RecommendedArtistCard, SearchTextField } from '../../../Components'
import { fonts } from '../../../Config/Helper';
import { Colors, Metrix } from '../../../Config';
import { useDispatch } from 'react-redux';
import { ArtistMiddleware } from '../../../Redux/Middlewares';
import { useTranslation } from 'react-i18next';
const lodash = require('lodash');

const Recommendation = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(0);


  useEffect(() => {
    getRecommendidArtistList();
  }, [])

  const getRecommendidArtistList = () => {

    dispatch(ArtistMiddleware.GetRecommendedArtists({
      offset: nextPage,
      cb: (res) => {
        if (res !== 'error') {
          setNextPage(nextPage + 1);
          setData([...data, ...res]);
        }
      }
    }))
  }
  const searchArtist = (text) => {
    setSearchText(text);
    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const cb = data => {
          setSearchedData((text || !searchedData) ? data : [...searchedData, ...data]);
        }
        dispatch(ArtistMiddleware.GetRecommendedArtists({ cb, name: text.toLowerCase(), offset: 0 }));
      }, 1000);
      debounce_fun();
    } else {
      getRecommendidArtistList();
    }
  }

  const renderItem = ({ item }) => <RecommendedArtistCard item={item} />

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('RECOMMENDED_ARTIST')} isIcon={false} />
      <View style={gstyles.marginVertical20}>
        <SearchTextField onChangeText={(text) => searchArtist(text)} value={searchText} />
        <View style={gstyles.marginVertical15}>
          <FlatList
            data={searchText ? searchedData : data}
            style={gstyles.marginVertical20}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Metrix.VerticalSize(200) }}
            onEndReachedThreshold={0.3}
            onEndReached={() => getRecommendidArtistList()}
            renderItem={renderItem}
            ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
          />
        </View>
      </View>
    </View>
  )
}

export default Recommendation

const styles = StyleSheet.create({
  titleText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(20),
    color: Colors.white,
    marginBottom: Metrix.VerticalSize(5)
  },
  description: {
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(14),
    color: Colors.pearlGrey,
    marginTop: Metrix.VerticalSize(5)
  },
  signInBtn: {
    width: '50%',
  },
  textStyle: {
    fontFamily: fonts.MontserratMedium
  },
  btnStyle: {
    paddingVertical: Metrix.VerticalSize(8),
    borderRadius: 6,
    marginTop: Metrix.VerticalSize(30)
  },
  artistContainer: {
    backgroundColor: Colors.inputBg,
    padding: Metrix.VerticalSize(15),
    borderRadius: 16,
    marginBottom: Metrix.VerticalSize(14)

  }
})