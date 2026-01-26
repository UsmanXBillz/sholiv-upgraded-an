import { StyleSheet, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Metrix } from '../../Config';
import gstyles from '../../styles';
import ArtistListingCard from '../ArtistListingCard';
import { ArtistMiddleware } from '../../Redux/Middlewares';
import { useDispatch } from 'react-redux';


const SubscribersListing = ({id}) => {
    const dispatch = useDispatch();
    
    const [subscribersList, setSubscribersList] = useState(null);

    useEffect(() => {
        getAllFollowers();
    }, [])

    const getAllFollowers = () => {
        const cb = data => setSubscribersList(data);
        const payload = {artist_id : id}
        dispatch(ArtistMiddleware.GetSubscribers({ payload, cb })) // change teh call once api is available
    }

    return (
        <View style={gstyles.marginVertical15}>
            <FlatList
                data={subscribersList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Metrix.VerticalSize(200) }}
                onEndReachedThreshold={0.3}
                renderItem={({ item }) => <ArtistListingCard data={item?.user} />}
            />
        </View>
    )
}

export default SubscribersListing

const styles = StyleSheet.create({})