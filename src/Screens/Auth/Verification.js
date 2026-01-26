import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import gstyles from '../../styles';
import { Button, AuthHeader } from '../../Components';
import { Metrix, NavigationService, Colors } from '../../Config';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { ToastSuccess, fmtMSS, fonts } from '../../Config/Helper';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { AuthMiddleware } from '../../Redux/Middlewares';
import { useTranslation } from 'react-i18next';

const Verification = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const resentTimes = useRef(1);

  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [resendButtonEnableTimer, setResetButtonEnableTimer] = useState(10);

  useEffect(() => {

    let myInterval = setInterval(() => {
      setResetButtonEnableTimer(resendButtonEnableTimer => resendButtonEnableTimer - 1);
    }, 1000);
    return () => {
      clearInterval(myInterval);
      clearInterval(resentTimes.current);
    }
  }, []);

  const verificaton = () => {
    Keyboard.dismiss();
    if (code?.length < 4) {
      return setIsValid(false)
    }
    const payload = { OTP: code };
    dispatch(AuthMiddleware.VerifyOtpForgotPassword({ payload, cb: () => NavigationService.navigate('ResetPassword'), t }));

  }

  const resendOTP = () => {
    resentTimes.current += 1;

    dispatch(
      AuthMiddleware.ResendOTP({
        cb: () => {
          Toast.show(ToastSuccess(t('OTP_RESEND_SUCCESSFULLY')));
          setResetButtonEnableTimer(resentTimes.current == 2 ? 60 : 300);
        },
      }),
    );
  };

  return (
    <View style={gstyles.container}>

      <AuthHeader onPress={() => NavigationService.resetStack("AuthStack")} greeting={t('VERIFICATION_CODE')} title={t('ENTER_VERIFICATION_CODE')} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View style={gstyles.marginTop70}>

            {!isValid && <Text allowFontScaling={false} style={styles.verificationError}>{t('VERIFICATION_CODE_INVALID')}</Text>}
            <OTPInputView
              style={styles.verificationTextInputContainer}
              pinCount={4}
              codeInputFieldStyle={!isValid ? [styles.verificationOtpTextInputStyle, styles.invalidInputStyle] : styles.verificationOtpTextInputStyle}
              autoFocusOnLoad={false}
              onFocus={() => {
                console.warn("hi");
              }}
              onCodeChanged={val => {
                setCode(val)
                setIsValid(true)
              }}
              keyboardType="phone-pad"
              codeInputHighlightStyle={{
                borderColor: '#D9FCB1',
                borderWidth: 0.5,
              }}
            />
          </View>

          <View style={gstyles.marginTop40}>
            <Button buttonText={t('CONTINUE')} onPress={verificaton} />
            <View style={[gstyles.centeredAlignedRow, gstyles.marginVertical20]}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>{t('DONT_GET_CODE')}
              </Text>
              <TouchableOpacity onPress={resendOTP} >
                <Text allowFontScaling={false} style={styles.resend}>{resendButtonEnableTimer > 0 ? fmtMSS(resendButtonEnableTimer) : t('RESEND_CODE')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default Verification

const styles = StyleSheet.create({
  verificationTextInputContainer: {
    marginVertical: Metrix.VerticalSize(40),
    height: Metrix.VerticalSize(48),
  },
  verificationOtpTextInputStyle: {
    backgroundColor: Colors.carbonBlack,
    borderRadius: 8,
    color: Colors.placeholder,
    height: Metrix.VerticalSize(80),
    width: Metrix.HorizontalSize(70),
    marginHorizontal: Metrix.HorizontalSize(5),
    borderWidth: 1,
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(26),
    borderColor: Colors.carbonBlack,
  },
  resend: {
    color: Colors.blue,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(16),
    marginLeft: Metrix.VerticalSize(10),
    textDecorationLine: 'underline',
    marginTop: Metrix.VerticalSize(0)
  },
  invalidInputStyle: {
    borderColor: Colors.validationRed
  },
  verificationError: {
    color: Colors.validationRed,
    textAlign: 'center',
    fontFamily: fonts.LatoBold,
    fontSize: Metrix.customFontSize(16),
    marginVertical: Metrix.VerticalSize(20)
  }
})