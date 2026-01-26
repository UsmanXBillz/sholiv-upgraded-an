import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Colors, Metrix } from '../Config';
import gstyles from '../styles';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { fonts } from '../Config/Helper';

const CreateAccModalBody = ({onClose, onContinue, title}) => {
    const { t } = useTranslation();
    return (
        <View>
            <View style={styles.modalContentContainer} >
                <Text allowFontScaling={false} style={styles.modalMessage}>{t(title)}</Text>
                <View style={gstyles.spacedBetweenRow}>

                    <View style={gstyles.width48}>
                        <Button buttonText={t('CANCEL')} onPress={onClose} btnStyle={gstyles.paddingVertical12} />
                    </View>
                    <View style={gstyles.width48}>
                        <Button buttonText={t('CONTINUE')} onPress={onContinue} btnStyle={gstyles.paddingVertical12} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default CreateAccModalBody

const styles = StyleSheet.create({
    modalContentContainer: {
        backgroundColor: Colors.black,
        borderWidth: 0.6,
        borderColor: Colors.backgroundGrayDark,
        opacity: 0.8,
        justifyContent: 'center',
        paddingHorizontal: Metrix.HorizontalSize(20),
        height: Metrix.VerticalSize(220),
        borderRadius: 40
    },
    modalMessage: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        textAlign: 'center',
        marginTop: Metrix.VerticalSize(0),
        marginBottom: Metrix.VerticalSize(35)
    }
})