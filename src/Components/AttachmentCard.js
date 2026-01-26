
import { View,Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, Icons, Metrix } from '../Config';

const AttachmentCard = ({ item, index, onPress }) => {

    const renderImageAttachment = () => (
        <View style={styles.imageAttachmentContainer}>
            <TouchableOpacity hitSlop={{ bottom: 5, left: 5, right: 5, top: 5 }} style={styles.attachmentCrossButton} onPress={() => onPress(index)}>
                <Icons.Entypo name='cross' size={Metrix.customFontSize(16)} />
            </TouchableOpacity>
            <Image source={{ uri: item?.path }} resizeMode={'cover'} style={styles.attachmentImage} />
        </View>
    );

    return renderImageAttachment();
};

export default AttachmentCard;


const styles = StyleSheet.create({

    imageAttachmentContainer: {
        width: Metrix.HorizontalSize(110),
        borderRadius: 12,
        height: Metrix.VerticalSize(120),
        marginTop: Metrix.VerticalSize(10),
    },
    attachmentWrapper: {
        paddingRight: Metrix.HorizontalSize(10),
        marginTop: Metrix.VerticalSize(10)
    },
    attachmentImage: {
        width: '90%',
        borderRadius: 12,
        height: '90%',
    },
    attachmentCrossButton: {
        position: 'absolute',
        top: Metrix.VerticalSize(2),
        right: Metrix.HorizontalSize(2),
        borderRadius: 50,
        backgroundColor: Colors.white,
        zIndex: 100,
        // backgroundColor: Colors.inputBg
      },
})