import { View, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import gstyles from '../../styles';
import { Button, Header, ScreenTopImage, DropdownComponent } from '../../Components';
import { AppData, Colors, Images, Metrix, NavigationService } from '../../Config';
import Toast from 'react-native-toast-message';
import { ToastError } from '../../Config/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from '../../Redux/Actions';
import { useTranslation } from 'react-i18next';

const { categories } = AppData

const SelectCategory = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const tempuser = useSelector(state => state?.AuthReducer?.tempUser);

    const [selectedCategory, setSelectedCategory] = useState(null)

    const selectCategory = (item) => setSelectedCategory(item?.id);

    const onPressNext = () => {
        if (!selectedCategory) {
            return Toast.show(ToastError(t('PLEASE_SELECT_CATEGORY')));
        }
        const updatedData = { ...tempuser?.artist, category: selectedCategory } // this catgeory key needs to be verified with akram
        dispatch(AuthAction.UpdateTempUser({ artist: { ...updatedData } }))
        NavigationService.navigate('SelectCategoryFan');

    }

    return (
        <View style={gstyles.container}>
            <Header back={true} title={t('SELECT_YOUR_CATEGORY')} isIcon={false} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <View>
                    <View style={[gstyles.marginVertical30, gstyles.justifyAlignCenter]}>
                        <ScreenTopImage image={Images.categorySelection} size={Metrix.VerticalSize(220)} rounded={false} resizeMode='contain' />
                    </View>
                    <DropdownComponent label={t('SELECT_YOUR_ARTIST')} data={categories} onChange={selectCategory} preIcon={Images.microphone} />
                </View>
                <View>
                    <Button buttonText={t('NEXT')} onPress={onPressNext} />
                </View>
            </ScrollView>
        </View>
    )
}

export default SelectCategory;

const styles = StyleSheet.create({
    skipButton: {
        backgroundColor: Colors.white,
        marginVertical: Metrix.VerticalSize(12)
    },
    skipButtonText: {
        color: Colors.black
    },
    contentContainerStyle: {
        flex: 1,
        justifyContent: 'space-around'

    }
})
