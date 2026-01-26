/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {ZoomVideoSdkProvider} from '@zoom/react-native-videosdk';
import React, {useEffect} from 'react';
import {
  KeyboardAvoidingView,
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {} from 'react-native-iap';
import {usePermission} from './lib';
import IAPProvider from './src/Components/Providers/IAP.Provider';
import {Colors} from './src/Config';
import AppNavigation from './src/Navigation/AppNavigation';
import {Persistor, Store} from './src/Redux';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs();

const MyApp = () => {
  usePermission();

  useEffect(() => {
    (async () => {
      const token = await messaging().getToken();
      console.log('===token===>', JSON.stringify(token, null, 1));
    })();
  }, []);

  return (
    <ZoomVideoSdkProvider
      config={{
        domain: 'zoom.us',
        enableLog: true,
      }}>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.black}}>
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.black} />

        <Provider store={Store}>
          <PersistGate loading={null} persistor={Persistor}>
            <IAPProvider>
              {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView style={{flex: 1}} behavior="height">
                  <AppNavigation />
                </KeyboardAvoidingView>
              ) : (
                <AppNavigation />
              )}
            </IAPProvider>
          </PersistGate>
        </Provider>

        <Toast topOffset={15} autoHide visibilityTime={3000} />
        <KeepAwake />
      </SafeAreaView>
    </ZoomVideoSdkProvider>
  );
};

const zoom_config = {};

function App() {
  return <MyApp />;
}

export default App;
