import { USER_TYPE } from './actions';

/**
 * userTypeReducer
 * Returns type of current user
 */
export const userTypeReducer = (state = null, action) => {
  switch (action.type) {
    case USER_TYPE:
      console.log('here is a user type', action.payload);
      return action.payload;
    default:
      return state;
  }
};
