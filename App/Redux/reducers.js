import { combineReducers } from 'redux';

/**
 * Import Reducers
 */
import { loggedInReducer } from './loggedInReducer';
import { userTypeReducer } from './userTypeReducer';
import { promoFilterReducer } from './promoFilterReducer';

/**
 * Combine Reducers
 */
export const reducer = combineReducers({
  loggedIn: loggedInReducer,
  userType: userTypeReducer,
  promoFilter: promoFilterReducer,
});
