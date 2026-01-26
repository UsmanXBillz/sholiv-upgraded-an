import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors, Icons, Metrix } from '../Config';
import { fonts } from '../Config/Helper';
import gstyles from '../styles';
import { MultiSelect } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

const MultiChoiceDropdown = ({ selected, artistType, setSelected }) => {

    const { t } = useTranslation();

    const renderMultiSelect = (item) => {
        return (
            <View style={styles.itemText}>
                <Text allowFontScaling={false} style={{ fontSize: Metrix.customFontSize(14), color: Colors.white, fontFamily: fonts.MontserratRegular }}>{item?.label}</Text>
            </View>
        )
    }

    return (
        <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={artistType}
            labelField="label"
            valueField="value"
            placeholder={t('SELECT_ITEM')}
            searchPlaceholder={t('SEARCH')}
            containerStyle={{ backgroundColor: Colors.carbonBlack, borderColor: Colors.carbonBlack, borderRadius: 10 }}
            itemContainerStyle={{ backgroundColor: 'transparent' }}
            activeColor={Colors.blue}
            itemTextStyle={{ color: Colors.white, fontSize: Metrix.customFontSize(14), }}
            value={selected}
            onChange={item => {
                setSelected(item);
            }}
            renderItem={renderMultiSelect}
            renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)} style={gstyles.marginTop10}>
                    <View style={styles.selectedCategories}>
                        <Text allowFontScaling={false} style={{
                            marginRight: Metrix.HorizontalSize(10),
                            fontSize: Metrix.customFontSize(14), color: Colors.white, fontFamily: fonts.MontserratRegular
                        }}>{item.label}</Text>
                        <Icons.Entypo
                            style={styles.icon}
                            color={Colors.white}
                            name="cross"
                            size={Metrix.VerticalSize(18)}
                        />
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

export default MultiChoiceDropdown

const styles = StyleSheet.create({

    dropdown: {
        marginTop: Metrix.VerticalSize(10),
        width: '100%',
        paddingRight: Metrix.VerticalSize(5),
        paddingLeft: Metrix.VerticalSize(15),
        height: Metrix.VerticalSize(50),
        backgroundColor: Colors.carbonBlack,
        borderRadius: 15,
    },
    placeholder: {
        color: Colors.dropdownPlaceholder,
        fontFamily: fonts.RubikRegular,
    },
    selectedTextStyle: {
        color: Colors.placeholder,
        fontSize: Metrix.customFontSize(14),
        backgroundColor: Colors.red,
    },
    inputSearchStyle: {
        height: Metrix.VerticalSize(40),
        borderRadius: 5,
        backgroundColor: Colors.carbonBlack,
        color: Colors.white,
    },
    iconStyle: {
        marginRight: Metrix.HorizontalSize(12),
    },
    selectedStyle: {
        backgroundColor: Colors.blue,
    },
    selectedCategories: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 0.1,
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    itemText: {
        padding: Metrix.VerticalSize(18),
    }
})


