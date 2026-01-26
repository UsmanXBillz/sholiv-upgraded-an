import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import rootReducer from './Reducers';

const Store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});
const Persistor = persistStore(Store);

export {Persistor, Store};
