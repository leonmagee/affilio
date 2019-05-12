import { LOGGED_IN } from './actions';

export const loggedInReducer = (state = null, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return action.payload;
    default:
      return state;
  }
};
