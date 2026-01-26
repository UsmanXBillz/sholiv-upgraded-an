import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

interface NotificationProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProps> = props => {
  const {children} = props;

  return children;
};
