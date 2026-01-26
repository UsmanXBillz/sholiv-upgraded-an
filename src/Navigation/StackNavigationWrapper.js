import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {NotificationProvider} from '../Components/Providers/Notification.Provider';

const Stack = createStackNavigator();

const StackNavigationWrapper = ({
  data,
  initialRouteName = null,
  isUserStack = false,
}) => {
  return (
    <NotificationProvider>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        {data?.map(item => (
          <Stack.Screen
            key={item?.id}
            name={item?.name}
            component={item?.Screen}
            options={{
              blurOnUnmount: true, // This ensures the blur effect is removed when navigating away
              animationEnabled: true, // This ensures the animation is enabled
              animationTypeForReplace: 'push', // This ensures the animation is push
            }}
          />
        ))}
      </Stack.Navigator>
    </NotificationProvider>
  );
};

export default StackNavigationWrapper;
