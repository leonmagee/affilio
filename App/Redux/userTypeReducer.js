import { USER_TYPE } from './actions';

export const userTypeReducer = (state = null, action) => {
  switch (action.type) {
    case USER_TYPE:
      return action.payload;
    default:
      return state;
  }
};
