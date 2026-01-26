/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // 🔴 THIS RUNS WHEN APP IS BACKGROUND / KILLED

  await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    visibility: AndroidVisibility.PUBLIC,
  });

  // await notifee.displayNotification({
  //   title: remoteMessage.notification?.title ?? 'Notification',
  //   body: remoteMessage.notification?.body ?? '',
  //   android: {
  //     channelId: 'default',
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,
  //     pressAction: {id: 'default'},
  //   },
  // });
});

messaging().onMessage(async message => {
  console.log('===message===>', JSON.stringify(message, null, 1));
  await notifee.displayNotification({
    title: message.notification?.title ?? 'Notification',
    body: message.notification?.body ?? '',
    android: {
      channelId: 'default',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      pressAction: {id: 'default'},
    },
  });
});

// 2️⃣ Notifee background event handler (handles actions)
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    // navigate or log
  }
});

notifee.requestPermission();

AppRegistry.registerComponent(appName, () => App);
