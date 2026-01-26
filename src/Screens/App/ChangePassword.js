import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import gstyles from '../../styles';
import { Button, Header, ScreenTopImage, TextField } from '../../Components';
import { Icons, Images, Metrix, NavigationService } from '../../Config';
import Toast from 'react-native-toast-message';
import { ToastError, passwordValidityCheck } from '../../Config/Helper';
import { useDispatch } from 'react-redux';
import { AuthMiddleware } from '../../Redux/Middlewares';
import { useTranslation } from 'react-i18next';


const toastConfig = {
  tomatoToast: ({ props }) => (
    <View style={styles.customPasswordToast}>
      <Text allowFontScaling={false} style={{
        fontSize: 12, fontWeight: "bold", marginBottom: 2, color: '#000'
      }}>{props.text1
        }</Text>
      <Text allowFontScaling={false} style={{ fontSize: 10, margin: 0, color: '#979797' }}>{props.text2}</Text>
    </View>
  )
};

const ChangePassword = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [seeOldPassword, setseeOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('oldPassword');

  const update = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Toast.show(ToastError(t('ALL_FIELDS_REQUIRED')));
    }

    if (!passwordValidityCheck(newPassword)) {
      return Toast.show({
        type: 'tomatoToast',
        props: {
          text1: 'Error',
          text2: t('PASSWORD_REQUIREMENTS')
        }
      });
    }
    if (newPassword !== confirmPassword) {
      return Toast.show(ToastError(t('PASSWORDS_MUST_BE_SAME')));
    }

    const data = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmPassword
    }
    console.warn(data);
    const cb = () => {
      NavigationService.navigate('PasswordUpdated', { screen: 'changePassword' });
    }
    dispatch(AuthMiddleware.ChangePassword({ payload: data, cb }))

  }

  const handleFocus = (field) => setFocusedField(field);

  const PasswordToggleIcon = ({ onPress, visible }) => (
    <TouchableOpacity onPress={onPress}>
      <Icons.Feather name={visible ? 'eye' : 'eye-off'} color={Colors.blue} size={Metrix.customFontSize(20)} />
    </TouchableOpacity>
  );

  return (
    <View style={gstyles.container}>

      <Header back={true} title={t('CHANGE_PASSWORD')} icon='setting' disabled={true} />

      {!passwordValidityCheck(newPassword) && <Toast config={toastConfig} />}

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={[gstyles.justifyAlignCenter]}>
          <ScreenTopImage image={Images.changePassword} size={250} rounded={false} />
        </View>

        <View style={{ marginTop: Metrix.VerticalSize(-40) }}>
          <View style={gstyles.marginBottom10}>
            <TextField
              value={oldPassword}
              placeholder='**************'
              label={t('OLD_PASSWORD')}
              focused={focusedField === 'oldPassword'}
              onFocus={() => handleFocus('oldPassword')}
              onChangeText={(text) => setOldPassword(text)}
              icon={<Icons.EvilIcons name={'lock'} color={Colors.blue} size={Metrix.customFontSize(28)} />}
              postIcon={<PasswordToggleIcon onPress={() => setseeOldPassword(!seeOldPassword)} visible={seeOldPassword} />}
              secureTextEntry={!seeOldPassword}
            />
          </View>

          <View style={gstyles.marginVertical20}>
            <TextField
              value={newPassword}
              placeholder='**************'
              label={t('NEW_PASSWORD')}
              focused={focusedField === 'newPassword'}
              onFocus={() => handleFocus('newPassword')}
              onChangeText={(text) => setNewPassword(text)}
              icon={<Icons.EvilIcons name={'lock'} color={Colors.blue} size={Metrix.customFontSize(28)} />}
              postIcon={<PasswordToggleIcon onPress={() => setSeeNewPassword(!seeNewPassword)} visible={seeNewPassword} />}
              secureTextEntry={!seeNewPassword}
            />
          </View>

          <View style={gstyles.marginVertical20}>
            <TextField
              value={confirmPassword}
              placeholder='**************'
              label={t('CONFIRM_PASSWORD')}
              focused={focusedField === 'confirmPassword'}
              onFocus={() => handleFocus('confirmPassword')}
              onChangeText={(text) => setConfirmPassword(text)}
              icon={<Icons.EvilIcons name={'lock'} color={Colors.blue} size={Metrix.customFontSize(28)} />}
              postIcon={<PasswordToggleIcon onPress={() => setSeeConfirmPassword(!seeConfirmPassword)} visible={seeConfirmPassword} />}
              secureTextEntry={!seeConfirmPassword}
            />
          </View>
          <View style={gstyles.marginVertical20}>
            <Button buttonText='UPDATE' onPress={update} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ChangePassword;

const styles = StyleSheet.create({
  image: {
    width: Metrix.HorizontalSize(250),
    height: Metrix.VerticalSize(250)
  },
  customPasswordToast: {
    height: 'auto',
    width: '90%',
    backgroundColor: "white",
    paddingHorizontal: Metrix.HorizontalSize(20),
    paddingVertical: Metrix.VerticalSize(10),
    borderRadius: 6,
    borderColor: "#FE6301",
    borderLeftWidth: 5,
  }
});