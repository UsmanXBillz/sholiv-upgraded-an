import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors, Icons, Images, Metrix } from '../Config';
import { capitalize, fonts } from '../Config/Helper';
import ScreenTopImage from './ScreenTopImage';

const CompetitionHeader = ({
    count,
    leaveSession,
    creatorImage,
    creatorName,
    competitionTitle
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <ScreenTopImage image={creatorImage ? creatorImage : Images.userPlaceholder} size={50} rounded={true} style={styles.profileImage} />
                <View style={styles.creatorInfo}>
                    <Text allowFontScaling={false} style={styles.artistName}>{capitalize(creatorName)}</Text>
                    <Text allowFontScaling={false} style={styles.artistName}>{capitalize(competitionTitle)}</Text>
                </View>
            </View>
            <View style={styles.liveCountSection}>
                <View style={styles.liveCountContainer}>
                    <Icons.Feather name={'eye'} size={Metrix.customFontSize(22)} color={Colors.white} />
                    <Text allowFontScaling={false} style={styles.liveCountText}>{count}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    console.warn("asdsafsdfds");
                    leaveSession();
                }}>
                    <Icons.AntDesign name={'close'} size={Metrix.customFontSize(22)} color={Colors.red} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CompetitionHeader

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Metrix.HorizontalSize(10),
        paddingVertical: Metrix.VerticalSize(10),
        marginTop: Metrix.VerticalSize(20),
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    profileImage: {
        borderRadius: 100,
        marginRight: Metrix.HorizontalSize(22)
    },
    creatorInfo: {
        marginLeft: Metrix.HorizontalSize(-10),
        marginTop: Metrix.VerticalSize(4)
    },
    artistName: {
        fontSize: Metrix.customFontSize(16),
        fontFamily: fonts.MontserratSemiBold,
        color: Colors.white
    },
    status: {
        fontSize: Metrix.customFontSize(14),
        fontFamily: fonts.RubikRegular,
        color: Colors.status
    },
    liveCountSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveCountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Colors.liveColorCode,
        // padding: Metrix.VerticalSize(8),
        // borderRadius:8
    },
    liveCountText: {
        fontSize: Metrix.customFontSize(14),
        fontFamily: fonts.RubikRegular,
        color: Colors.white,
        marginLeft: Metrix.HorizontalSize(5)
    },
    closeIcon: {
        marginLeft: Metrix.HorizontalSize(30),
        // backgroundColor: Colors.liveColorCode,
        // padding: Metrix.VerticalSize(8),
        // borderRadius:8

    },
    badgeContainer: {
        position: 'absolute',
        top: -2,
        left: 38,
        backgroundColor: 'red',
        paddingHorizontal: Metrix.HorizontalSize(12),
        paddingVertical: Metrix.VerticalSize(2),
        borderRadius: 4,
        zIndex: 1
    },
    badgeText: {
        color: Colors.white,
        fontSize: Metrix.customFontSize(12),
        fontFamily: fonts.MontserratSemiBold
    }
});
