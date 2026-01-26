import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, ScreenTopImage } from '../../Components';
import { Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';
import gstyles from '../../styles';

const SuccessfulAccessPayment = ({route}) => {
  const id = route?.params?.id;

    return (
        <View style={gstyles.container}>
            <View style={styles.container}>
            <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                    <ScreenTopImage image={Images.accessPaymentSuccessful}  size={200} rounded={false} resizeMode='contain' />
                </View>
                <Text allowFontScaling={false} style={styles.title}>Payment Successful</Text>

                <View style={[gstyles.marginVertical15, gstyles.paddingHorizontal10]}>
                    <Text allowFontScaling={false} style={styles.message}>Your amount has been deducted from your wallet</Text>
                </View>

                <View style={[gstyles.marginTop70, gstyles.paddingHorizontal10]}>
                    <Button buttonText='Continue' onPress={() => { NavigationService.navigate('ArtistProfile', { id }) }} />
                </View>
            </View>
        </View>
    )
}

export default SuccessfulAccessPayment;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: Metrix.HorizontalSize(20)
    },
    message: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratRegular,
        color: Colors.white,
        textAlign: 'center'
    },
    title: {
        fontSize: Metrix.customFontSize(24),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        textAlign: 'center',
        color: Colors.blue 
    }
})