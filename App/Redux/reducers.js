import { combineReducers } from 'redux';

/**
 * Import Reducers
 */
import { loggedInReducer } from './loggedInReducer';
import { userTypeReducer } from './userTypeReducer';
import { loginModalReducer } from './loginModalReducer';
// import { promoFilterReducer } from './promoFilterReducer';
// import { promosReducer } from './promosReducer';

/**
 * Combine Reducers
 */
export const reducer = combineReducers({
  loggedIn: loggedInReducer,
  loginModal: loginModalReducer,
  userType: userTypeReducer,
  // promoFilter: promoFilterReducer,
  // promos: promosReducer,
});
