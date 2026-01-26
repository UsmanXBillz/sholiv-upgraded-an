import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { Colors, Icons, Metrix, NavigationService } from '../Config';
import { fonts } from '../Config/Helper';
import gstyles from '../styles';
import { useTranslation } from 'react-i18next';

const AttachmentContainer = ({selectImages, openCamera, openVideoCam, type}) => {

    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text allowFontScaling={false} style={[gstyles.captionText, { color: Colors.white }]}> {t('GALLERY')}</Text>
            <View style={styles.attachmentOptionsContainer}>
                <TouchableOpacity style={styles.selectTextContainer} onPress={selectImages}>
                    <Text allowFontScaling={false} style={styles.selectText}>{type == 3 ? t('SELECT_VIDEO') : type == 0 ? t('SELECT_IMAGE') : t('SELECT_MULTIPLES')}</Text>
                </TouchableOpacity>
                {type !== 3 && (<TouchableOpacity style={styles.cameraIconContainer} onPress={openCamera}>
                    <Icons.Feather name={'camera'} color={Colors.white} size={Metrix.customFontSize(18)} />
                </TouchableOpacity>)}
                {type == 1 && (<TouchableOpacity style={styles.videoIconContainer} onPress={openVideoCam}>
                    <Icons.Feather name={'video'} color={Colors.white} size={Metrix.customFontSize(18)} />
                </TouchableOpacity>)}
            </View>
        </View>
    )
}

export default memo(AttachmentContainer)

const styles = StyleSheet.create({
    container: {
        ...gstyles.marginVertical30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    attachmentOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionsBoxText: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white,
        marginLeft: 10
    },
    optionsContainer: {
        marginTop: Metrix.VerticalSize(10),
        backgroundColor: Colors.optionsBox,
        borderColor: Colors.optionsBox,
        borderWidth: 1,
        paddingVertical: Metrix.VerticalSize(8),
        paddingHorizontal: Metrix.HorizontalSize(14),
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 186 : 156),
        position: 'absolute',
        left: Platform.OS === 'ios' ? 60 : 58,
        top: Platform.OS === 'ios' ? 60 : 50,
        zIndex: 1000
    },
    imageContainer: {
        marginVertical: Metrix.VerticalSize(20),
    },
    image: {
        height: 300,
        width: '100%',
        borderRadius: 6,
    },
    selectText: {
        fontFamily: fonts.MontserratMedium,
        fontSize: Metrix.customFontSize(16),
        color: Colors.black,
    },
    selectTextContainer: {
        backgroundColor: Colors.white,
        borderRadius: 50,
        paddingHorizontal: Metrix.HorizontalSize(12),
        paddingVertical: Metrix.VerticalSize(4),
        marginRight: Metrix.HorizontalSize(10),
    },
    cameraIconContainer: {
        backgroundColor: Colors.blue,
        borderRadius: 100,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIconContainer: {
        backgroundColor: Colors.blue,
        borderRadius: 100,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Metrix.HorizontalSize(10)
    },
    textCount: {
        textAlign: "right",
        color: Colors.placeholder,
    },
    textCountContainer: {
        marginTop: Metrix.VerticalSize(5),
        marginRight: Metrix.HorizontalSize(5),
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    videoWrapper: {
        width: '100%',
        height: 300
    },
    zoomContainer: {
        width: '100%',
        alignSelf: 'center',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    buttonHolder: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 8
    }
})