import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { Colors, Icons, Metrix, NavigationService } from '../Config';
import { fonts } from '../Config/Helper';
import gstyles from '../styles';
import { useTranslation } from 'react-i18next';

const LiveHeader = ({
    back = true,
    goBackFunc = () => NavigationService.goBack(),
    backBtnColor = Colors.white,
    title,
    handleOptionsToggle,
    isVisible,
    uploadPost = () => { }
}) => {

    const { t } = useTranslation();

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    {back && (
                        <TouchableOpacity
                            style={{ marginRight: Metrix.HorizontalSize(20) }}
                            onPress={goBackFunc}
                            activeOpacity={0.7}>
                            <Icons.AntDesign
                                name={'arrowleft'}
                                color={Colors.blue}
                                size={Metrix.customFontSize(28)}
                            />
                        </TouchableOpacity>
                    )}
                    <Pressable style={isVisible && styles.titletextWrapper} onPress={handleOptionsToggle}>
                        <View style={gstyles.spacedBetweenRow}>
                            {title && <Text allowFontScaling={false} style={[styles.titleText, { color: backBtnColor }]}>{t(title)}</Text>}
                            <View style={styles.caretdown}>
                                <Icons.AntDesign
                                    name={'caretdown'}
                                    color={Colors.white}
                                    size={Metrix.customFontSize(14)}
                                />
                            </View>
                        </View>
                    </Pressable>
                </View>
                <TouchableOpacity onPress={uploadPost}>
                    <Text allowFontScaling={false} style={[styles.titleText, { color: Colors.blue }]}>{ title == 'START_LIVE' ? t("GO_LIVE") :  t('POST')}</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default memo(LiveHeader);

const styles = StyleSheet.create({
    container: {
        paddingTop: Metrix.VerticalSize(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: fonts.MontserratSemiBold,
        fontSize: Metrix.customFontSize(16),
        paddingLeft: Platform.OS === 'ios' ? 0 : Metrix.HorizontalSize(20)
    },
    titletextWrapper: {
        backgroundColor: Colors.optionsBox,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        paddingLeft: Platform.OS === 'ios' ? 20 : 0,
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        width: Metrix.HorizontalSize(Platform.OS === 'ios' ? 184 : 154),
    },
    caretdown: {
        marginLeft: Metrix.HorizontalSize(30),
        paddingRight: Metrix.HorizontalSize(10)

    }
});
