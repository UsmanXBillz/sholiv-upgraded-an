import { StyleSheet, View, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ArtistListingCard from '../ArtistListingCard'
import { AppData, Metrix, NavigationService } from '../../Config';
import gstyles from '../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { ArtistMiddleware } from '../../Redux/Middlewares';
import ListEmpty from '../ListEmpty';
import SearchTextField from '../SearchTextField';
const lodash = require('lodash');

const FollowingListing = ({ selectedTab, id }) => {

    const dispatch = useDispatch();

    const user = useSelector(state => state?.AuthReducer?.user);

    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [nextPage, setNextPage] = useState(0);
    const [searchedData, setSearchedData] = useState([]);

    const getFollowing = () => {

        const cb = res => {
            setNextPage(nextPage + 1);
            setData([...data, ...res]);
        }

        if (user?.id == id) {
            dispatch(ArtistMiddleware.GetAllFollowing({
                offset: nextPage,
                cb
            }))
        } else {
            dispatch(ArtistMiddleware.GetAllFollowing({
                id,
                offset: nextPage,
                cb
            }))
        }
    }

    useEffect(() => {
        getFollowing();
    }, [])

    const search = (text) => {
        setSearchText(text);

        if (text && text[0] !== ' ') {

            let debounce_fun = lodash.debounce(function () {
                const cb = data => {
                    setSearchedData((text || !searchedData) ? data : [...searchedData, ...data])
                }
                dispatch(ArtistMiddleware.GetAllFollowing({id: (user?.id !== id) ? id: '', cb, name: text.toLowerCase(), offset: 0}));

            }, 1000);

            debounce_fun();
        } else {
            getFollowing();
        }
    }
    return (
        <View style={gstyles.marginVertical15}>
            <SearchTextField onChangeText={(text) => search(text)} value={searchText} />

            <View style={[gstyles.marginVertical10, { height: Metrix.VerticalSize(700) }]}>
                <FlatList
                    data={searchText ? searchedData : data}
                    keyExtractor={(item) => item?.id?.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Metrix.VerticalSize(200) }}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => getFollowing()}
                    ListEmptyComponent={<ListEmpty message={'No Data Found'} />}
                    renderItem={({ item }) => <ArtistListingCard data={item?.user ?? item?.artist} selectedTab={selectedTab} onPress={() => NavigationService.navigate('UserProfile', { id: item?.user?.id })} />}
                />
            </View>
        </View>
    )
}

export default FollowingListing

const styles = StyleSheet.create({})