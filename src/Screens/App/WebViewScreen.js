import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import { NavigationService } from '../../Config';


const WebViewScreen = ({ route }) => {

  const url = route?.params?.link;

  const handleNavigationChange = (navState) => {
    const { url, canGoBack } = navState;

    console.log("onNavigationStateChange-data", navState);

    // Define your final redirect URL
    // const finalUrl = 'https://www.google.com/';

    if (canGoBack) {
      NavigationService.goBack();
      console.log('Redirecting to the final URL:', url);

    }
  };

  return (
    <WebView
      onNavigationStateChange={handleNavigationChange}
      onMessage={(event) => { console.log("onMessage ka event", event) }}
      source={{ uri: url }}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    />
  )
}

export default WebViewScreen

const styles = StyleSheet.create({})