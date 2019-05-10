import { combineReducers } from 'redux';

/**
 * Import Reducers
 */
import { userTypeReducer } from './userTypeReducer';

/**
 * Combine Reducers
 */
export const reducer = combineReducers({
  userType: userTypeReducer,
});
