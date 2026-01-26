import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {AuthHeader, Button, ScreenTopImage, TextField} from '../../Components';
import {Colors, Icons, Images, Metrix, NavigationService} from '../../Config';
import {ToastError, fonts} from '../../Config/Helper';
import {AuthAction} from '../../Redux/Actions';
import {AuthMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';
import messaging from '@react-native-firebase/messaging';

const Login = ({route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const {screen} = route?.params ?? {};

  // const [email, setEmail] = useState('cc@gmail.com');
  // const [password, setPassword] = useState('Sana@123');

  // const [email, setEmail] = useState('sarah@gmail.com');
  // const [  password, setPassword] = useState('Sarah@123');
  // const [email, setEmail] = useState('mike@gmail.com');
  // const [password, setPassword] = useState('Mike@123');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [seePassword, setSeePassword] = useState(false);
  const [focusedField, setFocusedField] = useState('email');

  const signIn = async () => {
    if (!email || !password) {
      return Toast.show(ToastError(t('ALL_FIELDS_REQUIRED')));
    }
    const firebaseToken = await messaging().getToken();

    const data = {
      email_address: email?.toLowerCase(),
      password,
    };
    dispatch(AuthMiddleware.Login(data, firebaseToken, t));
  };

  const handleFocus = field => {
    setFocusedField(field);
  };

  const onBackPress = () => {
    dispatch(AuthAction.UpdateTempUser({fanLoggedIn: true}));
    screen
      ? NavigationService.resetStack('AuthStack')
      : NavigationService.goBack();
  };

  return (
    <View style={gstyles.container}>
      <AuthHeader
        greeting={t('WELCOME_SHOLIV')}
        title={t('SIGN_IN_TO_YOUR_ACCOUNT')}
        // containerStyle={{paddingTop: Metrix.VerticalSize(0)}}
      />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[gstyles.justifyAlignCenter]}>
          <ScreenTopImage
            image={Images.login}
            size={300}
            rounded={false}
            resizeMode="contain"
          />
        </View>

        <View style={{marginTop: Metrix.VerticalSize(-50)}}>
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

          <KeyboardAvoidingView
            behavior="height"
            style={gstyles.marginVertical20}>
            <TextField
              value={password}
              placeholder="**************"
              label={t('PASSWORD')}
              secureTextEntry={!seePassword}
              focused={focusedField === 'password'}
              onFocus={() => handleFocus('password')}
              onChangeText={text => setPassword(text)}
              icon={
                <Icons.EvilIcons
                  name={'lock'}
                  color={Colors.blue}
                  size={Metrix.customFontSize(28)}
                />
              }
              postIcon={
                <TouchableOpacity onPress={() => setSeePassword(!seePassword)}>
                  <Icons.Feather
                    name={seePassword ? 'eye' : 'eye-off'}
                    color={Colors.blue}
                    size={Metrix.customFontSize(20)}
                  />
                </TouchableOpacity>
              }
            />
          </KeyboardAvoidingView>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => NavigationService.navigate('ForgotPassword')}>
              <Text allowFontScaling={false} style={styles.forgotPassword}>{t('FORGOT_PASSWORD')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[gstyles.marginTop70, gstyles.marginBottom50]}>
            <Button
              buttonText={t('SIGN_IN')}
              onPress={signIn}
              btnStyle={gstyles.marginTop10}
            />
            <View
              style={[gstyles.centeredAlignedRow, gstyles.marginVertical20]}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>
                {t('DONT_HAVE_AN_ACCOUNT')}
                <TouchableOpacity
                  onPress={() => NavigationService.navigate('Signup')}>
                  <Text allowFontScaling={false} style={styles.forgotPassword}> {t('SIGN_UP')}</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Metrix.HorizontalSize(10),
  },
  forgotPassword: {
    color: Colors.blue,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(15),
    marginLeft: Metrix.VerticalSize(10),
    textDecorationLine: 'underline',
  },
  welcomeContainer: {
    // backgroundColor: 'red',
    paddingHorizontal: Metrix.HorizontalSize(14),
  },
  welcomeText: {
    color: 'white',
    fontSize: Metrix.FontLarge,
    fontWeight: 'bold',
  },
});
