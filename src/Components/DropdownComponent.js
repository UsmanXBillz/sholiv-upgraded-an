import React, { memo } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import gstyles from '../styles';
import { Colors, Metrix } from '../Config';
import { fonts } from '../Config/Helper';

function DropdownComponent({
    data = [],
    label = '',
    onChange = () => { },
    preIcon = null,
    search = false,
    selectedValue = '',
    style = {},
    placeholder='Select'

}) {

    return (
        <View style={gstyles.marginVertical10}>
            {label && (
                <Text allowFontScaling={false} style={{ ...gstyles.labelStyle }}>{label}</Text>
            )}
            <Dropdown
                style={[styles.dropdown, {...style}]}
                placeholderStyle={styles.placeholder}
                data={data}
                search={search}
                autoScroll={false}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                searchPlaceholder="Search..."
                value={selectedValue}
                defaultValue={selectedValue}
                onChange={onChange}
                renderLeftIcon={() => preIcon && <Image source={preIcon} style={{ marginRight: Metrix.HorizontalSize(12) }} resizeMode='contain' />}
                containerStyle={{ backgroundColor: Colors.carbonBlack, borderColor: Colors.carbonBlack }}
                itemTextStyle={{ color: Colors.white, fontSize: Metrix.customFontSize(14), }}
                selectedTextStyle={styles.selectedTextStyle}
                iconColor={Colors.blue}
                showsVerticalScrollIndicator={false}
                itemContainerStyle={{ backgroundColor: 'transparent' }}
                activeColor={Colors.blue}
            />
        </View>
    )
}

export default memo(DropdownComponent)


const styles = StyleSheet.create({
    dropdown: {
        marginTop: Metrix.VerticalSize(10),
        width: '100%',
        paddingRight: Metrix.VerticalSize(5),
        paddingLeft: Metrix.VerticalSize(15),
        height: Metrix.VerticalSize(50), backgroundColor: Colors.carbonBlack, borderRadius: 15
    },
    placeholder: {
        color: Colors.placeholder,
        fontFamily: fonts.RubikRegular,
        color: Colors.dropdownPlaceholder
    },
    selectedTextStyle: {
        color: Colors.placeholder,
        fontSize: Metrix.customFontSize(14),
        backgroundColor: Colors.carbonBlack,
    }
})