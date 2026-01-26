import { Text, View, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Button, Header, ScreenTopImage } from '../../Components';
import { AppData, Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';
import gstyles from '../../styles';

const { benifitsList } = AppData;


const ProfileViewSubscription = () => {

    const Benifit = ({ item }) => (
        <View style={styles.benefittextContainer}>
            <Text allowFontScaling={false} style={styles.bullet}>•</Text>
            <Text allowFontScaling={false} style={styles.benefit}>{item?.title}</Text>
        </View>
    )

    const subscribe = () => {
        NavigationService.navigate('PaymentGateway')
    }

    return (
        <View style={gstyles.container}>
            <Header back={true} title={'Profile View Subscription'} isIcon={false} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                        <ScreenTopImage image={Images.profileViewSubscription}  size={190} rounded={false} />
                    </View>
                    <Text allowFontScaling={false} style={styles.title}>{'Benefits'}</Text>
                    <View style={gstyles.marginVertical20}>
                        {
                            benifitsList?.map((item, i) => <Benifit item={item} key={i} />)
                        }
                    </View>
                </View>
                <View style={gstyles.marginVertical40}>
                    <Button buttonText='Get Package Now' onPress={subscribe} />
                </View>
            </ScrollView>
        </View>
    )
}

export default ProfileViewSubscription

const styles = StyleSheet.create({
    benefittextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: Metrix.HorizontalSize(20),
        marginVertical: Metrix.VerticalSize(10),

    },
    benefit: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratRegular,
        color: Colors.white,
    },
    title: {
        fontSize: Metrix.customFontSize(22),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
    },
    bullet: {
        marginRight: Metrix.HorizontalSize(10),
        marginTop: Metrix.VerticalSize(-16),
        fontSize: 40,
        color: Colors.white,
    },
});