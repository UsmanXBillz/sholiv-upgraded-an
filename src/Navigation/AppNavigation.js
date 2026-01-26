import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {Loader} from '../Components';
import {NavigationService} from '../Config';
import {Login} from '../Screens';
import AppScreens from './AppScreens';
import AuthScreens from './AuthScreens';
import StackNavigationWrapper from './StackNavigationWrapper';

const Stack = createStackNavigator();

//Auth Stack
const AuthStack = () => {
  return <StackNavigationWrapper data={AuthScreens} />;
};

//User Stack
const UserStack = () => {
  return <StackNavigationWrapper data={AppScreens} isUserStack={true} />;
};

//App Navigation

const AppNavigation = () => {
  const user = useSelector(state => state.AuthReducer.user); // useSelector hook to get user from redux store
  const navigatorRef = React.useRef(null); // useRef to store navigator reference

  React.useEffect(() => {
    // Set up the top level navigator reference
    NavigationService.setTopLevelNavigator(navigatorRef.current);
  }, []);

  return (
    <>
      <NavigationContainer ref={navigatorRef}>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={!user ? 'AuthStack' : 'UserStack'}>
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserStack" component={UserStack} />
        </Stack.Navigator>
      </NavigationContainer>
      <Loader />
    </>
  );
};

export default AppNavigation;
