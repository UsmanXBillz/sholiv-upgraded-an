import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Header} from '../../Components';
import {AppData, Colors, Metrix} from '../../Config';
import gstyle from '../../styles';
import {fonts} from '../../Config/Helper';
import {useTranslation} from 'react-i18next';
import DeleteUserModal from '../../Components/DeletUserModal';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {useDispatch} from 'react-redux';

const {settingsData} = AppData;

const Settings = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const onCancel = () => {
    setIsVisible(false);
  };
  const onDelete = () => {
    const cb = () => {
      onCancel();
    };
    dispatch(AuthMiddleware.DeleteAccount(t, cb));
  };

  return (
    <View style={gstyle.container}>
      <Header back={true} title={t('SETTINGS')} icon="setting" />
      <View style={styles.settingsListContainer}>
        {settingsData?.map((val, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingsTabContainer}
            onPress={
              val.name === 'DELETE_ACCOUNT'
                ? () => setIsVisible(true)
                : val?.onPress
            }>
            <Text allowFontScaling={false} style={styles.settingsText}>{t(val?.name)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <DeleteUserModal
        isVisible={isVisible}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </View>
  );
};

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
  },
  settingsText: {
    color: Colors.white,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(16),
  },
});

export default Settings;
