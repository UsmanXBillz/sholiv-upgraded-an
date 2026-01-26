import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Colors, Icons, Images, Metrix } from '../Config';
import { fonts, formatAmount } from '../Config/Helper';
import { useTranslation } from 'react-i18next';

const BalanceCard = ({ balance }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.title}>{t('REMAINING_BALANCE')}</Text>
                <Icons.AntDesign name={'caretdown'} color={Colors.blue} size={Metrix.customFontSize(14)} />
            </View>
            <View style={styles.amountContainer}>
                <Text allowFontScaling={false} style={styles.amount}>${balance !== undefined ? formatAmount(balance) : '0'}</Text>
                <Image source={Images.coins} />
            </View>
        </View>
    )
}
export default memo(BalanceCard);

const styles = StyleSheet.create({

    title: {
        marginRight: Metrix.HorizontalSize(16),
        fontFamily: fonts.MontserratSemiBold,
        fontSize: Metrix.customFontSize(18),
        color: Colors.black
    },
    amount: {
        marginRight: Metrix.HorizontalSize(16),
        fontFamily: fonts.MontserratSemiBold,
        fontSize: Metrix.customFontSize(34),
        color: Colors.black
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Metrix.VerticalSize(Platform.OS === 'android' ? -8 : 6)
    },
    container: {
        backgroundColor: Colors.white,
        paddingVertical: Metrix.VerticalSize(30),
        paddingHorizontal: Metrix.HorizontalSize(20),
        borderRadius: 16
    }

})