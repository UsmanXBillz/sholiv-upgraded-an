import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import gstyle from '../../styles';
import { Header } from '../../Components';
import { AppData, Colors, Icons, Metrix } from '../../Config';
import { fonts } from '../../Config/Helper';
import { useTranslation } from 'react-i18next';

const { notoficationSettingsData } = AppData;

const NotificationsSetting = () => {

  const { t } = useTranslation();

  const [toggleState, setToggleState] = useState({});
  const [data, setData] = useState(notoficationSettingsData)

  const toggleSwitch = (index) => {
    setToggleState((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  
    const updatedData = [...notoficationSettingsData];
    updatedData[index].status = toggleState[index] ? 'on' : 'off';
    setData(updatedData);
  };

  return (
    <View style={gstyle.container}>
      <Header back={true} title={t('NOTIFICATION_SETTING')} icon='setting' disabled={true}/>
      <View style={styles.settingsListContainer}>
        {data?.map((val, index) => (
          <View key={index} style={styles.settingsTabContainer}>
            <Text allowFontScaling={false} style={styles.settingsText}>{t(val?.name)}</Text>
            <TouchableOpacity onPress={() => toggleSwitch(index)}>
              <Icons.Fontisto
                name={toggleState[index] ? 'toggle-on' : 'toggle-off'}
                color={toggleState[index] ? Colors.blue : Colors.toggleOff} 
                size={Metrix.customFontSize(33)}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default NotificationsSetting;

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
