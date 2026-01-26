import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import gstyles from '../../styles';
import {Button, TextField, AuthHeader, ScreenTopImage} from '../../Components';
import {Icons, Metrix, NavigationService, Colors} from '../../Config';
import {ToastError, emailValidityCheck} from '../../Config/Helper';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {useTranslation} from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState('email');

  const dispatch = useDispatch();
  const {t} = useTranslation();

  const handleFocus = field => {
    setFocusedField(field);
  };

  const onPress = () => {
    if (!email) {
      return Toast.show(ToastError(t('EMAIL_ADDRESS_IS_REQUIRED')));
    }

    if (!emailValidityCheck(email)) {
      return Toast.show(ToastError(t('EMAIL_ADDRESS_IS_NOT_CORRECT')));
    }

    const data = {email_address: email.toLowerCase()};
    dispatch(AuthMiddleware.ForgotPassword(data));
  };

  return (
    <ScrollView style={gstyles.container}>
      <AuthHeader
        onPress={() => NavigationService.goBack()}
        greeting={t('FORGOT_PASSWORD_RESET')}
        title={t('ENTER_YOUR_EMAIL')}
      />

      <View style={gstyles.marginVertical40}>
        <View style={[gstyles.justifyAlignCenter]}>
          <ScreenTopImage
            image={Images.changePassword}
            size={250}
            rounded={false}
            resizeMode="contain"
          />
        </View>

        <View style={gstyles.marginBottom20}>
          <TextField
            value={email}
            placeholder="Info@mail.com"
            label={t('EMAIL_ADDRESS')}
            focused={focusedField === 'email'}
            onFocus={() => handleFocus('email')}
            onChangeText={text => setEmail(text)}
            icon={
              <Icons.EvilIcons
                name={'envelope'}
                color={Colors.blue}
                size={Metrix.customFontSize(28)}
              />
            }
          />
        </View>
        <View style={gstyles.marginTop20}>
          <Button buttonText={t('CONTINUE')} onPress={onPress} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
