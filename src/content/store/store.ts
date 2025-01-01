// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, type Middleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { userApi } from './api/userApi';
import rootReducer from './rootReducer';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
};

const middlewares = [userApi.middleware] as Middleware[];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(middlewares),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
