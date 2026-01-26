import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Header, ScreenTopImage } from '../../Components';
import { Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';
import gstyles from '../../styles';

const UnlockAccess = () => {
    return (
        <View style={gstyles.container}>
      <Header back={true} title={''} isIcon={false} />

            <View style={styles.container}>
                <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                    <ScreenTopImage image={Images.accessLock} size={200} rounded={false} />
                </View>
                <Text allowFontScaling={false} style={[styles.title, { color: Colors.blue }]}>{'Unlock Access'}</Text>

                <View style={gstyles.marginVertical30}>
                    <Text allowFontScaling={false} style={styles.successMessage}>Unlock the Artist Profile to reveal exclusive posts and live streaming content</Text>
                </View>
                <View style={gstyles.paddingHorizontal10}>
                    <View style={gstyles.marginTop70}>
                        <Button buttonText='View Artist Profile' onPress={() => { NavigationService.navigate('SuccessfulAccessPayment') }} />
                    </View>
                    <View style={gstyles.marginVertical15}>
                        <Button buttonText='Enjoy Video Streaming' onPress={() => { NavigationService.navigate('SuccessfulAccessPayment') }} />
                    </View>
                </View>

            </View>
        </View>
    )
}
// popup, 2 btns 
// view trial video => already one 
//View Propfile -> artist profi;e
// remove visep streaming
// follow click redirect new screen of subs plan
// Streaming
//Video Unlock
//Message


export default UnlockAccess

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: Metrix.HorizontalSize(20)
    },
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