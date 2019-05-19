import { BUSINESS_DETAILS } from './actions';

export const businessDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case BUSINESS_DETAILS:
      return action.payload;
    default:
      return state;
  }
};
