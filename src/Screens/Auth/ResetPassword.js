import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import gstyles from '../../styles';
import { Button, TextField, AuthHeader } from '../../Components';
import { Icons, Metrix, NavigationService, Colors } from '../../Config';
import { ToastError, passwordValidityCheck } from '../../Config/Helper';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
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

const ResetPassword = () => {
  
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('newPassword');


  const update = () => {

    if (!newPassword || !confirmPassword) {
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
    const data = {password: newPassword, confirm_password: confirmPassword};
    dispatch(AuthMiddleware.SetNewPassword(data, t));
  }

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  return (
    <View style={gstyles.container}>

      <AuthHeader onPress={() =>  NavigationService.resetStack('AuthStack')} greeting={t('RESET_PASSWORD')} title={t('ENTER_NEW_PASSWORD')} />

      {!passwordValidityCheck(newPassword) && <Toast config={toastConfig} />}

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={gstyles.marginVertical60}>
          <View style={gstyles.marginBottom10}>
            <TextField
              value={newPassword}
              placeholder='**************'
              label={t('NEW_PASSWORD')}
              focused={focusedField === 'newPassword'}
              onFocus={() => handleFocus('newPassword')}
              onChangeText={(text) => setNewPassword(text)}
              icon={<Icons.EvilIcons name={'lock'} color={Colors.blue} size={Metrix.customFontSize(28)} />}
              postIcon={
                <TouchableOpacity onPress={() => setSeeNewPassword(!seeNewPassword)}>
                  <Icons.Feather name={seeNewPassword ? 'eye' : 'eye-off'} color={Colors.blue} size={Metrix.customFontSize(20)} />
                </TouchableOpacity>
              }
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
              postIcon={
                <TouchableOpacity onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}>
                  <Icons.Feather name={seeConfirmPassword ? 'eye' : 'eye-off'} color={Colors.blue} size={Metrix.customFontSize(20)} />
                </TouchableOpacity>
              }
              secureTextEntry={!seeConfirmPassword}
            />
          </View>

          <View style={gstyles.marginTop40}>
            <Button buttonText={'UPDATE'} onPress={update} />
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

export default ResetPassword

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