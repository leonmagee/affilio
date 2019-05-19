import { combineReducers } from 'redux';

/**
 * Import Reducers
 */
import { loggedInReducer } from './loggedInReducer';
import { userTypeReducer } from './userTypeReducer';
import { loginModalReducer } from './loginModalReducer';
import { currentUserReducer } from './currentUserReducer';
import { businessDetailsReducer } from './businessDetailsReducer';
// import { promoFilterReducer } from './promoFilterReducer';
// import { promosReducer } from './promosReducer';

/**
 * Combine Reducers
 */
export const reducer = combineReducers({
  loggedIn: loggedInReducer,
  loginModal: loginModalReducer,
  userType: userTypeReducer,
  currentUser: currentUserReducer,
  businessDetails: businessDetailsReducer,
  // promoFilter: promoFilterReducer,
  // promos: promosReducer,
});
