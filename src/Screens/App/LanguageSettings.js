import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import gstyle from '../../styles';
import { Header } from '../../Components';
import { AppData, Colors, Icons, Metrix } from '../../Config';
import { fonts } from '../../Config/Helper';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from '../../Redux/Actions';
import i18next from '../../../services/i18next';

const { languageSettingsData } = AppData;

const LanguageSettings = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const selectedLanguage = useSelector(state => state?.AuthReducer?.language);

    const [data, setData] = useState(languageSettingsData);

    const toggleSwitch = (label) => {
        dispatch(AuthAction.Updatelanguage(label));
        i18next.changeLanguage(label)
    };

    return (
        <View style={gstyle.container}>
            <Header back={true} title={t('CHANGE_LANGUAGE')} isIcon={false} />
            <View style={styles.settingsListContainer}>
                {data?.map((val, index) => (
                    <View key={index} style={styles.settingsTabContainer}>
                        <Text allowFontScaling={false} style={styles.settingsText}>{t(val?.name)}</Text>
                        <TouchableOpacity onPress={() => toggleSwitch(val?.label)}>
                            <Icons.Fontisto
                                name={selectedLanguage == val?.label ? 'toggle-on' : 'toggle-off'}
                                color={selectedLanguage == val?.label ? Colors.blue : Colors.toggleOff}
                                size={Metrix.customFontSize(33)}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default LanguageSettings;

const styles = StyleSheet.create({
    settingsListContainer: {
        marginTop: Metrix.VerticalSize(70),
    },
    settingsTabContainer: {
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderColor: Colors.borderColorLight,
        paddingHorizontal: Metrix.HorizontalSize(10),
        paddingVertical: Metrix.VerticalSize(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    settingsText: {
        color: Colors.white,
        fontFamily: fonts.MontserratBold,
        fontSize: Metrix.customFontSize(16),
    },
});
