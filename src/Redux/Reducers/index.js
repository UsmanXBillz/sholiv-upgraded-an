import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AuthReducer from './AuthReducer';
import LoaderReducer from './LoaderReducer';
import GeneralReducer from './generalReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['tempUser'],
  whitelist: ['user', 'isViewedWelcome'],
};

const RootReducer = combineReducers({
  AuthReducer: persistReducer(persistConfig, AuthReducer),
  GeneralReducer,
  LoaderReducer,
});

export default RootReducer;
