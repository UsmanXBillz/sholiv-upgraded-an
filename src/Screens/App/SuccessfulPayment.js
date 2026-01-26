import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, ScreenTopImage } from '../../Components';
import { Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';
import gstyles from '../../styles';
import { useTranslation } from 'react-i18next';

export default function SuccessfulPayment({route}) {

    const { t } = useTranslation();

    const plan = route?.params?.plan;

    const explore = () => {
        NavigationService.resetStack('UserStack');
    }

    return (
        <View style={gstyles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View >
                    <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                        <ScreenTopImage image={Images.paymentSuccess} size={100} rounded={false} resizeMode='contain' />
                    </View>
                    <Text allowFontScaling={false} style={styles.title}>{t('PAYMENT_SUCCESSFUL')}</Text>
                    <View style={gstyles.marginVertical30}>
                        <Text allowFontScaling={false} style={styles.successMessage}>{t('SUCCESS_PAYMENT_COMPLETE')} {plan?.name} {t('THANKS_CHOOSING_US')}</Text>
                    </View>
                    <Text allowFontScaling={false} style={styles.title}>{'Amount Paid : '}
                        <Text allowFontScaling={false} style={[styles.title, { color: Colors.blue }]}>$ {plan?.price}</Text>
                    </Text>
                    <View style={[gstyles.marginTop70, gstyles.paddingHorizontal10]}>
                        <Button buttonText='START_EXPLORING' onPress={explore} />
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    successMessage: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratRegular,
        color: Colors.white,
        textAlign: 'center'
    },
    title: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        textAlign: 'center'
    }
})