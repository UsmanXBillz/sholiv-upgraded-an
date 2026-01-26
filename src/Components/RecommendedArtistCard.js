import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { Colors, Icons, Images, Metrix, NavigationService } from '../Config';
import { capitalize, fonts } from '../Config/Helper';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import gstyles from '../styles';

const RecommendedArtistCard = ({ item }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity style={styles.artistContainer} onPress={() => NavigationService.navigate('FreeTrial', { data: item })}>
            <View style={{ padding: Metrix.VerticalSize(14) }}>
                <Text allowFontScaling={false} style={styles.titleText}>{capitalize(item?.username ?? item?.name)}</Text>
                <Text allowFontScaling={false} style={styles.description}>{item?.follower} {t('FOLLOWERS')}</Text>
                <Text allowFontScaling={false} style={styles.description}>{item?.intro_view_count ?? '0'} {t('MONTHLY_VIEWERS')}</Text>
                <View style={styles.trialBtn}>
                    <Button
                        onPress={() => NavigationService.navigate('FreeTrial', { data: item })}
                        buttonText={'TEN_SEC_FREE_TRIAL'}
                        btnStyle={styles.btnStyle}
                        textStyle={styles.textStyle}
                        postIcon={
                            <Icons.AntDesign name={'play'} color={Colors.white} size={Metrix.customFontSize(18)}  style={gstyles.marginLeft10}/>
                        }
                    />
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={item?.profile_pic_URL ? { uri: item?.profile_pic_URL } : Images.userPlaceholder}
                    resizeMode='cover'
                    style={styles.image}
                />
            </View>
        </TouchableOpacity>
    )
}

export default memo(RecommendedArtistCard)

const styles = StyleSheet.create({
    artistContainer: {
        backgroundColor: Colors.inputBg,
        borderRadius: 16,
        marginBottom: Metrix.VerticalSize(14),
        height: Metrix.VerticalSize(184),
    },
    contentContainer: {
        padding: Metrix.VerticalSize(14),
        flex: 1,
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        height: '100%',
        width: Metrix.HorizontalSize(120),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    titleText: {
        fontFamily: fonts.MontserratSemiBold,
        fontSize: Metrix.customFontSize(20),
        color: Colors.white,
        marginBottom: Metrix.VerticalSize(5),
    },
    description: {
        fontFamily: fonts.RubikRegular,
        fontSize: Metrix.customFontSize(14),
        color: Colors.pearlGrey,
        marginTop: Metrix.VerticalSize(5),
    },
    trialBtn: {
        width: '52%',
    },
    textStyle: {
        fontFamily: fonts.MontserratMedium,
        fontSize: Metrix.customFontSize(11)
        
    },
    btnStyle: {
        paddingVertical: Metrix.VerticalSize(8),
        borderRadius: 6,
        marginTop: Metrix.VerticalSize(30),
    },
});
