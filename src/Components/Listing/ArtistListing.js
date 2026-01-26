import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationService} from '../../Config';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import ArtistCard from '../ArtistCard';
import LableWithSeeAll from '../LableWithSeeAll';

const ArtistListing = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [artistList, setArtsistsList] = useState(null);
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

  return (
    <View>
      <LableWithSeeAll
        title={t('ARTISTS')}
        onPress={() => NavigationService.navigate('Artists')}
      />
      <FlatList
        horizontal
        data={artistList?.splice(0, 4)}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderArtists}
        contentContainerStyle={{gap: 10}}
      />
    </View>
  );
};

export default memo(ArtistListing);
