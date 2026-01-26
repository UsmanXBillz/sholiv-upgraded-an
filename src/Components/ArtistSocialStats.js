import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { Metrix, NavigationService } from '../Config';
import { fonts } from '../Config/Helper';
import gstyles from '../styles';
import { useTranslation } from 'react-i18next';

const ArtistSocialStats = ({ post, Follwers, Following, style = {}, data }) => {
    const { t } = useTranslation();

    const handleOnPress = (item) => {
        NavigationService.navigate('ArtistStats', { name: data?.name ?? data?.username, id: data?.id, selectedTab: item })
    }

    return (
        <View style={[styles.container, { ...style }]}>
            <TouchableOpacity disabled={true}>
                <Text allowFontScaling={false} style={styles.artistName}>{post ?? '0'}</Text>
                <Text allowFontScaling={false} style={[styles.artistDescription, gstyles.marginTop5]}>{t('POSTS')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOnPress(0)}>
                <Text allowFontScaling={false} style={styles.artistName}>{Follwers ?? '0'}</Text>
                <Text allowFontScaling={false} style={[styles.artistDescription, gstyles.marginTop5]}>{t('FOLLOWERS')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOnPress(1)}>
                <Text allowFontScaling={false} style={styles.artistName}>{Following ?? '0'}</Text>
                <Text allowFontScaling={false} style={[styles.artistDescription, gstyles.marginTop5]}>{t('FOLLOWING')}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default memo(ArtistSocialStats)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginVertical: Metrix.VerticalSize(25)
    },
    artistDescription: {
        fontSize: Metrix.customFontSize(14),
        fontFamily: fonts.MontserratRegular,
        color: Colors.white,
        textAlign: 'center',
    },
    artistName: {
        fontSize: Metrix.customFontSize(18),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        textAlign: 'center'
    }
})