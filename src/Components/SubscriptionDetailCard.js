import React, { memo } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Colors, Metrix } from '../Config';
import { fonts } from '../Config/Helper';

const SubscriptionDetailCard = ({item}) => {
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ marginRight: 20 }}>
                    <Image source={item?.image} style={styles.subscriptionIcon} />
                </View>
                <View style={{ width: '52%' }}>
                    <Text allowFontScaling={false} style={styles.title}>{item?.title}</Text>
                    <Text allowFontScaling={false} style={styles.details}>{item?.detail}</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Text allowFontScaling={false} style={[styles.priceDetails, {color: item?.pricingColor}]}>{item?.pricePerMonth ?? item.price}</Text>
                    <Text allowFontScaling={false} style={[styles.priceDetails, {color: item?.pricingColor}]}>{item?.pricePerView}</Text>
                </View>
            </View>
        </View>
    )
}

export default memo(SubscriptionDetailCard);

const styles = StyleSheet.create({
    subscriptionIcon: {
        width: Metrix.HorizontalSize(55),
        resizeMode:"contain"
    },
    title: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
    },
    details: {
        fontSize: Metrix.customFontSize(14),
        fontFamily: fonts.RubikLight,
        lineHeight: 18,
        color: Colors.white,
        marginTop:Metrix.VerticalSize(5)
    },
    priceDetails: {
        fontSize: Metrix.customFontSize(14),
        fontFamily: fonts.RubikRegular,
        color: Colors.blue,
        marginBottom:Metrix.VerticalSize(5)
    },

});