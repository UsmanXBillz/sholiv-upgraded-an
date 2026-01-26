import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import gstyles from '../../styles';
import { Button, Header, ScreenTopImage } from '../../Components';
import { Colors, Images, Metrix, NavigationService } from '../../Config';
import { fonts } from '../../Config/Helper';

const PasswordUpdated = ({ route }) => {
    const { screen } = route?.params || {};
    console.warn(screen);

    const onClose = () => {
        screen === 'changePassword' ?  NavigationService.navigate('Settings'):  NavigationService.resetStack('UserStack')
    }
    return (
        <View style={gstyles.container}>
            <Header back={!screen} title={ screen === 'changePassword' ? 'Change Password' : ''} icon={screen ? 'close' : 'setting'} iconPress={onClose}/>
            <View style={styles.container}>
                <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
                    <ScreenTopImage image={Images.passwordUpdate} size={150} rounded={false} />
                </View>
                <Text allowFontScaling={false} style={[styles.title, { color: Colors.blue }]}>{screen === 'editprofile' ? 'Profile' : 'Password'} Updated</Text>
                <View style={[gstyles.marginVertical10, gstyles.paddingHorizontal30]}>
                    <Text allowFontScaling={false} style={styles.successMessage}>Your profile has been updated successfully</Text>
                </View>
                {
                    screen === 'editprofile' &&
                    <View style={gstyles.marginVertical60}>
                        <Button buttonText='Enjoy' onPress={onClose} />
                    </View>
                }
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: Metrix.HorizontalSize(20),
        flex: 1
    },
    successMessage: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratMedium,
        color: Colors.white,
        textAlign: 'center'
    },
    title: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        textAlign: 'center'
    }
});

export default PasswordUpdated;
