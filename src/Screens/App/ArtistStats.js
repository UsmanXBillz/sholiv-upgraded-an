import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import gstyles from '../../styles';
import { FollowersListing, FollowingListing, Header, Tabs } from '../../Components';
import { AppData, Metrix } from '../../Config';
import { capitalize} from '../../Config/Helper';

const { artistStatsLabels, fanProfileStatsLabels } = AppData;

const ArtistStats = ({ route }) => {

    const name = route?.params?.name;
    const id = route?.params?.id;
    const selected = route?.params?.selectedTab;
    const isEditProfile = route?.params?.isEditProfile

    const [selectedTab, setSelectedTab] = useState(selected);

    return (
        <View style={gstyles.container}>
            <Header back={true} isIcon={false} title={capitalize(name)} />
            <View style={gstyles.marginTop30}>
                <Tabs
                    onPress={(tab, index) => setSelectedTab(index)}
                    tabs={!isEditProfile ? artistStatsLabels : fanProfileStatsLabels}
                    profile={false}
                    selectedTab={ !isEditProfile ? selectedTab : 0}
                    tabLabelStyle={styles.tabLabelStyle}
                    style={styles.tabContainer}
                    tabStyle={styles.tabStyle}
                />
            </View>
            <View>
                {selectedTab == 0 && <FollowersListing selectedTab={selectedTab} id={id} />}
                {selectedTab == 1 && <FollowingListing selectedTab={selectedTab} id={id} />}
                {/* {selectedTab == 2 && <SubscribersListing id={id} />} */}
            </View>
        </View>
    )
}

export default ArtistStats

const styles = StyleSheet.create({
    tabLabelStyle: {
        paddingHorizontal: Metrix.HorizontalSize(0)
    },
    tabContainer: {
        width: '100%',
        paddingHorizontal: Metrix.HorizontalSize(10),
        justifyContent: 'flex-start'
    },
    tabStyle: {
        marginRight: Metrix.HorizontalSize(50)
    }

})