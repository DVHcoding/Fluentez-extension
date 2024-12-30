// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { combineReducers } from '@reduxjs/toolkit';
import { userApi } from './api/userApi';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
// ##########################
const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
});

export default rootReducer;
